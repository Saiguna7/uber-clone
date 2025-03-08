# Backend API Documentation

This folder contains the backend logic for user management, including user registration, built with Express, Mongoose, and TypeScript.

## Files Overview

- **`user.controller.ts`**: Contains the controller logic for handling HTTP requests, such as user registration.
- **`user.model.ts`**: Defines the Mongoose schema and model for the `User` collection, including utility functions for password hashing and JWT generation.
- **`user.routes.ts`**: Defines the Express routes for user-related endpoints, including `/users/register`.
- **`user.service.ts`**: Contains the service logic for business operations, such as creating a user in the database.

## API Endpoints

### **POST /users/register**

#### **Description**
Registers a new user in the system. The endpoint validates the incoming data (email, password, and firstname), hashes the password, and stores the user in the database. Upon successful registration, it returns a JSON Web Token (JWT) for authentication.

#### **Request**
- **Method**: `POST`
- **URL**: `/users/register`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "fullname": {
      "firstname": "string", // Required, minimum 3 characters
      "lastname": "string"   // Optional, minimum 3 characters if provided
    },
    "email": "string",       // Required, must be a valid email
    "password": "string"     // Required, minimum 6 characters
  }
  Example:

json

Collapse

Wrap

Copy
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
Response
Status Codes:
201 Created: User successfully registered.
json

Collapse

Wrap

Copy
{
  "message": "User created successfully",
  "token": "jwt-token-here"
}
400 Bad Request: Validation failed (e.g., invalid email, password too short, firstname too short).
json

Collapse

Wrap

Copy
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "value": "invalid-email",
      "location": "body"
    }
  ]
}
500 Internal Server Error: Something went wrong on the server (e.g., database error, hashing failure).
json

Collapse

Wrap

Copy
{
  "error": "Something went wrong while creating user"
}
Validation Rules
email: Must be a valid email address (e.g., user@domain.com).
password: Must be at least 6 characters long.
fullname.firstname: Must be at least 3 characters long.
fullname.lastname: Optional, but if provided, must be at least 3 characters long.
Notes
The password is hashed using pbkdf2 with a generated salt before being stored in the database.
The salt and password fields are not selectable by default (select: false) to prevent accidental exposure.
A JWT is generated using the user’s _id and the JWT_SECRET environment variable.
Setup Instructions
Install Dependencies:
bash

Collapse

Wrap

Copy
npm install express dotenv mongoose jsonwebtoken express-validator express-async-handler cors @types/express @types/mongoose @types/jsonwebtoken @types/express-validator @types/cors
Configure Environment Variables: Create a .env file in the project root with the following:

PORT=4000
MONGODB_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=your-secret-key
Run the Server:
bash

Collapse

Wrap

Copy
npm start
The server will run on http://localhost:4000.
Ensure MongoDB is running locally (mongod).
Test the Endpoint: Use Postman or curl to test the /users/register endpoint:
bash

Collapse

Wrap

Copy
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john.doe@example.com","password":"password123"}'
Error Handling
The endpoint uses express-validator for input validation.
Errors are returned as JSON objects with a 400 status code if validation fails.
Internal server errors (e.g., database issues) return a 500 status code with an error message.
Security Notes
Passwords are hashed using pbkdf2 with a unique salt for each user.
JWTs are used for authentication and should be included in the Authorization header for protected routes (not implemented in this endpoint).
CORS is enabled to allow cross-origin requests.


---

### **Explanation of the `README.md`**

1. **Files Overview**:
   - Briefly describes the purpose of each file in the backend folder to provide context.

2. **Endpoint Documentation**:
   - **Description**: Explains what the `/users/register` endpoint does (registers a user, hashes the password, returns a JWT).
   - **Request**: Details the HTTP method, URL, headers, and required body format with an example.
   - **Response**: Lists possible status codes (`201`, `400`, `500`) with example responses.
   - **Validation Rules**: Specifies the validation constraints for each field.
   - **Notes**: Adds additional context about password hashing, JWT generation, and field visibility.

3. **Setup Instructions**:
   - Provides steps to install dependencies, configure environment variables, and run the server.
   - Includes a sample `curl` command to test the endpoint.

4. **Error Handling and Security**:
   - Explains how errors are handled (via `express-validator`) and security measures (password hashing, JWT, CORS).

---

### **Placing the `README.md`**

Save the above content as `README.md` in your backend folder (same directory as `user.controller.ts`, `user.model.ts`, etc.):
/backend
├── user.controller.ts
├── user.model.ts
├── user.routes.ts
├── user.service.ts
├── README.md


---

### **Testing the Endpoint**

To ensure the `/users/register` endpoint works as documented:

1. **Start the Server**:
   - Run `npm start` or `ts-node app.ts`.
   - Ensure MongoDB is running and the `.env` file is set up:
PORT=4000
MONGODB_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=your-secret-key



2. **Send a Request via Postman**:
- URL: `http://localhost:4000/users/register`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
Expected Response:
Success (201):
json

Collapse

Wrap

Copy
{
  "message": "User created successfully",
  "token": "your-jwt-token"
}
Validation Error (400):
json

Collapse

Wrap

Copy
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "value": "invalid-email",
      "location": "body"
    }
  ]
}
Addressing the Previous 404 Issue
From your previous message, the 404 Not Found error was likely due to hitting the wrong URL (/register instead of /users/register). The README.md now clearly documents the correct URL (/users/register), which should help avoid similar issues in the future. If you’re still getting a 404, double-check:

The server logs for "Reached /users/register route" (added in user.routes.ts).
The import path in app.ts (import { userRoutes } from "./routes/user.routes"; should match the file name user.routes.ts).
The server is running and listening on port 4000.