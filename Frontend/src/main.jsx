import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from './pages/Homepage.jsx';
import UserPage from './pages/UserPage.jsx';
import DoingQuiz from './pages/DoingQuiz.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ChoosingQuiz from './pages/ChoosingQuiz.jsx';
import ChoosingQuiz2 from './pages/ChoosingQuiz2.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Summary from './pages/Summary.jsx';
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
    path: "/play/:topic",
    element: <ChoosingQuiz2/>,
  },
  {
    path: "/play/:topic/:time/:items",
    element: <DoingQuiz/>
  },
  {
    path: "/leaderboard",
    element: <Leaderboard/>
  },  
  {
    path: "/play/:topic/:time/:items/summary",
    element: <Summary/>
  },
  {
    path: "/userpage",
    element:<UserPage/>
  }
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
