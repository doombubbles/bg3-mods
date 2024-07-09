package main

import (
	"bytes"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/Masterminds/sprig/v3"
	"gopkg.in/yaml.v2"
)

type Values map[string]interface{}

var excludedExtensions = []string{
	".dds",
}

const buildDir = "build"

func main() {
	// Mod folder name should be the same as root dir
	var rootDir, err = os.Getwd()
	if err != nil {
		log.Fatalf("error getting current directory: %v", err)
	}
	rootDir = filepath.Base(rootDir)

	// Delete all files in the build directory
	err = cleanBuildDirectory(filepath.Join(buildDir, rootDir))
	if err != nil {
		log.Fatalf("error cleaning build directory: %v", err)
	}

	// Read the values from values.yaml
	var values Values = nil
	valuesData, err := os.ReadFile("values.yaml")
	if err == nil {
		err = yaml.Unmarshal(valuesData, &values)
		if err != nil {
			log.Fatalf("error parsing values.yaml: %v", err)
		}
	}

	// Walk through and process all files
	err = filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
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

	outputFile, err := os.Create(outputPath)
	if err != nil {
		log.Printf("error creating output file %s: %v", outputPath, err)
		return err
	}
	defer outputFile.Close()

	// Execute the template and write to the output file
	err = tmpl.Execute(outputFile, values)
	if err != nil {
		log.Printf("error executing template for file %s: %v", path, err)
		return err
	}

	log.Printf("Processed and created: %s", outputPath)
	return nil
}

func isExcluded(path string) bool {
	lowercasePath := strings.ToLower(path)
	for _, ext := range excludedExtensions {
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
