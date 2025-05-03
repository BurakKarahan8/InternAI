import React, { createContext, useState, useContext } from "react";

// Kullanıcı verisi için bir context oluştur
const UserContext = createContext();

// Bir provider bileşeni oluştur
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Kullanıcı verilerini burada tutacağız

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Kullanıcı verisini kullanmak için özel bir hook oluştur
export const useUser = () => {
  return useContext(UserContext);
};
