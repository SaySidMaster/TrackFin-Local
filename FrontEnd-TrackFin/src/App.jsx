import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import './styles/global.css';
import Layout from "./layout/Layout";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Dettes from "./pages/Dettes";
import Budgets from "./pages/Budgets";
import Contacts from "./pages/Contacts";
import Statistiques from "./pages/Statistiques";
import Parametres from "./pages/Parametres";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* Route principale avec layout */}
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/transactions" element={<Layout />}>
          <Route index element={<Transactions />} />
        </Route>
        <Route path="/dettes" element={<Layout />}>
          <Route index element={<Dettes />} />
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
