import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './containers/Home';
import Dashboard from './containers/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/dashboard/:dashboardId">
            <Dashboard />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
