# G09-IQ-Clash

QUIZ is an interactive platform where users take quizzes on topics like sports, games, math, and science. With user accounts, scores are tracked over time and ranked on a leaderboard. Correct answers earn points, wrong ones lose them, and answers are revealed for learning. Unlike many quiz sites, QUIZ adds competition and progress tracking to make learning more engaging and fun.

## :rocket: Getting Started
**Clone the repository**: 
```bash 
 git clone https://github.com/CSC105-2024/G09-IQ-Clash.git
 cd G09-IQ-Clash
```

## :hammer: Frontend - React

### :wrench: Tech Stack

- React
- Axios
- React Router DOM
- Tailwind CSS

### :rocket: Getting Started - React Client

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The client will be running on [http://localhost:5173](http://localhost:5173) (or similar, depending on your setup).

---

## :wrench: Backend - Node.js

### :hammer_and_wrench: Tech Stack

- Node.js
- MySQL 
- JWT (JSON Web Token)
- bcrypt
- Cookies
- Prisma

### :electric_plug: API Endpoints

### **User**
| Method | Endpoint             | Description                         |
|--------|----------------------|-------------------------------------|
| GET   | `/user/decodeCookie`  |  Decode the cookie's JWT token      |
| POST  | `/user/register`      |  Create new user account            |
| POST  | `/user/login`         |  To log in an account               |
| PATCH | `/user/updateUsername`|  Update user's username             |
| PATCH | `/user/updatePassword`|  Update user's password             |
| Delete| `/user/logout`        |  To logout the account              |
| Delete| `/user/deleteAccount` |  To delete user's accounnt          |

### **Leaderboard**
| Method | Endpoint             | Description                         |
|--------|----------------------|-------------------------------------|
| GET   | `/leaderboard`        |  To get the top 10 users with the highest score  |
            


### :rocket: Getting Started - Node.js Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following variables:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="DSDSD"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The server will be running on [http://localhost:8000](http://localhost:8000)
