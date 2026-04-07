package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func InitDB(filepath string) *sql.DB {
	db, err := sql.Open("sqlite3", filepath)
	if err != nil {
		log.Fatal(err)
	}

	createTables(db)

	return db
}

func createTables(db *sql.DB) {
	createUserTable := `
	CREATE TABLE IF NOT EXISTS users (
		userID INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		passwordHash TEXT NOT NULL,
		role TEXT NOT NULL,
		contactInfo TEXT
	);`

	createFoodListingTable := `
	CREATE TABLE IF NOT EXISTS food_listings (
		listingID INTEGER PRIMARY KEY AUTOINCREMENT,
		donorID INTEGER NOT NULL,
		title TEXT NOT NULL,
		description TEXT,
		quantity TEXT,
		pickupLocation TEXT,
		bestByDate DATE,
		status TEXT NOT NULL,
		FOREIGN KEY(donorID) REFERENCES users(userID)
	);`

	createRescueTable := `
	CREATE TABLE IF NOT EXISTS rescues (
		rescueID INTEGER PRIMARY KEY AUTOINCREMENT,
		listingID INTEGER NOT NULL,
		volunteerID INTEGER,
		recipientID INTEGER,
		scheduledPickupTime DATETIME,
		status TEXT NOT NULL,
		FOREIGN KEY(listingID) REFERENCES food_listings(listingID),
		FOREIGN KEY(volunteerID) REFERENCES users(userID),
		FOREIGN KEY(recipientID) REFERENCES users(userID)
	);`

	if _, err := db.Exec(createUserTable); err != nil {
		log.Fatal(err)
	}
	if _, err := db.Exec(createFoodListingTable); err != nil {
		log.Fatal(err)
	}
	if _, err := db.Exec(createRescueTable); err != nil {
		log.Fatal(err)
	}
}