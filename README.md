# **Claims Management Platform - Backend** 🛠️  

This repository contains the backend for the **Claims Management Platform**, a secure API that handles user authentication, claim submissions, and status tracking.  

---

## **📌 Features**
- ✅ **User Authentication** (JWT-based)
- ✅ **Role-based Access Control** (Admin, User)
- ✅ **Claim Management** (Create, Retrieve, Update, Delete)
- ✅ **Secure API with Middleware** (JWT Verification)
- ✅ **Error Handling & Logging**
- ✅ **MongoDB Database Integration**

---

## **🛠️ Tech Stack**
- **Backend Framework:** Node.js (Express.js)
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Token (JWT)
- **Environment Management:** dotenv
- **Middleware:** Express, CORS, Morgan

---

## **🚀 Getting Started**

### **1️⃣ Prerequisites**
Before running the project, ensure you have:
- [Node.js](https://nodejs.org/en/download) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas)
- A `.env` file with the necessary environment variables

---

### **2️⃣ Installation**
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/claims-management-backend.git
cd claims-management-backend
npm install
```

---

### **3️⃣ Configuration**
Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/claimsDB
JWT_SECRET=your_secret_key
```

---

### **4️⃣ Running the Server**
To start the development server:

```bash
npm run dev
```

For production:

```bash
npm start
```

The API will run at **http://localhost:5000**

---

## **🗂️ Project Structure**
```
📂 claims-management-backend
 ┣ 📂 config/           # Database and environment configurations
 ┣ 📂 controllers/      # Business logic (handling requests)
 ┣ 📂 middleware/       # JWT Authentication & error handling middleware
 ┣ 📂 models/          # Mongoose schemas for database models
 ┣ 📂 routes/          # API endpoint definitions
 ┣ 📜 server.js        # Entry point of the application
 ┣ 📜 package.json     # Dependencies and scripts
 ┗ 📜 .env.example     # Example environment variables
```

---

## **🛠️ API Endpoints**
| **Method** | **Endpoint**           | **Description**                    | **Auth Required** |
|-----------|------------------------|------------------------------------|------------------|
| **POST**  | `/api/auth/register`   | Register a new user               | ❌ |
| **POST**  | `/api/auth/login`      | Authenticate & get JWT token       | ❌ |
| **GET**   | `/api/user/profile`    | Fetch user profile                 | ✅ |
| **GET**   | `/api/claims`          | Get all claims for a user          | ✅ |
| **POST**  | `/api/claims`          | Submit a new claim                 | ✅ |
| **PUT**   | `/api/claims/:id`      | Update claim details               | ✅ (Owner/Admin) |
| **DELETE**| `/api/claims/:id`      | Delete a claim                     | ✅ (Owner/Admin) |

---

## **🛡️ Authentication & Middleware**
### **1️⃣ JWT Authentication (`authMiddleware.js`)**
All protected routes require an `Authorization` header with a valid JWT token.

```json
{
  "Authorization": "Bearer your_jwt_token"
}
```

### **2️⃣ Sample JWT Payload**
```json
{
  "id": "60f5b4b1c4d4f00015b0c123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1710499200,
  "exp": 1713091200
}
```

---

## **📌 Error Handling**
All API responses follow a structured format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Example error response:
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

## **🛠️ Deployment**
### **1️⃣ Deploying to Render**
- Create an account at [Render](https://render.com/)
- Create a new **Web Service**
- Set the **build command**: `npm install && npm start`
- Add environment variables in Render's settings

---

## **👨‍💻 Contributing**
1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push and create a Pull Request

---

## **📜 License**
This project is licensed under the MIT License.

---

## **📧 Contact**
For queries, reach out to **[Prasanth](mailto:jprasanth2006@gmail.com)** or visit [LinkedIn](https://linkedin.com/in/rjprasanth) 🚀
