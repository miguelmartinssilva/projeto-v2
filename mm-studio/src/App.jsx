import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Proposals from "./pages/Proposals";
import Clients from "./pages/Clients";
import Finance from "./pages/Finance";
import History from "./pages/History";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orcamento" element={<Proposals />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/financeiro" element={<Finance />} />
        <Route path="/historico" element={<History />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Routes>
    </div>
  );
}
