import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import {
  AuthContextProvider,
  PrivateRoute,
  AuthenticatedUser,
} from './components/useAuth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  return (
    <div className="app">
      <div className="app__container">
        <AuthContextProvider>
          <Router>
            <Switch>
              <AuthenticatedUser exact path="/">
                <Signup />
              </AuthenticatedUser>
              <AuthenticatedUser path="/login">
                <Login />
              </AuthenticatedUser>
              AuthenticatedUser
              <PrivateRoute path="/app">
                <Sidebar />
              </PrivateRoute>
              <PrivateRoute path="/chat/:roomId">
                <Sidebar />
                <ChatBox />
              </PrivateRoute>
              <Route path="/logout">
                <Logout />
              </Route>
            </Switch>
          </Router>
        </AuthContextProvider>
      </div>
    </div>
  );
}

export default App;
