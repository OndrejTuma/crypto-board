import React from 'react'

export const AuthContext = React.createContext({
  isLogged: false,
  user: null,
  logIn: () => {},
  logOut: () => {},
})
