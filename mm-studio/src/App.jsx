import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Proposals from "./pages/Proposals";
import Clients from "./pages/Clients";
import Finance from "./pages/Finance";
import History from "./pages/History";
import Settings from "./pages/Settings";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar collapsed={collapsed} onToggle={setCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-56"}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orcamento" element={<Proposals />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/financeiro" element={<Finance />} />
          <Route path="/historico" element={<History />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
