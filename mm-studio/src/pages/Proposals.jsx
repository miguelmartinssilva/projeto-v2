import { motion } from "framer-motion";
import { Search, Plus, FileText, MessageCircle, Palette, Camera, Globe, Video, Music, Layers, Star } from "lucide-react";

const services = [
  { name: "Identidade Visual", price: "R$ 1.200", icon: Palette, cat: "Branding" },
  { name: "Social Media (Posts)", price: "R$ 60", icon: Camera, cat: "Social" },
  { name: "Site Institucional", price: "R$ 2.500", icon: Globe, cat: "Web" },
  { name: "Video Institucional", price: "R$ 1.500", icon: Video, cat: "Video" },
  { name: "Reels/Shorts", price: "R$ 200", icon: Music, cat: "Social" },
  { name: "Cobertura Evento", price: "R$ 800", icon: Layers, cat: "Evento" },
];

export default function Proposals() {
  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Orcamento</span></p>
            <h1 className="text-xl font-display font-bold text-text">Novo Orcamento</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary bg-bg-card border border-border-card rounded-lg px-3 py-2">
            <Star size={14} className="text-primary" />
            <span>Perfil: <span className="text-text font-medium">Miguel Martins</span> <span className="text-text-muted">(PF)</span></span>
            <button className="text-primary hover:underline ml-1">Editar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4 flex items-center gap-2"><Palette size={16} className="text-primary" /> Catalogo de Servicos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i }}
                    className="group relative bg-bg-elevated border border-border-card rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <s.icon size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text">{s.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{s.cat}</p>
                        <p className="text-sm font-display font-bold text-primary mt-1.5">{s.price}</p>
                      </div>
                    </div>
                    <button className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary/0 hover:bg-primary/20 border border-border-card hover:border-primary/40 flex items-center justify-center transition-all">
                      <Plus size={13} className="text-text-muted group-hover:text-primary transition-colors" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-bg-card rounded-xl p-6 card-border glow-primary"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Dados do Cliente</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="floating-label">
                  <input type="text" id="cli-nome" placeholder=" " className="has-icon" />
                  <Search size={14} className="input-icon" />
                  <label htmlFor="cli-nome">Nome do cliente</label>
                </div>
                <div className="floating-label">
                  <input type="text" id="cli-contato" placeholder=" " className="has-icon" />
                  <MessageCircle size={14} className="input-icon" />
                  <label htmlFor="cli-contato">WhatsApp</label>
                </div>
                <div className="floating-label">
                  <input type="text" id="cli-empresa" placeholder=" " />
                  <label htmlFor="cli-empresa">Empresa</label>
                </div>
                <div className="floating-label">
                  <select id="cli-tipo">
                    <option value="1.5">Comercio</option>
                    <option value="2.0">Vereador</option>
                    <option value="2.5">Prefeitura</option>
                    <option value="1.8">Evento</option>
                    <option value="1.0">Particular</option>
                  </select>
                  <label htmlFor="cli-tipo">Tipo de cliente</label>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-card rounded-xl p-6 card-border glow-primary"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Servicos</h2>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-bg-elevated rounded-lg border border-border-card/50">
                    <input className="flex-1 bg-transparent border-none outline-none text-sm text-text placeholder-text-muted" placeholder="Descricao do servico" />
                    <input className="w-16 bg-bg-input border border-border-card rounded-md px-2 py-1.5 text-xs text-text text-center" placeholder="Qtd" />
                    <input className="w-20 bg-bg-input border border-border-card rounded-md px-2 py-1.5 text-xs text-text text-right" placeholder="Valor" />
                    <span className="text-xs text-text-muted w-16 text-right font-medium">R$ 0</span>
                    <button className="text-text-muted hover:text-danger transition-colors text-xs">X</button>
                  </div>
                ))}
                <button className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-2"><Plus size={14} /> Adicionar servico</button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-6 space-y-4"
          >
            <div className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Resumo</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span className="text-text font-medium">R$ 3.860</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Tipo (Comercio x1.5)</span><span className="text-text font-medium">x1.50</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Urgencia</span><span className="text-text font-medium">x1.00</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Complexidade</span><span className="text-text font-medium">x1.00</span></div>
                <div className="h-px bg-border-card my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-text font-semibold">Total</span>
                  <span className="font-display text-xl font-bold text-primary glow-primary px-3 py-1 rounded-lg">R$ 5.790</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {["Eco", "Ideal", "Premium"].map((tier, i) => (
                <button key={tier} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all border ${i === 1 ? "bg-primary/15 border-primary text-primary" : "bg-bg-elevated border-border-card text-text-muted hover:border-primary/30"}`}>
                  {tier}
                </button>
              ))}
            </div>

            <button className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm"><FileText size={16} /> Gerar Proposta</button>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all"><MessageCircle size={16} /> Enviar no WhatsApp</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
