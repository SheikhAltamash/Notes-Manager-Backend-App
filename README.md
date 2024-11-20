# User Management API  
This API provides user and note management functionality using Firebase Firestore as the database. The server is built with Node.js and Express.

## **Database Structure**
### **1. Users Collection**  
- **Collection Name:** `users`  
- **Fields:**  
  - `id`: Unique user ID (string, auto-generated by Firestore)  
  - `name`: User's name (string)  
  - `email`: User's email address (string)  
  - `createdAt`: Timestamp when the user was created (timestamp)  

### **2. Notes Collection**  
- **Collection Name:** `notes`  
- **Fields:**  
  - `id`: Unique note ID (string, auto-generated by Firestore)  
  - `userId`: ID of the user who owns the note (string, references `users.id`)  
  - `title`: Title of the note (string)  
  - `content`: Content of the note (string)  
  - `createdAt`: Timestamp when the note was created (timestamp)  
  - `updatedAt`: Timestamp when the note was last updated (timestamp)  

## **API Endpoints**
### **Endpoints Overview**  

| Endpoint           | Method | Description                        | Example Payload |
|--------------------|--------|------------------------------------|-----------------|
| `/users`           | `POST` | Create a new user                  | JSON Body       |
| `/users/:userId`   | `GET`  | Get details of a specific user     | URL Parameter   |
| `/users/:userId`   | `PUT`  | Update a user’s information        | JSON Body       |
| `/users/:userId`   | `DELETE` | Delete a user                     | URL Parameter   |
| `/notes`           | `POST` | Create a new note                  | JSON Body       |
| `/notes/:noteId`   | `GET`  | Get a specific note                | URL Parameter   |
| `/notes/:noteId`   | `PUT`  | Update a note                      | JSON Body       |
| `/notes/:noteId`   | `DELETE` | Delete a note                     | URL Parameter   |

## **Example Requests**

### **1. Users**

#### **Create User**  
**Request:**  
```bash
curl -X POST http://localhost:8080/users \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john.doe@example.com"
}'
```  
**Response:**  
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-11-19T12:00:00Z"
}
```

#### **Get User Details**  
**Request:**  
```bash
curl -X GET http://localhost:8080/users/user123
```  
**Response:**  
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-11-19T12:00:00Z"
}
```

#### **Update User**  
**Request:**  
```bash
curl -X PUT http://localhost:8080/users/user123 \
-H "Content-Type: application/json" \
-d '{
  "name": "Johnathan Doe",
  "email": "johnathan.doe@example.com"
}'
```  
**Response:**  
```json
{
  "id": "user123",
  "name": "Johnathan Doe",
  "email": "johnathan.doe@example.com",
  "updatedAt": "2024-11-19T12:30:00Z"
}
```

#### **Delete User**  
**Request:**  
```bash
curl -X DELETE http://localhost:8080/users/user123
```  
**Response:**  
```json
{
  "message": "User deleted successfully"
}
```

---

### **2. Notes**

#### **Create Note**  
**Request:**  
```bash
curl -X POST http://localhost:8080/notes \
-H "Content-Type: application/json" \
-d '{
  "userId": "user123",
  "title": "Meeting Notes",
  "content": "Don't forget to prepare slides"
}'
```  
**Response:**  
```json
{
  "id": "note456",
  "userId": "user123",
  "title": "Meeting Notes",
  "content": "Don't forget to prepare slides",
  "createdAt": "2024-11-19T13:00:00Z"
}
```

#### **Get Note Details**  
**Request:**  
```bash
curl -X GET http://localhost:8080/notes/note456
```  
**Response:**  
```json
{
  "id": "note456",
  "userId": "user123",
  "title": "Meeting Notes",
  "content": "Don't forget to prepare slides",
  "createdAt": "2024-11-19T13:00:00Z"
}
```

#### **Update Note**  
**Request:**  
```bash
curl -X PUT http://localhost:8080/notes/note456 \
-H "Content-Type: application/json" \
-d '{
  "title": "Updated Meeting Notes",
  "content": "Add action items"
}'
```  
**Response:**  
```json
{
  "id": "note456",
  "userId": "user123",
  "title": "Updated Meeting Notes",
  "content": "Add action items",
  "updatedAt": "2024-11-19T14:00:00Z"
}
```

#### **Delete Note**  
**Request:**  
```bash
curl -X DELETE http://localhost:8080/notes/note456
```  
**Response:**  
```json
{
  "message": "Note deleted successfully"
}
```

---

## **Postman Collection**

To make testing easier, import the following Postman collection:  
```json
{
  "info": {
    "name": "User Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John Doe\", \"email\": \"john.doe@example.com\"}"
        },
        "url": {
          "raw": "http://localhost:8080/users",
          "host": ["localhost:8080"],
          "path": ["users"]
        }
      }
    },
    {
      "name": "Get User Details",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:8080/users/user123",
          "host": ["localhost:8080"],
          "path": ["users", "user123"]
        }
      }
    },
    ...
  ]
}
```
## **Dependencies**

- **Node.js:** v16+  
- **Firebase Admin SDK**  
- **Express.js**  

## **Setup**

1. Clone the repository:  
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure environment variables:  
   - Copy `.env.example` to `.env`.  
   - Add Firebase credentials and other required variables.

4. Run the server:  
   ```bash
   npm start
   ```


