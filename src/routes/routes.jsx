import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Login from "../page/authentication/Login";
import Register from "../page/authentication/Register";
import Home from "../page/Home";
import Dashboard from "../layout/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        path:'/register',
        element:<Register/>
      },
    ]
  },
  {
    path:'dashboard',
    element:<Dashboard/>
  }
]);
