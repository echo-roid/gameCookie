import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import AuthService from "../services/auth.service";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);


  const getUser = () => {
    // const user = AuthService.getCurrentUser();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
    }
  };

  const getUserResponse = () => {
    // const user = AuthService.getCurrentUser();
    setIsAuthenticated(true);
    closeLogin();
  };


  // Get user role
  const getUserRole = () => {
    return user?.role || 'user';
  };

  // Check if user has specific role
  const hasRole = (role) => {
    const userRole = getUserRole();
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };

   // Check if user is admin
  const isAdmin = () => hasRole('admin');

  // Check if user is user
  const isUser = () => hasRole('user');

  // Logout function
  const logout = () => {
    console.log('🚪 Logout called - clearing authentication data');
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    console.log('✅ Logout completed');

    window.location.href = "/";
    return { success: true };
  };

  const value = {
    // State
    isLoginOpen,
    openLogin,
    closeLogin,
    isAuthenticated,
    
    // Actions
    getUser,
    getUserResponse,
    logout,

    // Utilities
    user,
    isAdmin,
    isUser,

  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

