import 'purecss';
import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Component from './component';
import { AppContainer } from 'react-hot-loader';

const render = App => {
  ReactDOM.render(
    <AppContainer><App /></AppContainer>,
    document.getElementById('app')
  );
};

render(Component);

if (module.hot) {
  module.hot.accept('./component', () => render(Component));
}
