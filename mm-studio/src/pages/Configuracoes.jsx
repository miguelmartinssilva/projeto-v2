import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Building, DollarSign, Palette, Lock, Save, Camera } from "lucide-react";
import { getPerfilAtivo, getPerfis, savePerfis } from "../utils/storage";

const sections = [
  { key: "perfil", label: "Perfil", icon: User },
  { key: "empresa", label: "Empresa", icon: Building },
  { key: "pagamento", label: "Pagamento", icon: DollarSign },
  { key: "aparencia", label: "Aparencia", icon: Palette },
  { key: "seguranca", label: "Seguranca", icon: Lock },
];

export default function Configuracoes() {
  const [tab, setTab] = useState("perfil");
  const profile = useMemo(() => getPerfilAtivo(), []);
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const save = () => {
    const perfis = getPerfis();
    const idx = perfis.findIndex(p => p.id === form.id);
    if (idx >= 0) perfis[idx] = form;
    else perfis.push(form);
    savePerfis(perfis);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">Workspace <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Configuracoes</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Configuracoes</h1>
            <p className="text-xs text-text-muted mt-1">Gerencie as configuracoes da sua conta</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={save}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
            <Save size={15} /> {saved ? "Salvo!" : "Salvar"}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            {sections.map(s => (
              <button key={s.key} onClick={() => setTab(s.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${tab === s.key ? "sidebar-item-active" : "text-text-muted hover:text-text hover:bg-white/[0.03]"}`}>
                <s.icon size={16} />
                <span className="text-xs font-medium">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 bg-bg-card rounded-2xl p-6 border border-border-card">
            {tab === "perfil" && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-5 border-b border-border-card">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">MM</div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center"><Camera size={11} /></button>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">{form.nome || "Miguel Martins"}</h3>
                    <p className="text-xs text-text-muted">Designer / CEO</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="floating-label"><input type="text" placeholder=" " value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /><label>Nome</label></div>
                  <div className="floating-label"><input type="email" placeholder=" " value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /><label>Email</label></div>
                  <div className="floating-label"><input type="text" placeholder=" " value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} /><label>Telefone</label></div>
                  <div className="floating-label"><input type="text" placeholder=" " value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} /><label>WhatsApp</label></div>
                </div>
              </div>
            )}

            {tab === "empresa" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="floating-label"><input type="text" placeholder=" " value={form.nomeEmpresa} onChange={e => setForm(f => ({ ...f, nomeEmpresa: e.target.value }))} /><label>Nome da Empresa</label></div>
                <div className="floating-label"><input type="text" placeholder=" " value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} /><label>CNPJ</label></div>
                <div className="floating-label sm:col-span-2"><input type="text" placeholder=" " value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} /><label>Endereco</label></div>
              </div>
            )}

            {tab === "pagamento" && (
          <div className="space-y-4">
            <div><span className="field-label">Tipo de chave PIX</span><select value={form.pixTipo || "cpf"} onChange={e => setForm(f => ({ ...f, pixTipo: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
              <option value="cpf">CPF</option><option value="cnpj">CNPJ</option><option value="email">Email</option><option value="telefone">Telefone</option><option value="aleatoria">Chave aleatoria</option>
            </select></div>
                <div className="floating-label"><input type="text" placeholder=" " value={form.pixChave} onChange={e => setForm(f => ({ ...f, pixChave: e.target.value }))} /><label>Chave PIX</label></div>
              </div>
            )}

            {tab === "aparencia" && (
          <div className="space-y-4">
            <div><span className="field-label">Cor primaria</span><input type="color" value={form.cor || "#00e676"} onChange={e => setForm(f => ({ ...f, cor: e.target.value }))} className="w-full h-10 bg-bg-input border border-border-card rounded-lg p-1 cursor-pointer" /></div>
              </div>
            )}

            {tab === "seguranca" && (
          <div className="space-y-4">
            <div><span className="field-label">Senha atual</span><input type="password" placeholder="Senha atual" className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
            <div><span className="field-label">Nova senha</span><input type="password" placeholder="Nova senha" className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
            <div><span className="field-label">Confirmar nova senha</span><input type="password" placeholder="Confirmar nova senha" className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}