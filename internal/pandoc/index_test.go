package pandoc

import (
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestConvertMarkdown(t *testing.T) {
	// Arrange
	checkPandocInstalled(t)

	inputDir, outputDir := createTempDirs(t)
	defer os.RemoveAll(inputDir)
	defer os.RemoveAll(outputDir)

	_, err := createTempMarkdownFile(inputDir, "test.md", "# Hello\n\nThis is a test.")
	if err != nil {
		t.Fatalf("Failed to create temp Markdown file: %v", err)
	}

	templateFile, err := os.CreateTemp("", "template.html")
	if err != nil {
		t.Fatalf("Failed to create temp template file: %v", err)
	}
	defer os.Remove(templateFile.Name())

	// Act
	err = ConvertMarkdown(inputDir, outputDir, templateFile.Name())
	if err != nil {
		t.Fatalf("ConvertMarkdown failed: %v", err)
	}

	// Assert
	expectedOutputFile := filepath.Join(outputDir, "test.html")
	if _, err := os.Stat(expectedOutputFile); os.IsNotExist(err) {
		t.Errorf("Expected output file %s does not exist", expectedOutputFile)
	}
}

func TestConvertMarkdown_MissingInputDir(t *testing.T) {
	// Arrange
	inputDir, outputDir := createTempDirs(t)
	defer os.RemoveAll(inputDir)
	defer os.RemoveAll(outputDir)

	templateFile, err := os.CreateTemp("", "template.html")
	if err != nil {
		t.Fatalf("Failed to create temp template file: %v", err)
	}
	defer os.Remove(templateFile.Name())

	// Act
	err = ConvertMarkdown("nonexistent-dir", outputDir, templateFile.Name())

	// Assert
	if err == nil {
		t.Errorf("Expected an error for missing input directory, but got none")
	}
}

func TestConvertMarkdown_InvalidTemplate(t *testing.T) {
	// Arrange
	checkPandocInstalled(t)
	inputDir, outputDir := createTempDirs(t)
	defer os.RemoveAll(inputDir)
	defer os.RemoveAll(outputDir)

	_, err := createTempMarkdownFile(inputDir, "test.md", "# Hello\n\nThis is a test.")
	if err != nil {
		t.Fatalf("Failed to create temp Markdown file: %v", err)
	}

	// Act
	err = ConvertMarkdown(inputDir, outputDir, "nonexistent-template.html")

	// Assert
	if err == nil {
		t.Errorf("Expected an error for missing template file, but got none")
	}
}

/**
 * Helper functions
 */

func checkPandocInstalled(t *testing.T) {
	_, err := exec.LookPath("pandoc")
	if err != nil {
		t.Skip("Skipping test: 'pandoc' binary not found in PATH")
	}
}

func createTempMarkdownFile(dir, filename, content string) (string, error) {
	filePath := filepath.Join(dir, filename)

	err := os.WriteFile(filePath, []byte(content), 0644)
	if err != nil {
		return "", err
	}

	return filePath, nil
}

func createTempDirs(t *testing.T) (string, string) {
	inputDir, err := os.MkdirTemp("", "markdown-input")
	if err != nil {
		t.Fatalf("Failed to create temp input directory: %v", err)
	}

	outputDir, err := os.MkdirTemp("", "markdown-output")
	if err != nil {
		t.Fatalf("Failed to create temp output directory: %v", err)
	}

	return inputDir, outputDir
}
