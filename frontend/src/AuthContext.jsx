import React,{useContext,createContext} from 'react'
export const AuthDataContext = createContext();
const AuthContext = ({children}) => {
  const serverUrl="https://eduworldfinal-backend.onrender.com";
  // const serverUrl="http://localhost:8080";
  const value={
    serverUrl
  }

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext