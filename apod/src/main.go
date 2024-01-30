package main

func main() {
	setEnv()
	data := getData()
	html := formatData(data)
	htmlTemplate := updateHtmlTemplate(html)
	saveHtml(htmlTemplate)
}
