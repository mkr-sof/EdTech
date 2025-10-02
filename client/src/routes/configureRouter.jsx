import { createBrowserRouter } from "react-router-dom";
import App from "../components/App/App.jsx";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary.jsx";

function configureRouter() {
    return createBrowserRouter(
        [
            {
                path: "/",
                element: (
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                ),
            }
        ],
        {
            basename: "/EdTech",
        });
}
export default configureRouter;