package scss

import (
	"crypto/sha256"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func CompileSCSS(inputPath, outputDir string) string {
	tempOutput := filepath.Join(outputDir, "style.tmp.css")

	cmd := exec.Command("sass", inputPath, tempOutput, "--no-source-map")
	if err := cmd.Run(); err != nil {
		log.Fatal(fmt.Sprintf("SCSS compilation failed: %v", err))
	}

	file, err := os.Open(tempOutput)
	if err != nil {
		log.Fatal(fmt.Sprintf("Failed to open temporary output file %s: %v", tempOutput, err))
	}
	defer file.Close()

	hasher := sha256.New()
	if _, err := io.Copy(hasher, file); err != nil {
		log.Fatal(fmt.Sprintf("Failed to copy contents of %s to hasher: %v", tempOutput, err))
	}
	hash := fmt.Sprintf("%x", hasher.Sum(nil))[:8]

	hashedFilename := fmt.Sprintf("style-%s.css", hash)
	finalOutput := filepath.Join(outputDir, hashedFilename)

	if err := os.Rename(tempOutput, finalOutput); err != nil {
		os.Remove(tempOutput)
		log.Fatal(fmt.Sprintf("Failed to rename temporary file %s to final output %s: %v", tempOutput, finalOutput, err))
	}

	fmt.Println("Compiled :", inputPath, "->", finalOutput)

	return hashedFilename
}
