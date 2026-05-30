import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/index.scss';
import {BrowserRouter} from "react-router";

import Header from "./components/multiPage/header/Header.tsx";
import AllRoutes from "./Routes.tsx";
import Footer from "./components/multiPage/footer/Footer.tsx";
import {PlaylistProvider} from "./context/playlistContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <PlaylistProvider>

              <Header/>

              <AllRoutes/>

              <Footer/>

        </PlaylistProvider>
    </BrowserRouter>
  </StrictMode>,
);