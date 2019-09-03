/* eslint-disable */
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';
import CalciteThemeProvider from 'calcite-react/CalciteThemeProvider';

import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

import Home from './components/Home';
import About from './components/About/About';

import './App.css';

class App extends Component {
  componentDidMount() {
    LogRocket.init('ayfdlv/bloombus');
    setupLogRocketReact(LogRocket);
  }

  render() {
    return (
      <BrowserRouter>
        <CalciteThemeProvider>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Redirect to="/" />
          </Switch>
        </CalciteThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
