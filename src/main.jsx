import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // ✅ Correct
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root')); // ✅ Utilisation correcte de createRoot

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* Ajout de BrowserRouter si tu utilises React Router */}
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
