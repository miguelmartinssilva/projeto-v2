import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, User, Building, Bell, Lock, Palette, Smartphone, LogOut, Eye, EyeOff, Camera } from "lucide-react";

const sections = [
  { key: "perfil", label: "Perfil", icon: User },
  { key: "loja", label: "Loja / Estudio", icon: Building },
  { key: "aparencia", label: "Aparencia", icon: Palette },
  { key: "notificacoes", label: "Notificacoes", icon: Bell },
  { key: "seguranca", label: "Seguranca", icon: Lock },
];

export default function Settings() {
  const [tab, setTab] = useState("perfil");
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleSave = () => {
    setSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Configuracoes</span></p>
            <h1 className="text-xl font-display font-bold text-text">Configuracoes</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={`btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm ${saved ? "bg-success/20 text-success border border-success/30" : ""}`}
          >
            {saved ? <>Salvo <CheckIcon /></> : <><Save size={18} /> Salvar</>}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setTab(s.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${tab === s.key ? "bg-primary/10 text-primary border border-primary/20" : "text-text-secondary hover:text-text hover:bg-white/[0.03] border border-transparent"}`}
                >
                  <Icon size={16} />
                  <span className="text-xs font-semibold uppercase tracking-[0.08em]">{s.label}</span>
                </button>
              );
            })}
            <div className="pt-4 mt-4 border-t border-border-card">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition-all">
                <LogOut size={16} />
                <span className="text-xs font-semibold uppercase tracking-[0.08em]">Sair</span>
              </button>
            </div>
          </div>

          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
            {tab === "perfil" && <ProfileForm />}
            {tab === "loja" && <CompanyForm />}
            {tab === "aparencia" && <AppearanceForm />}
            {tab === "notificacoes" && <NotificationsForm />}
            {tab === "seguranca" && <SecurityForm showPass={showPass} setShowPass={setShowPass} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ children, title, desc }) {
  return (
    <div className="bg-bg-card rounded-xl p-6 card-border glow-primary">
      <h2 className="text-sm font-display font-bold text-text mb-1">{title}</h2>
      {desc && <p className="text-xs text-text-muted mb-5">{desc}</p>}
      {children}
    </div>
  );
}

function Input({ label, id, type = "text", placeholder, defaultValue, suffix }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em]">{label}</label>
      <div className="relative">
        <input type={type} id={id} placeholder={placeholder} defaultValue={defaultValue}
          className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-text font-medium">{label}</p>
        {desc && <p className="text-xs text-text-muted">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${on ? "bg-primary" : "bg-border-card"}`}
        style={{ height: "22px", width: "40px" }}
      >
        <div className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-black transition-all ${on ? "left-[20px]" : "left-[1px]"}`} />
      </button>
    </div>
  );
}

function ProfileForm() {
  return (
    <div className="space-y-4">
      <SectionCard title="Foto do Perfil" desc="Sua foto aparece no sidebar e em notificacoes">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-bg-elevated border-2 border-border-card flex items-center justify-center text-2xl font-bold text-primary">
              MM
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-text font-medium">Miguel Martins</p>
            <p className="text-xs text-text-muted">JPG, PNG ou WebP. Max 2MB.</p>
            <button className="mt-1.5 text-xs text-primary hover:underline">Alterar foto</button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Dados Pessoais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome" id="nome" defaultValue="Miguel" placeholder="Seu nome" />
          <Input label="Sobrenome" id="sobrenome" defaultValue="Martins" placeholder="Seu sobrenome" />
          <Input label="Email" id="email" type="email" defaultValue="miguel@mmstudio.com" placeholder="email@exemplo.com" />
          <Input label="Telefone" id="telefone" defaultValue="(63) 99999-0000" placeholder="(99) 99999-0000" suffix="WhatsApp" />
        </div>
      </SectionCard>
    </div>
  );
}

function CompanyForm() {
  return (
    <div className="space-y-4">
      <SectionCard title="Dados do Estudio">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome do Estudio" id="studio_nome" defaultValue="MM Studio" placeholder="Nome do estudio" />
          <Input label="CNPJ" id="cnpj" defaultValue="00.000.000/0001-00" placeholder="00.000.000/0001-00" />
          <Input label="Endereco" id="endereco" defaultValue="Rua Exemplo, 123" placeholder="Endereco completo" />
          <Input label="Cidade/UF" id="cidade" defaultValue="Palmas - TO" placeholder="Cidade - UF" />
        </div>
      </SectionCard>
      <SectionCard title="Redes Sociais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Instagram" id="instagram" defaultValue="@mmstudio" placeholder="@seuperfil" />
          <Input label="WhatsApp" id="whatsapp" defaultValue="(63) 99999-0000" placeholder="(99) 99999-0000" />
          <Input label="Site" id="site" defaultValue="https://mmstudio.design" placeholder="https://" />
        </div>
      </SectionCard>
    </div>
  );
}

const themeColors = [
  { name: "Verde Neon", primary: "#00e676", bg: "#0d0d0d" },
  { name: "Azul Royal", primary: "#448aff", bg: "#0a0e1a" },
  { name: "Roxo", primary: "#7c3aed", bg: "#0d0a1a" },
  { name: "Rosa", primary: "#ff4d6d", bg: "#1a0a0f" },
  { name: "Laranja", primary: "#ff6b35", bg: "#1a0f0a" },
];

function AppearanceForm() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="space-y-4">
      <SectionCard title="Tema" desc="Escolha o esquema de cores do painel">
        <div className="grid grid-cols-5 gap-3">
          {themeColors.map((t, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative aspect-[3/4] rounded-xl border-2 transition-all overflow-hidden ${selected === i ? "border-primary scale-105" : "border-border-card hover:border-border-light"}`}
              style={{ background: t.bg }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: t.primary }} />
              <div className="p-2 flex flex-col items-center justify-center h-full">
                <div className="w-6 h-6 rounded-full mb-1" style={{ background: t.primary }} />
                <span className="text-[9px] text-text-muted font-medium">{t.name.split(" ")[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Layout">
        <div className="space-y-1">
          <Toggle label="Sidebar compacto" desc="Mostrar apenas icones na barra lateral" />
          <Toggle label="Animacoes reduzidas" desc="Desativar animacoes de transicao" />
          <Toggle label="Modo escuro" defaultChecked desc="Tema escuro (padrao)" />
        </div>
      </SectionCard>
    </div>
  );
}

function NotificationsForm() {
  return (
    <SectionCard title="Preferencias de Notificacao" desc="Escolha quais notificacoes voce deseja receber">
      <div className="divide-y divide-border-card/30">
        <Toggle label="Novo orcamento" desc="Quando um novo orcamento for criado" defaultChecked />
        <Toggle label="Pagamento recebido" desc="Quando um pagamento for confirmado" defaultChecked />
        <Toggle label="Cliente novo" desc="Quando um novo cliente for cadastrado" defaultChecked />
        <Toggle label="Orcamento vencido" desc="Quando um orcamento estiver proximo do vencimento" />
        <Toggle label="Lembretes semanais" desc="Resumo semanal de atividades" />
      </div>
    </SectionCard>
  );
}

function SecurityForm({ showPass, setShowPass }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Alterar Senha">
        <div className="space-y-4">
          <div className="relative">
            <Input label="Senha atual" id="pass_atual" type={showPass ? "text" : "password"} placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input label="Nova senha" id="pass_nova" type={showPass ? "text" : "password"} placeholder="••••••••" />
            </div>
            <div className="relative">
              <Input label="Confirmar senha" id="pass_confirm" type={showPass ? "text" : "password"} placeholder="••••••••" />
            </div>
          </div>
          <button
            onClick={() => setShowPass(!showPass)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
          >
            {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPass ? "Ocultar senhas" : "Mostrar senhas"}
          </button>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> 8+ caracteres
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> Letra maiuscula
            <span className="w-1.5 h-1.5 rounded-full bg-border-card" /> Numero
            <span className="w-1.5 h-1.5 rounded-full bg-border-card" /> Caractere especial
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Sessoes Ativas">
        <div className="flex items-center justify-between py-3 border-b border-border-card/30">
          <div className="flex items-center gap-3">
            <Smartphone size={16} className="text-text-muted" />
            <div>
              <p className="text-sm text-text">Windows - Chrome</p>
              <p className="text-xs text-text-muted">Ativo agora &middot; Palmas - TO</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-success uppercase tracking-[0.08em]">
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> Atual
          </span>
        </div>
        <button className="mt-3 text-xs text-danger hover:underline">Encerrar todas as sessoes</button>
      </SectionCard>
    </div>
  );
}

function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
