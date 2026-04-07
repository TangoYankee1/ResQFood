package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type API struct {
	DB *sql.DB
}

type User struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	Role        string `json:"role"`
	ContactInfo string `json:"contactInfo"`
}

func (a *API) RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}

		_, err = a.DB.Exec("INSERT INTO users (name, email, passwordHash, role, contactInfo) VALUES (?, ?, ?, ?, ?)",
			user.Name, user.Email, string(hashedPassword), user.Role, user.ContactInfo)
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		http.Redirect(w, r, "/login", http.StatusSeeOther)
	} else if r.Method == http.MethodGet {
		RenderTemplate(w, "register.html", nil)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (a *API) LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		var storedPassword string
		err := a.DB.QueryRow("SELECT passwordHash FROM users WHERE email = ?", user.Email).Scan(&storedPassword)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Invalid email or password", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Failed to query user", http.StatusInternalServerError)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(user.Password)); err != nil {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// TODO: Implement session management
		http.Redirect(w, r, "/", http.StatusSeeOther)
	} else if r.Method == http.MethodGet {
		RenderTemplate(w, "login.html", nil)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
func RenderTemplate(w http.ResponseWriter, tmpl string, data interface{}) {
	t, err := template.ParseFiles("web/templates/base.html", "web/templates/"+tmpl)
	if err != nil {
		http.Error(w, "Failed to parse template", http.StatusInternalServerError)
		return
	}
	if err := t.ExecuteTemplate(w, "base", data); err != nil {
		http.Error(w, "Failed to execute template", http.StatusInternalServerError)
	}
}