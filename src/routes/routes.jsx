import { createBrowserRouter } from "react-router-dom";
import CreateStudy from "../Dashboard/tutor/CreateStudy";
import UpdateMetarials from "../Dashboard/tutor/UpdateMetarials";
import UploadMetarial from "../Dashboard/tutor/UploadMetarial";
import VeiwMetarils from "../Dashboard/tutor/VeiwMetarils";
import VeiwSession from "../Dashboard/tutor/VeiwSession";
import Dashboard from "../layout/Dashboard";
import Main from "../layout/Main";
import Login from "../page/authentication/Login";
import Register from "../page/authentication/Register";
import Home from "../page/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "createStudy",
        element: <CreateStudy />,
      },
      {
        path: "viewSession",
        element: <VeiwSession />,
      },
      {
        path: "uploadMaterial",
        element: <UploadMetarial />,
      },
      {
        path: "viewMaterials",
        element: <VeiwMetarils />,
      },
      {
        path: "viewMaterials/updateMetarials/:id",
        element: <UpdateMetarials />,
      },
    ],
  },
]);
