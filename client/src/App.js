import React, { Component, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Header from "./Header";
import Content from "./Content";
import OwnerDashboard from "./OwnerDashboard.jsx";
import DisplayHoldings from "./DisplayHoldings.jsx";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home.jsx";
import Owner from "./Owner.jsx";



const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/owner" exact component={() => <Owner />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
