# Pending Tasks for ResQFood Project

This file tracks the next steps to be taken in the project.

---

### Current Pending Task

**Task:** Execute the database schema script.

**Details:** The `schema.sql` file has been created. The user needs to run this script in their local MySQL environment to create the database (`resqfood_db`) and its tables. This step is required before we can proceed with developing the API.

**Command to run:**
```bash
mysql -u your_username -p < /home/biased/Desktop/ResQFood/backend/schema.sql
```
*(Note: Replace `your_username` with your actual MySQL username, which is often `root` for local installations.)*

---

### Next Task (After database setup)

**Phase 2: Core Backend Functionality (API)**
*   **Task 2.1: Implement User Model and Authentication:**
    1.  Create a configuration file in the backend to store database credentials securely.
    2.  Create a module to handle the database connection.
    3.  Begin developing the API endpoint for user registration (`/api/auth/register`).