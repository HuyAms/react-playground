import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {ApolloProvider} from '@apollo/client';
import {InteractionObserver} from './pages/InteractionObserver.tsx';
import {ToastPage} from './pages/Toast.tsx';
import {Container} from '@mui/material';
import RegisterPage from './pages/Register.tsx';
import FolderPage from './pages/Folders/FolderPageV2.tsx';
import FolderPageV1 from './pages/Folders/FolderPageV1.tsx';
import ApolloClientPage from './pages/ApolloClient/ApolloClient.tsx';
import PollingPage from './pages/Polling/Polling.tsx';
import Polling2Page from './pages/Polling/Polling2/Polling2.tsx';
import Polling3Page from './pages/Polling/Polling3/Polling3.tsx';
import {ScrollVisualizer} from './pages/ScrollDepth.tsx';
import {client} from './pages/ApolloClient/client.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/interaction-observer',
    element: <InteractionObserver />,
  },
  {
    path: '/toast',
    element: <ToastPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/scroll-depth',
    element: <ScrollVisualizer />,
  },
  {
    path: '/folders-v1',
    element: <FolderPageV1 />,
  },
  {
    path: '/folders-v2',
    element: <FolderPage />,
  },
  {
    path: '/apollo',
    element: <ApolloClientPage />,
  },
  {
    path: '/polling',
    element: <PollingPage />,
  },
  {
    path: '/polling2',
    element: <Polling2Page />,
  },
  {
    path: '/polling3',
    element: <Polling3Page />,
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
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <RouterProvider router={router} />
        </Container>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);
