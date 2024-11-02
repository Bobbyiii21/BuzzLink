import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Auth0Provider } from "@auth0/auth0-react";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import ErrorPage from "./error-page";
import Forgot from "./pages/Forgot";
import Create from "./pages/Create";
import Meeting from './pages/Meeting.jsx';
import Chatroom from './chatroom.jsx';
import RoomForm from "./components/RoomForm.jsx"


//for testing the frontend roomForm element, change back before making PR

const router = createBrowserRouter([
  {
    path: "/",
    //element: <Login />,
    element: <RoomForm></RoomForm>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot",
    element: <Forgot/>,
  },
  {
    path: "/create",
    element: <Create/>
  }, 
  {
    path: "/meeting",
    element: <Meeting />
  },
  {
    path: "/chatroom",
    element: <Chatroom />
  }
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider>
     <RouterProvider router={router} />
    </Auth0Provider>
  </StrictMode>,
)
