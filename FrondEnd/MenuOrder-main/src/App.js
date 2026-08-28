import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import { routes } from "./routes";
import Default from "./costormer/Components/Default/Default";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? Default : Fragment;
            const content = (
              <Layout>
                <Page />
              </Layout>
            );
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.protected ? <ProtectedRoute roles={route.roles}>{content}</ProtectedRoute> : content}
              />
            );
          })}
          <Route
            path="/index.html"
            element={<Navigate to="/login" replace />}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
