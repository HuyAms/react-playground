import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ApolloProvider } from '@apollo/react-hooks';
import { InteractionObserver } from './pages/InteractionObserver.tsx';
import { ToastPage } from './pages/Toast.tsx';
import { Container } from '@mui/material';
import RegisterPage from './pages/Register.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/interaction-observer",
    element: <InteractionObserver/>,
  },
  {
    path: "/toast",
    element: <ToastPage/>
  },
  {
    path: "/register",
    element: <RegisterPage/>
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: 'light', // light or dark
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    }
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <Container maxWidth="lg">
          <RouterProvider router={router} />
        </Container>
      </ThemeProvider>    
  </React.StrictMode>,
)
