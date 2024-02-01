package main

import "os"

func main() {
	// Set the environment variables and url
	setEnv()
	secret := os.Getenv("NASA_API_KEY")
	url := "https://api.nasa.gov/planetary/apod?api_key=" + secret

	// Fetch data, format it, and upload it to S3
	data := getData(url)
	html := formatData(data)
	htmlTemplate := updateHtmlTemplate(html, "./template.html")
	saveHtml(htmlTemplate)
}
