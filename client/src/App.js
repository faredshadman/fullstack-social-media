import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Spinner from "./components/loading/Spinner";
import Test from "./components/Test";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
function App() {
  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <main style={{ flex: 6 }}>
            <Outlet />
          </main>
          <RightBar />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const UserExisted = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/test",
          element: <Test />,
          children: [
            {
              path: "/test/test",
              element: <Test />,
            },
          ],
        },
        {
          path: "/profile/:id",
          element: <Profile />,
          children: [
            {
              path: "/profile/:id/test",
              element: <Test />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <UserExisted>
          <Login />
        </UserExisted>
      ),
    },
    {
      path: "/register",
      element: (
        <UserExisted>
          <Register />
        </UserExisted>
      ),
    },
    {
      path: "*",
      element: <Spinner />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} fallbackElement={<Spinner />} />
    </div>
  );
}

export default App;
