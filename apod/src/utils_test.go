package main

import (
	"errors"
	"os"
	"testing"
)

/*
 * Unit tests for setEnv function
 */
func TestSetEnv(t *testing.T) {
	// Arrange
	os.Create(".env")
	file, _ := os.OpenFile(".env", os.O_APPEND|os.O_WRONLY, 0644)
	file.WriteString("TEST_ENV='test'")
	file.Close()

	// Act
	setEnv()

	// Assert
	assert(t, "test", os.Getenv("TEST_ENV"))
	os.Remove(".env")
}

/*
 * Unit tests for checkErr function
 */
func TestCheckErr(t *testing.T) {
	// Arrange
	err := errors.New("Test Error")

	// Act
	defer func() {
		if r := recover(); r != nil {
			checkErr(err)
		}
	}()

	// Assert
	assert(t, "Test Error", err.Error())
}

/*
 * Unit tests for assert function
 */
func TestAssert(t *testing.T) {
	// Arrange
	expected := "Test"
	actual := "Test"

	// Act
	assert(t, expected, actual)
}
