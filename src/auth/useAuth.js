import { useContext } from "react";
import AuthContext from "./context";
import { jwtDecode } from "jwt-decode";
import apiClient from "./../api/client";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (accessToken, refreshToken) => {
    const user = jwtDecode(accessToken);
    setUser(user);

    // Store access token
    localStorage.setItem("token", accessToken);
    document.cookie = `token=${accessToken}; path=/; max-age=2592000; SameSite=Lax`; // 30 days

    // Store refresh token (important for logout)
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`; // 30 days
    }
  };

  const logOut = async () => {
    try {
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        // Call logout API with refresh token in body
        const response = await apiClient.post("/user/logout", {
          refreshToken: refreshToken,
        });

        if (!response.ok) {
          console.error("Logout API failed:", response?.data?.message);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user state
      setUser(null);

      // Remove access token
      localStorage.removeItem("token");
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

      // Remove refresh token
      localStorage.removeItem("refreshToken");
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

      // Redirect to home
      window.location.href = "/";
    }
  };

  // Helper function to get refresh token when needed
  const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
  };

  // Helper function to get access token
  const getAccessToken = () => {
    return localStorage.getItem("token");
  };

  return { user, logIn, logOut, getRefreshToken, getAccessToken };
};

export default useAuth;
