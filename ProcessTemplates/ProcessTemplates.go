package main

import (
	"bufio"
	"bytes"
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"text/template"

	"github.com/Masterminds/sprig/v3"
	jsoniter "github.com/simonwu-os/json-iterator-go"
	flag "github.com/spf13/pflag"
	"gopkg.in/yaml.v2"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

var nonTemplateExtensions = []string{
	".dds",
	".png",
}

var src (string)
var destination (string)
var valuesFiles ([]string)
var resultValues (string)
var singleFile = false

type Values map[string]interface{}
type AnyValue interface{}

func main() {
	// Get the current directory
	rootDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("error getting current directory: %v", err)
	}

	flag.StringVarP(&src, "source", "s", filepath.Base(rootDir), "The source folder to read from")
	flag.StringVarP(&destination, "destination", "d", "build/"+filepath.Base(rootDir), "The destination folder to put things in")
	flag.StringArrayVarP(&valuesFiles, "values", "v", []string{}, "Places to read values files from other than the source folder")
	flag.StringVarP(&resultValues, "result-values", "r", "build/values.yaml", "Place to save the result values to, if any")
	flag.Parse()

	buildDir := destination
	buildInfo, err := os.Stat(destination)
	if err != nil || buildInfo.IsDir() {
		buildDir = filepath.Join(destination, filepath.Base(src))
	}
	singleFile = filepath.Ext(src) != "" && filepath.Ext(destination) != ""

	// Delete all files in the build directory
	err = cleanBuildDirectory(buildDir)
	if err != nil {
		log.Fatalf("error cleaning build directory: %v", err)
	}

	// Build the values map
	values := make(Values)
	for _, valuePath := range append(valuesFiles, src) {
		err = buildValuesMap(valuePath, &values)
		if err != nil {
			log.Fatalf("error building values map: %v", err)
		}
	}

	tmpl := template.New("template").Funcs(sprig.FuncMap())
	tmpl.Funcs(template.FuncMap{
		"include": include(tmpl),
		"getf":    getf,
		"ireplace": func(old string, new string, src string) string {
			searchRegex := regexp.MustCompile("(?i)" + old)
			return searchRegex.ReplaceAllString(src, new)
		},
	})

	// Walk through and process all files
	err = filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		return processFile(path, info, err, values, tmpl)
	})
	if err != nil {
		log.Fatalf("error walking the path: %v", err)
		os.Exit(1)
	}
}

func cleanBuildDirectory(path string) error {
	// Create build directory if not exists
	if _, err := os.Stat(path); os.IsNotExist(err) {
		os.Mkdir(path, os.ModePerm)
	}

	// Remove the results directory if it exists
	err := os.RemoveAll(path)
	if err != nil {
		return err
	}

	log.Println("Build directory cleaned")
	return nil
}

func buildValuesMap(rootDir string, values *Values) error {

	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Ignore buildDir and directories starting with "."
		if info.IsDir() {
			rel, err := filepath.Rel(destination, path)
			if err != nil {
				return err
			}
			if !strings.HasPrefix(rel, "..") || strings.HasPrefix(info.Name(), ".") {
				return filepath.SkipDir
			}
			return nil
		}

		// Check if the file is a .yaml file
		if strings.HasSuffix(info.Name(), ".yaml") {
			// Read the YAML file
			data, err := os.ReadFile(path)
			if err != nil {
				return fmt.Errorf("error reading file %s: %v", path, err)
			}

			// Parse the YAML content
			var fileValue AnyValue
			err = yaml.Unmarshal(data, &fileValue)
			if err != nil {
				return fmt.Errorf("error parsing YAML in file %s: %v", path, err)
			}

			// Get the file name without extension
			fileName := strings.TrimSuffix(info.Name(), filepath.Ext(info.Name()))

			// Add the parsed values to the main values map
			parts := strings.Split(fileName, ".")
			current := *values
			for i, part := range parts {
				if part == "" {
					continue
				}
				if i == len(parts)-1 {
					// Last part, assign the actual value
					current[part] = fileValue
				} else {
					// Create nested map if it doesn't exist
					if _, exists := current[part]; !exists {
						current[part] = make(Values)
					}

					if currentPart, ok := current[part].(Values); ok {
						current = currentPart
					} else {
						err = &yaml.TypeError{}
					}
				}
			}
		}

		// Struct for parsing XML content
		type Content struct {
			ContentUID string `xml:"contentuid,attr"`
			Text       string `xml:",chardata"`
		}

		type ContentList struct {
			Contents []Content `xml:"content"`
		}

		// Handle .loca.xml files
		if strings.HasSuffix(info.Name(), ".loca.xml") {
			// Read the XML file
			data, err := os.ReadFile(path)
			if err != nil {
				return fmt.Errorf("error reading file %s: %v", path, err)
			}

			// Parse the XML content
			var contentList ContentList
			err = xml.Unmarshal(data, &contentList)
			if err != nil {
				return fmt.Errorf("error parsing XML in file %s: %v", path, err)
			}

			// Add the parsed values to the main values map
			if _, exists := (*values)["loca"]; !exists {
				(*values)["loca"] = make(Values)
			}
			locaValues := (*values)["loca"].(Values)
			for _, content := range contentList.Contents {
				locaValues[content.ContentUID] = replacePlaceholdersAndTags(content.Text)
			}
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("error processing YAML files: %v", err)
	}

	yamlData, err := yaml.Marshal(values)
	if err != nil {
		fmt.Printf("  Error marshaling YAML: %v\n", err)
	} else if resultValues != "" {
		filePath := resultValues
		resultInfo, err := os.Stat(resultValues)
		if err == nil && resultInfo.IsDir() {
			filePath = filepath.Join(resultValues, "values.yaml")
		}
		err = os.WriteFile(filePath, yamlData, 0644)
		if err != nil {
			fmt.Printf("error writing values.yaml: %v", err)
		}
	}

	return nil
}

// Function to replace [1], [2], etc., with %s and remove XML tags
func replacePlaceholdersAndTags(text string) string {
	// Replace placeholders
	rePlaceholder := regexp.MustCompile(`\[\d+\]`)
	text = rePlaceholder.ReplaceAllString(text, "%s")

	// Remove XML tags and retain inner text
	reTags := regexp.MustCompile(`<.*?>`)
	text = reTags.ReplaceAllString(text, "**")

	return strings.TrimSpace(text)
}

func include(tmpl *template.Template) func(name string, data interface{}) (string, error) {
	return func(name string, data interface{}) (string, error) {
		buf := new(bytes.Buffer)
		err := tmpl.ExecuteTemplate(buf, name, data)
		if err != nil {
			return "", err
		}
		return buf.String(), nil
	}
}

func getf(obj Values, key string, args ...interface{}) string {
	format := ""
	if val, ok := obj[key].(string); ok {
		format = val
	}
	return fmt.Sprintf(format, args...)
}

func processFile(path string, info os.FileInfo, err error, values Values, tmpl *template.Template) error {
	if err != nil {
		log.Printf("prevent panic by handling failure accessing a path %q: %v\n", path, err)
		return err
	}
	if info.IsDir() {
		return nil // Skip directories
	}
	if strings.HasPrefix(filepath.Base(path), ".") {
		return nil // Skip hidden files
	}

	// Create the output directory structure
	outputPath := destination

	if !singleFile {
		rel, err := filepath.Rel(src, path)
		if err != nil {
			log.Printf("prevent panic by handling failure accessing a path %q: %v\n", path, err)
			return err
		}
		outputDir := filepath.Join(destination, filepath.Dir(rel))
		err = os.MkdirAll(outputDir, os.ModePerm)
		if err != nil {
			log.Printf("error creating output directory %s: %v", outputDir, err)
			return err
		}

		outputPath = filepath.Join(outputDir, filepath.Base(path))
	}

	// Check if the file should be excluded from template processing
	if isExcluded(path) {
		return copyFile(path, outputPath)
	}

	// Read file content
	content, err := os.ReadFile(path)
	if err != nil {
		log.Printf("error reading file %s: %v", path, err)
		return err
	}

	var builder strings.Builder
	scanner := bufio.NewScanner(strings.NewReader(string(content)))
	for scanner.Scan() {
		line := scanner.Text()
		if !strings.HasPrefix(line, "//") {
			builder.WriteString(line + "\n")
		}
	}
	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading string:", err)
	}
	text := builder.String()

	// Parse and execute template

	_, err = tmpl.Parse(text)
	if err != nil {
		log.Printf("error parsing template %s: %v", path, err)
		return err
	}

	// Execute the template
	var buf bytes.Buffer
	err = tmpl.Execute(&buf, values)
	if err != nil {
		log.Printf("error executing template for file %s: %v", path, err)
		return err
	}

	// Check if the file is a YAML file
	if filepath.Ext(path) == ".yaml" || filepath.Ext(path) == ".yml" {
		// Change the output file extension to .json
		outputPath = strings.TrimSuffix(outputPath, filepath.Ext(outputPath)) + ".json"

		// Parse YAML
		var data interface{}
		err = yaml.Unmarshal(buf.Bytes(), &data)
		if err != nil {
			log.Printf("error parsing YAML file %s: %v", path, err)
			return err
		}

		// Convert to JSON
		jsonData, err := json.MarshalIndent(data, "", "  ")
		if err != nil {
			log.Printf("error converting YAML to JSON for file %s: %v", path, err)
			return err
		}

		// Write JSON to the output file
		err = os.WriteFile(outputPath, jsonData, 0644)
		if err != nil {
			log.Printf("error writing JSON file %s: %v", outputPath, err)
			return err
		}
	} else {
		// For non-YAML files, write the processed content as-is
		err = os.WriteFile(outputPath, buf.Bytes(), 0644)
		if err != nil {
			log.Printf("error writing output file %s: %v", outputPath, err)
			return err
		}
	}

	log.Printf("Processed and created: %s", outputPath)
	return nil
}

func isExcluded(path string) bool {
	lowercasePath := strings.ToLower(path)
	for _, ext := range nonTemplateExtensions {
		if strings.HasSuffix(lowercasePath, strings.ToLower(ext)) {
			return true
		}
	}
	return false
}

func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	if err != nil {
		return err
	}

	log.Printf("Copied file: %s", dst)
	return nil
}
