package scss

import (
	"crypto/sha256"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
)

func CompileSCSS(inputPath, outputDir string) string {
	tempOutput := filepath.Join(outputDir, "style.tmp.css")

	cmd := exec.Command("sass", inputPath, tempOutput, "--no-source-map")
	if err := cmd.Run(); err != nil {
		panic(err)
	}

	file, err := os.Open(tempOutput)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	hasher := sha256.New()
	if _, err := io.Copy(hasher, file); err != nil {
		panic(err)
	}
	hash := fmt.Sprintf("%x", hasher.Sum(nil))[:8]

	hashedFilename := fmt.Sprintf("style-%s.css", hash)
	finalOutput := filepath.Join(outputDir, hashedFilename)

	if err := os.Rename(tempOutput, finalOutput); err != nil {
		panic(err)
	}

	fmt.Println("Compiled :", inputPath, "->", finalOutput)

	return hashedFilename
}
