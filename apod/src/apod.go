package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func getData(url string) Apod {
	// Make the request
	res, err := http.Get(url)
	checkErr(err)
	defer res.Body.Close()

	// Read the response body
	resBody, err := io.ReadAll(res.Body)
	checkErr(err)

	// Unmarshal the response body into Apod struct
	var apodData Apod
	json.Unmarshal(resBody, &apodData)

	return apodData
}

func formatData(apodData Apod) ApodHtml {
	// Check if the media type is a video or image
	image := "<img src=\"" + apodData.Hdurl + "\">"
	if apodData.MediaType == "video" {
		image = "<iframe width=\"960\" height=\"540\" src=\"" + apodData.Url + "\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen=\"\"></iframe>"
	}

	// Check if there is a copyright associated with the image
	copyRight := "<h4> Copyright: <a href=\"https://apod.nasa.gov/apod/astropix.html\">NASA APOD</a> </h4>"
	if apodData.CopyRight != "" {
		formatCopyRight := strings.Replace(apodData.CopyRight, "\n", " ", -1)
		copyRight = "<h4> Copyright: " + formatCopyRight + " </h4>"
	}

	// Format the data into ApodHtml struct
	var apodHtml ApodHtml
	apodHtml.Title = "<h1>" + apodData.Title + "</h1>"
	apodHtml.Date = "<h3>" + apodData.Date + "</h3>"
	apodHtml.Explanation = "<p>" + apodData.Explanation + "</p>"
	apodHtml.Image = image
	apodHtml.CopyRight = copyRight

	return apodHtml
}

func updateHtmlTemplate(apodHtml ApodHtml, templatePath string) string {
	// Read the html template
	htmlTemplate, err := os.ReadFile(templatePath)
	checkErr(err)

	// Replace the template with the data
	html := string(htmlTemplate)
	html = strings.Replace(html, "{{title}}", apodHtml.Title, -1)
	html = strings.Replace(html, "{{date}}", apodHtml.Date, -1)
	html = strings.Replace(html, "{{image}}", apodHtml.Image, -1)
	html = strings.Replace(html, "{{explanation}}", apodHtml.Explanation, -1)
	html = strings.Replace(html, "{{copyRight}}", apodHtml.CopyRight, -1)

	return html
}

func uploadToS3(html string, region string, bucket string) {
	// Create a new session
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(region),
	}))

	// Create a new S3 client
	svc := s3.New(sess)

	// Upload the html file to S3
	_, err := svc.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String("apod.html"),
		ContentType: aws.String("text/html"),
		Body:        strings.NewReader(html),
	})

	checkErr(err)
}
