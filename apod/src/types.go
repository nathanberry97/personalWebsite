package main

type Apod struct {
	Date           string `json:"date"`
	Explanation    string `json:"explanation"`
	Hdurl          string `json:"hdurl"`
	MediaType      string `json:"media_type"`
	ServiceVersion string `json:"service_version"`
	Title          string `json:"title"`
	Url            string `json:"url"`
	CopyRight      string `json:"copyRight"`
}

type ApodHtml struct {
	Title       string
	Date        string
	Image       string
	Explanation string
	CopyRight   string
}
