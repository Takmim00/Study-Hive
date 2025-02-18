import { createBrowserRouter } from "react-router-dom";
import ViewAllMetarials from "../Dashboard/admin/ViewAllMetarials";
import ViewAllSession from "../Dashboard/admin/ViewAllSession";
import ViewUser from "../Dashboard/admin/ViewUser";
import CreateNote from "../Dashboard/student/CreateNote";
import ManageNote from "../Dashboard/student/ManageNote";
import StudyMetarials from "../Dashboard/student/StudyMetarials";
import UpdateNote from "../Dashboard/student/UpdateNote";
import VeiwBooked from "../Dashboard/student/VeiwBooked";
import ViewDetails from "../Dashboard/student/ViewDetails";
import CreateStudy from "../Dashboard/tutor/CreateStudy";
import RejectSession from "../Dashboard/tutor/RejectSession";
import UpdateMetarials from "../Dashboard/tutor/UpdateMetarials";
import UploadMetarial from "../Dashboard/tutor/UploadMetarial";
import VeiwMetarils from "../Dashboard/tutor/VeiwMetarils";
import VeiwSession from "../Dashboard/tutor/VeiwSession";
import Dashboard from "../layout/Dashboard";
import Main from "../layout/Main";
import Login from "../page/authentication/Login";
import Register from "../page/authentication/Register";
import Courses from "../page/Courses";
import DetailsPage from "../page/DetailsPage";
import Home from "../page/Home";
import Profile from "../page/Profile";
import Support from "../page/Support";
import Tutor from "../page/Tutor";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import StudentRoute from "./StudentRoute";
import TutorRoute from "./TutorRoute";
import AdminDashboard from "../Dashboard/admin/AdminDashboard";

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
        path: "/course",
        element: <Courses />,
      },
      {
        path: "/tutor",
        element: <Tutor />,
      },
      {
        path: "/support",
        element: <Support />,
      },
      {
        path: "/sessionDetail/:id",
        element: <DetailsPage />,
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
        path: "profile",
        element: <Profile />,
      },
      {
        path: "createStudy",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <CreateStudy />
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewSession",

        element: (
          <PrivateRoute>
            <TutorRoute>
              <VeiwSession />
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "uploadMaterial",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <UploadMetarial />
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewMaterials",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <VeiwMetarils />
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "rejectDashboard",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <RejectSession />
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewMaterials/updateMetarials/:id",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <UpdateMetarials />
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewBooked",
        element: (
          <PrivateRoute>
            <StudentRoute>
              <VeiwBooked />
            </StudentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewBooked/viewBookedDetails/:id",
        element: (
          <PrivateRoute>
            <StudentRoute>
              <ViewDetails />
            </StudentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "createNote",
        element: (
          <PrivateRoute>
            <StudentRoute>
              <CreateNote />
            </StudentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manageNotes",
        element: (
          <PrivateRoute>
            <StudentRoute>
              <ManageNote />
            </StudentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manageNotes/updateNotes/:id",
        element: (
          <PrivateRoute>
            <StudentRoute>
              <UpdateNote />
            </StudentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "studyMetarials",
        element: (
          <PrivateRoute>
            <StudentRoute>
              <StudyMetarials />
            </StudentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewUsers",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ViewUser />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "adminDashboard",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard/>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewAllSessions",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ViewAllSession />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "viewAllMaterials",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ViewAllMetarials />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
