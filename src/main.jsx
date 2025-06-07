import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/home/Home.jsx'
import About from './components/about/About.jsx'
import Pricing from './components/pricing/Pricing.jsx'
import OldAC from './components/old_ac/old_ac.jsx'
import Profile from './components/profile/profile.jsx';
import Admin from './components/admin/Admin.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'old_ac',
        element: <OldAC />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'admin',
        element: <Admin />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
