import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import { AuthContextProvider } from './contexts/AuthContext';
import { App } from './App';

import '@fontsource/roboto';
import './styles/global.scss';

ReactDOM.render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);
