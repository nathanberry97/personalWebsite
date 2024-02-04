package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

/*
 * Unit tests for getApod function
 */
func mockServer() *httptest.Server {
	mockData := []byte(
		`{
            "date": "2017-01-01",
            "explanation": "Test Explanation",
            "hdurl": "http://test.com",
            "media_type": "image",
            "service_version": "v1",
            "title": "Test Title",
            "url": "http://test.com"
        }`,
	)

	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write(mockData)
	}))

	return mockServer
}

func TestGetApod(t *testing.T) {
	// Arrange
	mockServer := mockServer()
	defer mockServer.Close()

	// Act
	result := getData(mockServer.URL)

	// Assert
	assert(t, "2017-01-01", result.Date)
	assert(t, "Test Explanation", result.Explanation)
	assert(t, "http://test.com", result.Hdurl)
	assert(t, "image", result.MediaType)
	assert(t, "v1", result.ServiceVersion)
	assert(t, "Test Title", result.Title)
	assert(t, "http://test.com", result.Url)
}

/*
 * Unit tests for formatData function
 */
func arrageApodType(mediaType string, copyRight string) Apod {
	data := Apod{
		Date:           "2017-01-01",
		Explanation:    "Test Explanation",
		Hdurl:          "http://test.com",
		MediaType:      mediaType,
		ServiceVersion: "v1",
		Title:          "Test Title",
		Url:            "http://test.com",
	}

	if copyRight != "" {
		data.CopyRight = copyRight
	}

	return data
}

func TestFormatDataImage(t *testing.T) {
	// Arrange
	mockApod := arrageApodType("image", "Test CopyRight")

	// Act
	result := formatData(mockApod)

	// Assert
	assert(t, "<h1>Test Title</h1>", result.Title)
	assert(t, "<h3>2017-01-01</h3>", result.Date)
	assert(t, "<p>Test Explanation</p>", result.Explanation)
	assert(t, "<img src=\"http://test.com\">", result.Image)
	assert(t, "<h4> Copyright: Test CopyRight </h4>", result.CopyRight)
}

func TestFormatDataVideo(t *testing.T) {
	// Arrange
	mockApod := arrageApodType("video", "Test CopyRight")

	// Act
	result := formatData(mockApod)

	// Assert
	assert(t, "<h1>Test Title</h1>", result.Title)
	assert(t, "<h3>2017-01-01</h3>", result.Date)
	assert(t, "<p>Test Explanation</p>", result.Explanation)
	assert(t, "<iframe width=\"960\" height=\"540\" src=\"http://test.com\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen=\"\"></iframe>", result.Image)
	assert(t, "<h4> Copyright: Test CopyRight </h4>", result.CopyRight)
}

func TestFormatDataNoCopyRight(t *testing.T) {
	// Arrange
	mockApod := arrageApodType("image", "")

	// Act
	result := formatData(mockApod)

	// Assert
	assert(t, "<h1>Test Title</h1>", result.Title)
	assert(t, "<h3>2017-01-01</h3>", result.Date)
	assert(t, "<p>Test Explanation</p>", result.Explanation)
	assert(t, "<img src=\"http://test.com\">", result.Image)
	assert(t, "<h4> Copyright: <a href=\"https://apod.nasa.gov/apod/astropix.html\">NASA APOD</a> </h4>", result.CopyRight)
}

/*
 * Unit tests for updateHtmlTemplate function
 */
func arrageApodHtmlType() ApodHtml {
	mockData := ApodHtml{
		Title:       "<h1>Test Title</h1>",
		Date:        "<h3>2017-01-01</h3>",
		Image:       "<img src=\"http://test.com\">",
		Explanation: "<p>Test Explanation</p>",
		CopyRight:   "<h4>Test CopyRight</h4>",
	}

	return mockData
}

func arrageMockHtmlTemplate(templatePath string, mockApodHtml ApodHtml) string {
	mockHtmlTemplate, err := os.ReadFile(templatePath)
	checkErr(err)

	mockHtml := string(mockHtmlTemplate)
	mockHtml = strings.Replace(mockHtml, "{{title}}", mockApodHtml.Title, -1)
	mockHtml = strings.Replace(mockHtml, "{{date}}", mockApodHtml.Date, -1)
	mockHtml = strings.Replace(mockHtml, "{{image}}", mockApodHtml.Image, -1)
	mockHtml = strings.Replace(mockHtml, "{{explanation}}", mockApodHtml.Explanation, -1)
	mockHtml = strings.Replace(mockHtml, "{{copyRight}}", mockApodHtml.CopyRight, -1)

	return mockHtml
}

func TestUpdateHtmlTemplate(t *testing.T) {
	// Arrange
	templatePath := "../template.html"
	mockApodHtml := arrageApodHtmlType()
	mockHtml := arrageMockHtmlTemplate(templatePath, mockApodHtml)

	// Act
	result := updateHtmlTemplate(mockApodHtml, templatePath)

	// Assert
	assert(t, mockHtml, result)
}
