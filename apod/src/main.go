package main

import "os"

func main() {
	// Set the environment variables
	setEnv("./.env")
	region := os.Getenv("AWS_REGION")
	bucket := os.Getenv("S3_BUCKET")
	secret := os.Getenv("NASA_API_KEY")

	// Fetch data, format it, and upload it to S3
	data := getData("https://api.nasa.gov/planetary/apod?api_key=" + secret)
	html := formatData(data)
	htmlTemplate := updateHtmlTemplate(html, "./template.html")
	uploadToS3(htmlTemplate, region, bucket)
}
