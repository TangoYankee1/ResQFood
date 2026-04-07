package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/TangoYankee1/ResQFood/internal/database"
)

func main() {
	db := database.InitDB("./resqfood.db")
	defer db.Close()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, ResQFood!")
	})

	log.Println("Starting server on :8888")
	if err := http.ListenAndServe(":8888", nil); err != nil {
		log.Fatal(err)
	}
}