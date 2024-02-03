package main

import (
	"bufio"
	"log"
	"os"
	"strings"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

/*
 * Utility function to set the environment variables
 */
func setEnv() {
	file, err := os.Open("./.env")
	checkErr(err)
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		env := strings.Split(scanner.Text(), "=")

		if strings.Contains(env[1], "'") {
			env[1] = strings.Replace(env[1], "'", "", -1)
		}

		os.Setenv(env[0], env[1])
	}
}

/*
 * Utility function to check for errors
 */
func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

/*
 * Utility function to impliment assert for unit tests
 */
func assert(t *testing.T, expected string, actual string) {
	if expected != actual {
		t.Errorf("Expected %s, got %s", expected, actual)
	}
}

/*
 * Utility function to define S3 client
 */
func s3Client(region string) *s3.S3 {
	// Create a new session
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(region),
	}))

	// Create a new S3 client
	svc := s3.New(sess)

	return svc
}
