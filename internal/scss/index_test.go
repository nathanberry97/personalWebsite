package scss

import (
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestCompileSCSS(t *testing.T) {
	// Arrange
	checkScssInstalled(t)

	inputFile := createInputFile(t, "body { color: red; }")
	defer os.Remove(inputFile)

	outputDir := createOutputDir(t)
	defer os.RemoveAll(outputDir)

	// Act
	outputFile, err := CompileSCSS(inputFile, outputDir)
	if err != nil {
		t.Fatalf("CompileSCSS failed: %v", err)
	}

	// Assert
	finalOutputPath := filepath.Join(outputDir, outputFile)
	if _, err := os.Stat(finalOutputPath); os.IsNotExist(err) {
		t.Errorf("Expected output file %s does not exist", finalOutputPath)
	}
}

func TestCompileSCSS_MissingInput(t *testing.T) {
	// Arrange
	outputDir := createOutputDir(t)
	defer os.RemoveAll(outputDir)

	// Act
	_, err := CompileSCSS("nonexistent.scss", outputDir)

	// Assert
	if err == nil {
		t.Errorf("Expected an error for missing input file, but got none")
	}
}

func TestCompileSCSS_InvalidSCSS(t *testing.T) {
	// Arrange
	checkScssInstalled(t)

	inputFile := createInputFile(t, "body { color: red")
	defer os.Remove(inputFile)

	outputDir := createOutputDir(t)
	defer os.RemoveAll(outputDir)

	// Act
	_, err := CompileSCSS(inputFile, outputDir)

	// Assert
	if err == nil {
		t.Errorf("Expected an error for invalid SCSS syntax, but got none")
	}
}

/**
 * Helper functions
 */

func checkScssInstalled(t *testing.T) {
	_, err := exec.LookPath("sass")
	if err != nil {
		t.Skip("Skipping test: 'sass' binary not found in PATH")
	}
}

func createOutputDir(t *testing.T) string {
	outputDir, err := os.MkdirTemp("", "scss-output")
	if err != nil {
		t.Fatalf("Failed to create temp output directory: %v", err)
	}

	return outputDir
}

func createInputFile(t *testing.T, body string) string {
	inputFile, err := createTempSCSSFile(body)
	if err != nil {
		t.Fatalf("Failed to create temp SCSS file: %v", err)
	}

	return inputFile
}

func createTempSCSSFile(content string) (string, error) {
	tmpFile, err := os.CreateTemp("", "*.scss")
	if err != nil {
		return "", err
	}
	defer tmpFile.Close()

	_, err = tmpFile.WriteString(content)
	if err != nil {
		return "", err
	}

	return tmpFile.Name(), nil
}
