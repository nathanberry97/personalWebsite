package main

import "os"

func main() {
	// Set the environment variables
	setEnv()
	secret := os.Getenv("NASA_API_KEY")
	region := os.Getenv("AWS_REGION")
	bucket := os.Getenv("S3_BUCKET")

	// Create an S3 client and format the url
	svc := s3Client(region)
	url := "https://api.nasa.gov/planetary/apod?api_key=" + secret

	// Fetch data, format it, and upload it to S3
	data := getData(url)
	html := formatData(data)
	htmlTemplate := updateHtmlTemplate(html, "./template.html")
	uploadToS3(htmlTemplate, svc, bucket)
}
