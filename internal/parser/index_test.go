package parser

import (
	"os"
	"path/filepath"
	"testing"
)

func TestGetBlogPosts(t *testing.T) {
	// Arrange
	setupTempDir(t)
	content1 := "# Post One\n\n## 2024-02-20\n\nSome content."
	content2 := "# Post Two\n\n## 2024-02-25\n\nSome content."

	_, err := createTempMarkdownFile("web/posts", "post1.md", content1)
	if err != nil {
		t.Fatalf("Failed to create post1.md: %v", err)
	}
	_, err = createTempMarkdownFile("web/posts", "post2.md", content2)
	if err != nil {
		t.Fatalf("Failed to create post2.md: %v", err)
	}

	// Act
	blogPosts, err := GetBlogPosts()
	if err != nil {
		t.Fatalf("GetBlogPosts failed: %v", err)
	}

	// Assert
	if len(blogPosts) != 2 {
		t.Fatalf("Expected 2 blog posts, got %d", len(blogPosts))
	}

	if blogPosts[0].Date != "2024-02-25" {
		t.Errorf("Expected first post to be from 2024-02-25, got %s", blogPosts[0].Date)
	}

	expectedLink := "blog/post2.html"
	if blogPosts[0].Link != expectedLink {
		t.Errorf("Expected link %s, got %s", expectedLink, blogPosts[0].Link)
	}

	cleanUpTests(t)
}

func TestGetBlogPosts_MissingDirectory(t *testing.T) {
	// Act
	_, err := GetBlogPosts()

	// Assert
	if err == nil {
		t.Errorf("Expected error for missing 'web/posts' directory, but got none")
	}
}

func TestGetBlogPosts_InvalidPostFormat(t *testing.T) {
	// Arrange
	setupTempDir(t)
	content := "# Missing Date Post\n\nSome content."

	_, err := createTempMarkdownFile("web/posts", "invalid.md", content)
	if err != nil {
		t.Fatalf("Failed to create invalid.md: %v", err)
	}

	// Act
	_, err = GetBlogPosts()

	// Assert
	if err == nil {
		t.Errorf("Expected error due to missing date, but got none")
	}

	cleanUpTests(t)
}

/**
 * Helper functions
 */

func setupTempDir(t *testing.T) {
	postsDir, err := os.MkdirTemp("", "blog-posts")
	if err != nil {
		t.Fatalf("Failed to create temp posts directory: %v", err)
	}
	defer os.RemoveAll(postsDir)

	originalDir := "web/posts"
	_ = os.Rename(originalDir, "web/posts_backup")
	defer os.Rename("web/posts_backup", originalDir)

	_ = os.RemoveAll("web/posts")
	err = os.MkdirAll("web/posts", 0755)
	if err != nil {
		t.Fatalf("Failed to create web/posts directory: %v", err)
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

func cleanUpTests(t *testing.T) {
	webDir := "web"
	if err := os.RemoveAll(webDir); err != nil {
		t.Fatalf("Failed to remove %s: %v", webDir, err)
	}
}
