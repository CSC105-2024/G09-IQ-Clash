import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import Homepage from './page/Homepage';
import LoginPageWithAlert from './page/Login';
import { Post } from './page/Post';
import { Useredit } from './page/Useredit';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <LoginPageWithAlert />,
  },
  {
    path: "/signup",
    element: <LoginPageWithAlert />,
  },
  {
    path: "/blog",
    element: <Post />,
  },
    {
    path: "/useredit",
    element: <Useredit />
  },
]);


const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure your HTML has an element with id='root'.");
}
