package pandoc

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func ConvertMarkdown(inputDir, outputDir, templatePath string) {
	files, err := os.ReadDir(inputDir)
	if err != nil {
		log.Fatal(fmt.Sprintf("Failed to read directory %s: %v", inputDir, err))
	}

	for _, file := range files {
		if file.IsDir() || filepath.Ext(file.Name()) != ".md" {
			continue
		}

		inputPath := filepath.Join(inputDir, file.Name())
		outputPath := filepath.Join(outputDir, file.Name()[:len(file.Name())-3]+".html")

		cmd := exec.Command("pandoc", "-s", inputPath, "--template", templatePath, "-o", outputPath, "--quiet")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			log.Fatal(fmt.Sprintf("Failed to convert Markdown file %s to HTML: %v", inputPath, err))
		}
		fmt.Println("Converted:", inputPath, "->", outputPath)
	}
}
