import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import configureRouter from './routes/configureRouter.jsx';
import './index.css';
// import App from './components/App/App.jsx'

createRoot(document.getElementById('root')).render(
 <RouterProvider router={configureRouter()} />
)
