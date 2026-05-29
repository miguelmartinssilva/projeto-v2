import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Crm from "./pages/Crm";
import Agenda from "./pages/Agenda";
import Financeiro from "./pages/Financeiro";
import Comercial from "./pages/Comercial";
import Catalogo from "./pages/Catalogo";
import Analytics from "./pages/Analytics";
import Automacoes from "./pages/Automacoes";
import Equipe from "./pages/Equipe";
import Documentos from "./pages/Documentos";
import Integracoes from "./pages/Integracoes";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-dvh bg-bg-main flex overflow-x-hidden">
      <Sidebar collapsed={collapsed} onToggle={setCollapsed} />
      <main className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-56"}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crm" element={<Crm />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/comercial" element={<Comercial />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/automacoes" element={<Automacoes />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/integracoes" element={<Integracoes />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}