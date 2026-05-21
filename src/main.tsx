import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/index.scss';
import {BrowserRouter} from "react-router";

import Header from "./components/multiPage/header/Header.tsx";
import AllRoutes from "./Routes.tsx";
import Footer from "./components/multiPage/footer/Footer.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <Header/>

      <AllRoutes/>

      <Footer/>

    </BrowserRouter>
  </StrictMode>,
);