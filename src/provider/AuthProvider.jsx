import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { app } from "../firebase/firebase.config";
import useAxiosPublic from "../hook/useAxiosPublic";

export const AuthContext = createContext(null);
export const auth = getAuth(app);
const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const axiosPublic = useAxiosPublic();
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
      .then((result) => {
        const loggedUser = result.user;
        const userInfo = {
          name: loggedUser.displayName,
          email: loggedUser.email,
          photo: loggedUser.photoURL,
          role: "student",
        };

        return axios
          .post("http://localhost:5000/users", userInfo)
          .then((response) => {
            const data = response.data;
            if (data.success) {
              toast.success(data.message);
              setUser(userInfo);
            } else {
              toast.error(data.message);
            }
          })
          .catch((error) => {
            toast.error("Failed to save user to the database: ", error);
          });
      })
      .catch((error) => {
        toast.error("Google Sign-In failed.");
      })
      .finally(() => setLoading(false));
  };

  const handleGithubLogin = () => {
    setLoading(true);
    signInWithPopup(auth, githubProvider)
      .then(async (result) => {
        const loggedUser = result.user;
        const userInfo = {
          name: loggedUser.displayName,
          email: loggedUser.email,
          photo: loggedUser.photoURL,
          role: "student",
        };

        return axios
          .post("http://localhost:5000/users", userInfo)
          .then((response) => {
            const data = response.data;
            if (data.success) {
              toast.success(data.message);
              setUser(userInfo);
            } else {
              toast.error(data.message);
            }
          })
          .catch((error) => {
            toast.error("Failed to save user to the database.");
          });
      })
      .catch((error) => {
        toast.error("GitHub Sign-In failed.");
      })
      .finally(() => setLoading(false));
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        axiosPublic.post("/jwt", userInfo).then((res) => {
          if (res.data.token) {
            localStorage.setItem("access-token", res.data.token);
            setLoading(false);
          }
        });
      } else {
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });
    return () => {
      return unsubscribe();
    };
  }, [axiosPublic]);

  const authInfo = {
    user,
    setUser,
    loading,
    createUser,
    userLogin,
    logOut,
    updateUserProfile,
    googleSignIn,
    handleGithubLogin,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
