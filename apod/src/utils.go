package main

import (
	"bufio"
	"log"
	"os"
	"strings"
	"testing"
)

/*
 * Utility function to set the environment variables
 */
func setEnv(envFile string) {
	file, err := os.Open(envFile)
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
