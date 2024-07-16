package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/Masterminds/sprig/v3"
	jsoniter "github.com/simonwu-os/json-iterator-go"
	"gopkg.in/yaml.v2"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

var nonTemplateExtensions = []string{
	".dds",
}

const buildDir = "build"

type Values map[string]interface{}
type AnyValue interface{}

func main() {
	// Get the current directory
	rootDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("error getting current directory: %v", err)
	}

	modDir := filepath.Base(rootDir)

	// Delete all files in the build directory
	err = cleanBuildDirectory(filepath.Join(buildDir, modDir))
	if err != nil {
		log.Fatalf("error cleaning build directory: %v", err)
	}

	// Build the values map
	values, err := buildValuesMap(modDir)
	if err != nil {
		log.Fatalf("error building values map: %v", err)
	}

	// Walk through and process all files
	err = filepath.Walk(modDir, func(path string, info os.FileInfo, err error) error {
		return processFile(path, info, err, values)
	})
	if err != nil {
		log.Fatalf("error walking the path: %v", err)
	}
}

func cleanBuildDirectory(path string) error {
	// Create build directory if not exists
	if _, err := os.Stat(path); os.IsNotExist(err) {
		os.Mkdir(buildDir, os.ModePerm)
	}

	// Remove the results directory if it exists
	err := os.RemoveAll(path)
	if err != nil {
		return err
	}

	log.Println("Build directory cleaned")
	return nil
}

func buildValuesMap(rootDir string) (Values, error) {
	values := make(Values)

	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Ignore buildDir and directories starting with "."
		if info.IsDir() {
			if info.Name() == buildDir || strings.HasPrefix(info.Name(), ".") {
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
			current := values
			for i, part := range parts {
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

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("error processing YAML files: %v", err)
	}

	yamlData, err := yaml.Marshal(values)
	if err != nil {
		fmt.Printf("  Error marshaling YAML: %v\n", err)
	} else {
		fmt.Printf("%s\n", string(yamlData))
		filePath := filepath.Join(buildDir, "values.yaml")
		err = os.WriteFile(filePath, yamlData, 0644)
		if err != nil {
			fmt.Printf("error writing values.yaml: %v", err)
		}
	}

	return values, nil
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

func processFile(path string, info os.FileInfo, err error, values Values) error {
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
	outputDir := filepath.Join(buildDir, filepath.Dir(path))
	err = os.MkdirAll(outputDir, os.ModePerm)
	if err != nil {
		log.Printf("error creating output directory %s: %v", outputDir, err)
		return err
	}

	outputPath := filepath.Join(outputDir, filepath.Base(path))

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

	text := string(content)

	// Parse and execute template
	tmpl := template.New("template").Funcs(sprig.FuncMap())
	tmpl.Funcs(template.FuncMap{
		"include": include(tmpl),
	})

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
