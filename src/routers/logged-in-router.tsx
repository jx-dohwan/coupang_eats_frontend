import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export const LoggedInRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
        </Route>
        <Route path="/about">
        </Route>
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
