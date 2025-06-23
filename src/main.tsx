import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/index.scss';
import './scss/text.scss';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <header>
        <Header/>
      </header>

      <AppRoutes/>

      <footer>
        <Footer/>
      </footer>

    </BrowserRouter>
  </StrictMode>,
);