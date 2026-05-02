package pandoc

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func ConvertMarkdown(inputDir, outputDir, templatePath string) error {
	pattern := filepath.Join(inputDir, "**", "*.md")

	files, err := filepath.Glob(pattern)
	if err != nil {
		return fmt.Errorf("glob failed: %w", err)
	}

	for _, path := range files {
		filename := strings.TrimSuffix(filepath.Base(path), ".md") + ".html"
		outputPath := filepath.Join(outputDir, filename)

		cmd := exec.Command(
			"pandoc",
			"-s",
			path,
			"--template", templatePath,
			"-o", outputPath,
			"--quiet",
		)

		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			return fmt.Errorf("failed converting %s: %w", path, err)
		}

		fmt.Println("Converted:", path, "->", outputPath)
	}

	return nil
}
