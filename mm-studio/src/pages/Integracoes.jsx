import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Globe, MessageCircle, Mail, Camera, Smartphone, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";

const APPS = [
  { nome: "Instagram", desc: "Conecte seu perfil comercial para agendar posts", icon: Camera, cor: "#e4405f", bg: "#e4405f18", status: "off", tipo: "rede social" },
  { nome: "WhatsApp", desc: "Envie orcamentos e cobrancas automaticamente", icon: MessageCircle, cor: "#25d366", bg: "#25d36618", status: "off", tipo: "comunicacao" },
  { nome: "Gmail", desc: "Sincronize seus emails e convites de reuniao", icon: Mail, cor: "#ea4335", bg: "#ea433518", status: "off", tipo: "email" },
  { nome: "Google Drive", desc: "Armazene documentos e compartilhe arquivos", icon: Globe, cor: "#4285f4", bg: "#4285f418", status: "off", tipo: "armazenamento" },
  { nome: "Notion", desc: "Sincronize tasks e documentacao do estúdio", icon: Link2, cor: "#000000", bg: "#ffffff10", status: "off", tipo: "produtividade" },
  { nome: "Slack", desc: "Receba notificacoes de novos orcamentos e pagamentos", icon: MessageCircle, cor: "#4a154b", bg: "#4a154b18", status: "off", tipo: "comunicacao" },
  { nome: "Calendly", desc: "Integre agendamento automatico de reunioes", icon: Smartphone, cor: "#006bff", bg: "#006bff18", status: "off", tipo: "agenda" },
  { nome: "Mercado Pago", desc: "Receba pagamentos online com link de cobranca", icon: Link2, cor: "#00b5e2", bg: "#00b5e218", status: "off", tipo: "pagamento" },
];

export default function Integracoes() {
  const [apps, setApps] = useState(APPS);

  const toggle = (nome) => {
    setApps(prev => prev.map(a => a.nome === nome ? { ...a, status: a.status === "on" ? "off" : "on" } : a));
  };

  const activeCount = apps.filter(a => a.status === "on").length;

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Integracoes</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Integracoes</h1>
            <p className="text-xs text-text-muted mt-1">{activeCount} de {apps.length} integracoes ativas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.map((app, i) => (
            <motion.div key={app.nome} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`bg-bg-card rounded-2xl p-5 border relative overflow-hidden group ${app.status === "on" ? "border-primary/30" : "border-border-card"}`}>
              {app.status === "on" && <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary rounded-t-2xl" />}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: app.bg }}>
                    <app.icon size={20} style={{ color: app.cor }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">{app.nome}</h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-[0.08em]">{app.tipo}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted mb-4 min-h-[32px]">{app.desc}</p>
              <div className="flex items-center justify-between">
                <button onClick={() => toggle(app.nome)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${app.status === "on" ? "bg-success/15 text-success" : "bg-white/[0.04] text-text-muted hover:text-text"}`}>
                  {app.status === "on" ? <><ToggleRight size={14} /> Conectado</> : <><ToggleLeft size={14} /> Desconectado</>}
                </button>
                <ExternalLink size={13} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}