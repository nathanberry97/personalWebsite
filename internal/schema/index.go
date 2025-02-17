package schema

import "time"

type HomePageData struct {
	Metadata string
	Navbar   string
	About    string
	Blog     string
}

type BlogPost struct {
	Title      string
	Link       string
	Date       string
	ParsedDate time.Time
}

type RSSItem struct {
	Title   string
	Link    string
	PubDate string
}

type RSSFeed struct {
	Title       string
	Link        string
	Description string
	AtomLink    string
	Items       []RSSItem
}

type NavbarData struct {
	Href string
	Text string
}

type AboutData struct {
	Name        string
	CompanyName string
	CompanyURL  string
	LinkedinURL string
	GithubURL   string
	Bio         string
}

type MetadataData struct {
	Title       string
	Description string
	ThemeColour string
}
