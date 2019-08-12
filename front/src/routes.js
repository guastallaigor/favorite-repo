import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './views/Login/Login';
import Dashboard from './views/Dashboard/Dashboard';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" component={Dashboard} />
    </BrowserRouter>
  );
}
