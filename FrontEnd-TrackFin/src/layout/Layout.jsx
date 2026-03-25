import { Outlet, Link } from "react-router-dom";
import SideNavBar from '../components/SideNavBar.jsx'

function Layout() {
  return (
    <div className="layoutBloc">
      
      <SideNavBar />

      {/* Contenu dynamique */}
      <Outlet />

    </div>
  );
}

export default Layout;