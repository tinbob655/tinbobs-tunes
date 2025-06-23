import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import Footer from './footer';

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>

    <footer>
      <Footer/>
    </footer>

  </StrictMode>,
);