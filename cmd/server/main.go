package main

import (
	"log"
	"net/http"

	"github.com/TangoYankee1/ResQFood/internal/database"
	"github.com/TangoYankee1/ResQFood/internal/handlers"
)

func main() {
	db := database.InitDB("./resqfood.db")
	defer db.Close()

	api := &handlers.API{DB: db}

	http.HandleFunc("/register", api.RegisterUser)
	http.HandleFunc("/login", api.LoginUser)

	log.Println("Starting server on :8888")
	if err := http.ListenAndServe(":8888", nil); err != nil {
		log.Fatal(err)
	}
}