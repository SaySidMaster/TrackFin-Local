import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/global.css';
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Debts from "./pages/Debts";
import Budgets from "./pages/Budgets";
import Contacts from "./pages/Contacts";
import Statistiques from "./pages/Statistiques";
import Parametres from "./pages/Parametres";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques — redirige vers /dashboard si déjà connecté */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Routes protégées — redirige vers /login si pas de token */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/transactions" element={<Layout />}>
            <Route index element={<Transactions />} />
          </Route>
          <Route path="/debts" element={<Layout />}>
            <Route index element={<Debts />} />
          </Route>
          <Route path="/budgets" element={<Layout />}>
            <Route index element={<Budgets />} />
          </Route>
          <Route path="/contacts" element={<Layout />}>
            <Route index element={<Contacts />} />
          </Route>
          <Route path="/statistiques" element={<Layout />}>
            <Route index element={<Statistiques />} />
          </Route>
          <Route path="/statistiques/journalier" element={<Layout />}>
            <Route index element={<Statistiques filter="journalier" />} />
          </Route>
          <Route path="/statistiques/mensuel" element={<Layout />}>
            <Route index element={<Statistiques filter="mensuel" />} />
          </Route>
          <Route path="/parametres" element={<Layout />}>
            <Route index element={<Parametres />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;