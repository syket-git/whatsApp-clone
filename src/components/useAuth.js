import React, { createContext, useState, useContext } from 'react';
import { auth } from '../firebase';
import { Route, Redirect } from 'react-router-dom';

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const auth = Auth();
  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export function AuthenticatedUser({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user === null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/app',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Auth = () => {
  const [user, setUser] = useState(null);

  const signUp = (name, email, password, photoURL) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        auth.currentUser
          .updateProfile({
            displayName: name,
            photoURL: photoURL,
          })
          .then(() => {
            setUser(res.user);
            window.location.replace('/app');
          });
      })
      .catch((error) => setUser({ err: error.message }));
  };

  const signIn = (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        setUser(res.user);
        window.location.replace('/app');
      })
      .catch((error) => setUser({ err: error.message }));
  };

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        window.location.replace('/login');
      })
      .catch((error) => setUser({ err: error.message }));
  };

  auth.onAuthStateChanged(function (usr) {
    if (usr) {
      setUser(usr);
    }
  });

  return {
    signUp,
    signIn,
    signOut,
    user,
  };
};
export default Auth;
