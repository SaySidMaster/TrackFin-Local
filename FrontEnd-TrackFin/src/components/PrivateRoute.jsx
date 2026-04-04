// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
    const token = localStorage.getItem("token"); // ou sessionStorage selon votre choix
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;