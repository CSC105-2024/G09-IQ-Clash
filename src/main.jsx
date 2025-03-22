import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from './pages/Homepage.jsx'
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ChoosingQuiz from './pages/ChoosingQuiz.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
const router = createBrowserRouter([
  {
    path: "/", 
    element: <Homepage/>, 
  },
  {
    path: "/register",
    element: <Register/>,
  },  
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/play",
    element: <ChoosingQuiz/>,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard/>
  }

]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);