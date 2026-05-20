import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Save, User, Building, Bell, Lock, Palette, Smartphone, LogOut, Eye, EyeOff, Camera, Download, Upload, DollarSign, RefreshCw, FileText } from "lucide-react";
import { getPerfis, savePerfis, getPerfilAtivo, setPerfilAtivo } from "../utils/storage";

const sections = [
  { key: "perfil", label: "Perfil", icon: User },
  { key: "loja", label: "Loja / Estudio", icon: Building },
  { key: "pagamento", label: "Pagamento", icon: DollarSign },
  { key: "aparencia", label: "Aparencia", icon: Palette },
  { key: "dados", label: "Dados", icon: FileText },
  { key: "seguranca", label: "Seguranca", icon: Lock },
];

export default function Settings() {
  const [tab, setTab] = useState("perfil");
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  const profile = useMemo(() => getPerfilAtivo(), []);

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
            {tab === "perfil" && <ProfileForm initial={profile} onSave={handleSave} />}
            {tab === "loja" && <CompanyForm initial={profile} onSave={handleSave} />}
            {tab === "pagamento" && <PaymentForm initial={profile} onSave={handleSave} />}
            {tab === "aparencia" && <AppearanceForm />}
            {tab === "dados" && <DataForm />}
            {tab === "seguranca" && <SecurityForm showPass={showPass} setShowPass={setShowPass} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ children, title, desc }) {
  return (
    <div className="bg-bg-card rounded-xl p-6 card-border glow-primary mb-4">
      <h2 className="text-sm font-display font-bold text-text mb-1">{title}</h2>
      {desc && <p className="text-xs text-text-muted mb-5">{desc}</p>}
      {children}
    </div>
  );
}

function Input({ label, id, type = "text", placeholder, defaultValue, suffix, onChange }) {
  const showSuffix = type === "color";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em]">{label}</label>
      <div className="relative">
        {type === "color" ? (
          <div className="flex items-center gap-2">
            <input type="color" id={id} defaultValue={defaultValue || "#00e676"} onChange={onChange}
              className="w-10 h-10 rounded-lg border border-border-card bg-bg-elevated cursor-pointer" />
            <span className="text-xs text-text-muted font-mono">{defaultValue || "#00e676"}</span>
          </div>
        ) : (
          <input type={type} id={id} placeholder={placeholder} defaultValue={defaultValue} onChange={onChange}
            className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors"
          />
        )}
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
        className="relative flex-shrink-0 transition-colors rounded-full"
        style={{ height: "22px", width: "40px", background: on ? "#00e676" : "#2a2a2a" }}
      >
        <div className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-black transition-all" style={{ left: on ? "20px" : "2px" }} />
      </button>
    </div>
  );
}

function saveProfileField(field, value) {
  const perfis = getPerfis();
  const ativo = getPerfilAtivo();
  const idx = perfis.findIndex(p => p.id === ativo.id);
  if (idx >= 0) {
    perfis[idx][field] = value;
    savePerfis(perfis);
  }
}

function ProfileForm({ initial, onSave }) {
  const [nome, setNome] = useState(initial?.nome || "Miguel Martins");
  const [email, setEmail] = useState(initial?.email || "");
  const [telefone, setTelefone] = useState(initial?.telefone || "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp || "");
  const [cpf, setCpf] = useState(initial?.cpf || "");
  const [tipo, setTipo] = useState(initial?.tipo || "pf");

  const handleSave = () => {
    saveProfileField("nome", nome);
    saveProfileField("email", email);
    saveProfileField("telefone", telefone);
    saveProfileField("whatsapp", whatsapp);
    saveProfileField("cpf", cpf);
    saveProfileField("tipo", tipo);
    onSave();
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Dados Pessoais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome" id="nome" defaultValue={nome} placeholder="Seu nome" onChange={(e) => setNome(e.target.value)} />
          <Input label="Email" id="email" type="email" defaultValue={email} placeholder="email@exemplo.com" onChange={(e) => setEmail(e.target.value)} />
          <Input label="Telefone" id="telefone" defaultValue={telefone} placeholder="(99) 99999-0000" suffix="Ligacao" onChange={(e) => setTelefone(e.target.value)} />
          <Input label="WhatsApp" id="whatsapp" defaultValue={whatsapp} placeholder="(99) 99999-0000" suffix="WhatsApp" onChange={(e) => setWhatsapp(e.target.value)} />
          <Input label="CPF" id="cpf" defaultValue={cpf} placeholder="000.000.000-00" onChange={(e) => setCpf(e.target.value)} />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em]">Tipo de pessoa</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary/50">
              <option value="pf">Pessoa Fisica (PF)</option>
              <option value="pj">Pessoa Juridica (PJ)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2 rounded-lg text-sm"><Save size={15} /> Salvar</button>
        </div>
      </SectionCard>
      <SectionCard title="Foto do Perfil" desc="Sua foto aparece no sidebar e em notificacoes">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-bg-elevated border-2 border-border-card flex items-center justify-center text-2xl font-bold text-primary">
              {(nome || "MM").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-text font-medium">{nome}</p>
            <p className="text-xs text-text-muted">JPG, PNG ou WebP. Max 2MB.</p>
            <button className="mt-1.5 text-xs text-primary hover:underline">Alterar foto</button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function CompanyForm({ initial, onSave }) {
  const [nomeEmpresa, setNomeEmpresa] = useState(initial?.nomeEmpresa || "MM Studio");
  const [cnpj, setCnpj] = useState(initial?.cnpj || "");
  const [endereco, setEndereco] = useState(initial?.endereco || "");
  const [email, setEmail] = useState(initial?.email || "");

  const handleSave = () => {
    saveProfileField("nomeEmpresa", nomeEmpresa);
    saveProfileField("cnpj", cnpj);
    saveProfileField("endereco", endereco);
    saveProfileField("email", email);
    onSave();
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Dados do Estudio" desc="Estas informacoes aparecem nos PDFs de proposta">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome do Estudio" id="studio_nome" defaultValue={nomeEmpresa} placeholder="Nome do estudio" onChange={(e) => setNomeEmpresa(e.target.value)} />
          <Input label="CNPJ" id="cnpj" defaultValue={cnpj} placeholder="00.000.000/0001-00" onChange={(e) => setCnpj(e.target.value)} />
          <Input label="Email" id="email" type="email" defaultValue={email} placeholder="email@exemplo.com" onChange={(e) => setEmail(e.target.value)} />
          <Input label="Endereco" id="endereco" defaultValue={endereco} placeholder="Endereco completo" onChange={(e) => setEndereco(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2 rounded-lg text-sm"><Save size={15} /> Salvar</button>
        </div>
      </SectionCard>
      <SectionCard title="Redes Sociais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Instagram" id="instagram" placeholder="@seuperfil" />
          <Input label="WhatsApp" id="whatsapp_comp" placeholder="(99) 99999-0000" />
          <Input label="Site" id="site" placeholder="https://" />
        </div>
      </SectionCard>
    </div>
  );
}

function PaymentForm({ initial, onSave }) {
  const [pixTipo, setPixTipo] = useState(initial?.pixTipo || "cpf");
  const [pixChave, setPixChave] = useState(initial?.pixChave || "");
  const [mostrarPix, setMostrarPix] = useState(initial?.mostrarPix !== false);

  const handleSave = () => {
    saveProfileField("pixTipo", pixTipo);
    saveProfileField("pixChave", pixChave);
    saveProfileField("mostrarPix", mostrarPix);
    onSave();
  };

  return (
    <SectionCard title="Configuracao de Pagamento" desc="Informacoes de PIX que aparecem nos PDFs de proposta">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em]">Tipo de chave PIX</label>
            <select value={pixTipo} onChange={(e) => setPixTipo(e.target.value)}
              className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary/50">
              <option value="cpf">CPF</option>
              <option value="email">Email</option>
              <option value="telefone">Telefone</option>
              <option value="aleatoria">Chave Aleatoria</option>
            </select>
          </div>
          <Input label="Chave PIX" id="pixChave" defaultValue={pixChave} placeholder="Digite a chave PIX" onChange={(e) => setPixChave(e.target.value)} />
        </div>
        <Toggle label="Mostrar PIX nos PDFs" desc="Exibir informacao de pagamento nas propostas em PDF" defaultChecked={mostrarPix} />
        <div className="mt-4 flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2 rounded-lg text-sm"><Save size={15} /> Salvar</button>
        </div>
      </div>
    </SectionCard>
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

function DataForm() {
  const [importStatus, setImportStatus] = useState(null);
  const fileRef = useRef(null);

  const STORAGE_KEYS = [
    "historico_orcamentos_miguel",
    "clientes_miguel",
    "financeiro_miguel",
    "servicos_miguel",
    "pacotes_miguel",
    "orc_perfis_v1",
    "orc_contador_v1",
  ];

  const exportData = () => {
    const data = {};
    STORAGE_KEYS.forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) data[key] = JSON.parse(raw);
      } catch {}
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mm-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        let count = 0;
        STORAGE_KEYS.forEach(key => {
          if (data[key] !== undefined) {
            localStorage.setItem(key, JSON.stringify(data[key]));
            count++;
          }
        });
        setImportStatus({ type: "success", msg: `${count} categorias importadas com sucesso!` });
      } catch {
        setImportStatus({ type: "error", msg: "Arquivo invalido. Verifique o formato JSON." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const clearAllData = () => {
    if (window.confirm("Tem certeza? Todos os dados serao perdidos!")) {
      STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
      setImportStatus({ type: "success", msg: "Todos os dados foram removidos." });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Exportar Dados" desc="Baixe todos os dados do sistema em formato JSON">
        <p className="text-xs text-text-muted mb-4">Inclui historico de orcamentos, clientes, financeiro, servicos, pacotes e perfis.</p>
        <button onClick={exportData} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
          <Download size={16} /> Baixar Backup
        </button>
      </SectionCard>

      <SectionCard title="Importar Dados" desc="Restaurar dados a partir de um arquivo JSON">
        <p className="text-xs text-text-muted mb-4">Selecione um arquivo .json gerado anteriormente pela exportacao.</p>
        <div className="flex items-center gap-3">
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all">
            <Upload size={16} /> Selecionar Arquivo
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={importData} className="hidden" />
        </div>
        {importStatus && (
          <div className={`mt-3 px-4 py-2 rounded-lg text-xs ${importStatus.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {importStatus.msg}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Gerenciar Dados" desc="Visualize o resumo dos dados armazenados">
        <div className="space-y-2">
          {STORAGE_KEYS.map(key => {
            let count = 0;
            try {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                count = Array.isArray(parsed) ? parsed.length : 1;
              }
            } catch {}
            return (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border-card/30 last:border-0">
                <span className="text-sm text-text">{key}</span>
                <span className="text-xs text-text-muted">{count} registro{count !== 1 ? "s" : ""}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Zerar Dados" desc="Remover todos os dados do sistema">
        <button onClick={clearAllData} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm bg-danger/10 text-danger hover:bg-danger/20 transition-all">
          <RefreshCw size={16} /> Limpar Todos os Dados
        </button>
      </SectionCard>
    </div>
  );
}

function SecurityForm({ showPass, setShowPass }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Alterar Senha">
        <div className="space-y-4">
          <div className="relative">
            <div className="relative">
              <Input label="Senha atual" id="pass_atual" type={showPass ? "text" : "password"} placeholder="********" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input label="Nova senha" id="pass_nova" type={showPass ? "text" : "password"} placeholder="********" />
            </div>
            <div className="relative">
              <Input label="Confirmar senha" id="pass_confirm" type={showPass ? "text" : "password"} placeholder="********" />
            </div>
          </div>
          <button
            onClick={() => setShowPass(!showPass)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
          >
            {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPass ? "Ocultar senhas" : "Mostrar senhas"}
          </button>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-2">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success" /> 8+ caracteres</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success" /> Letra maiuscula</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-border-card" /> Numero</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-border-card" /> Caractere especial</span>
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
