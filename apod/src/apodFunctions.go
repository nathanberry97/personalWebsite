package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"
)

func getData() Apod {
	// Set the url for the request
	secret := os.Getenv("NASA_API_KEY")
	url := "https://api.nasa.gov/planetary/apod?api_key=" + secret

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

	// Check if there is a copyRight associated with the image
	copyRight := "<h4> CopyRight: <a href=\"https://apod.nasa.gov/apod/astropix.html\">NASA APOD</a> </h4>"
	if apodData.CopyRight != "" {
		formatCopyRight := strings.Replace(apodData.CopyRight, "\n", " ", -1)
		copyRight = "<h4> CopyRight:" + formatCopyRight + "</h4>"
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

func updateHtmlTemplate(apodHtml ApodHtml) string {
	// Read the html template
	htmlTemplate, err := os.ReadFile("./template.html")
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

func saveHtml(html string) {
	// Create the html file
	file, err := os.Create("./apod.html")
	checkErr(err)
	defer file.Close()

	// Write the html to the file
	_, err = file.WriteString(html)
	checkErr(err)
}
