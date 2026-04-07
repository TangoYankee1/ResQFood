# ResQFood System Design

This document outlines the high-level architecture, modules, and data models for the ResQFood system.

## 1. Core Modules

The system will be built around a set of core modules, each responsible for a specific domain of functionality.

- **User Management:** Handles registration, login, roles (Donor, Recipient, Volunteer), and profiles.
- **Inventory Management:** Allows donors to list surplus food items. Includes details like food type, quantity, and expiration dates.
- **Rescue Operations:** Manages the logistics of food rescue, including scheduling pickups and drop-offs.
- **Notifications:** Sends alerts to users about new listings, scheduled pickups, and other important events.

## 2. Data Models (Initial Draft)

This is a first pass at the data we need to store.

### User
- `userID` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `passwordHash` (String)
- `role` (Enum: DONOR, RECIPIENT, VOLUNTEER)
- `contactInfo` (String)

### FoodListing
- `listingID` (Primary Key)
- `donorID` (Foreign Key to User)
- `title` (String)
- `description` (Text)
- `quantity` (String)
- `pickupLocation` (String)
- `bestByDate` (Date)
- `status` (Enum: AVAILABLE, RESERVED, COLLECTED)

### Rescue
- `rescueID` (Primary Key)
- `listingID` (Foreign Key to FoodListing)
- `volunteerID` (Foreign Key to User, nullable)
- `recipientID` (Foreign Key to User, nullable)
- `scheduledPickupTime` (DateTime)
- `status` (Enum: PENDING, CONFIRMED, COMPLETED, CANCELLED)