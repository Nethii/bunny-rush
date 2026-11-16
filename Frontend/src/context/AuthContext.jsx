import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bunnyUser');  //React Context that stores the logged-in user globally
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('bunnyUser', JSON.stringify(userData));   //login saves user data to both state and localstorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bunnyUser'); //logout clears both
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx); //hook used everywhere