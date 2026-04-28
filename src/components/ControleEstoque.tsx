import { useState, useMemo } from "react";


// ─── Tipos ───────────────────────────────────────────────────────────────────

type StatusLote = "ok" | "atencao" | "vencido";
type Categoria  = "Todos" | "Alimentos" | "Higiene" | "Limpeza" | "Vestuário";
type OrdemPor   = "validade" | "quantidade" | "nome";

interface Lote {
  id:        number;
  nome:      string;
  categoria: Exclude<Categoria, "Todos">;
  lote:      string;
  doador:    string;
  validade:  string; // ISO "YYYY-MM-DD"
  quantidade: number;
  capacidade: number; // quantidade máxima do lote para a mini-barra
  status:    StatusLote;
}

// ─── Dados de exemplo ────────────────────────────────────────────────────────
// Substitua / popule via API ou props conforme necessário.

const LOTES_INICIAIS: Lote[] = [
  { id:1,  nome:"Arroz Tipo 1 5kg",        categoria:"Alimentos", lote:"LOT-2025-041", doador:"Supermercado Boa Compra", validade:"2025-09-15", quantidade:342, capacidade:400, status:"ok"      },
  { id:2,  nome:"Feijão Carioca 1kg",      categoria:"Alimentos", lote:"LOT-2025-039", doador:"Instituto Fome Zero",     validade:"2025-07-30", quantidade:180, capacidade:250, status:"ok"      },
  { id:3,  nome:"Azeite de Dendê 500ml",   categoria:"Alimentos", lote:"LOT-2025-044", doador:"Empresa XYZ",             validade:"2025-05-03", quantidade:45,  capacidade:100, status:"atencao" },
  { id:4,  nome:"Sabonete Líquido 1L",     categoria:"Higiene",   lote:"LOT-2025-033", doador:"Indústria Clean",         validade:"2026-01-20", quantidade:210, capacidade:300, status:"ok"      },
  { id:5,  nome:"Detergente 500ml",        categoria:"Limpeza",   lote:"LOT-2025-028", doador:"Doação Pessoa Física",    validade:"2025-04-10", quantidade:12,  capacidade:100, status:"vencido" },
  { id:6,  nome:"Pasta de Dente 90g",      categoria:"Higiene",   lote:"LOT-2025-040", doador:"ONG Sorriso Feliz",       validade:"2026-03-18", quantidade:95,  capacidade:150, status:"ok"      },
  { id:7,  nome:"Macarrão Espaguete 500g", categoria:"Alimentos", lote:"LOT-2025-042", doador:"Supermercado Boa Compra", validade:"2025-05-28", quantidade:220, capacidade:300, status:"atencao" },
  { id:8,  nome:"Shampoo 400ml",           categoria:"Higiene",   lote:"LOT-2025-036", doador:"Distribuidora Norte",     validade:"2026-05-10", quantidade:88,  capacidade:120, status:"ok"      },
  { id:9,  nome:"Absorvente c/8",          categoria:"Higiene",   lote:"LOT-2025-043", doador:"ONG Mãos Dadas",          validade:"2027-02-01", quantidade:150, capacidade:200, status:"ok"      },
  { id:10, nome:"Farinha de Trigo 1kg",    categoria:"Alimentos", lote:"LOT-2025-030", doador:"Fazenda São João",        validade:"2025-04-22", quantidade:5,   capacidade:80,  status:"vencido" },
];

// ─── Constantes de estilo (mesmas variáveis da Landing Page) ─────────────────

const TEAL          = "#2DD4BF";
const TEAL_DARK     = "#0D9488";
const PETROL        = "#134E4A";
const GRADIENT      = `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`;
const SHADOW_TEAL   = "0 4px 18px rgba(45,212,191,0.35)";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarData(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function pctBarra(qty: number, cap: number): number {
  return Math.min(100, Math.round((qty / cap) * 100));
}

// ─── Sub-componentes menores ─────────────────────────────────────────────────

/** Badge de status colorido */
function BadgeStatus({ status }: { status: StatusLote }) {
  const cfg = {
    ok:      { label: "Em dia",  cls: "bg-emerald-50  text-emerald-700" },
    atencao: { label: "Atenção", cls: "bg-amber-50    text-amber-700"   },
    vencido: { label: "Vencido", cls: "bg-red-50      text-red-600"     },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-dm tracking-wide ${cfg.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}

/** Mini barra de quantidade relativa à capacidade do lote */
function MiniBarra({ pct, status }: { pct: number; status: StatusLote }) {
  const cor = { ok: TEAL, atencao: "#F59E0B", vencido: "#EF4444" }[status];
  return (
    <div className="flex items-center gap-2">
      <span className="font-dm text-sm font-semibold text-[#1a2e25]">{pct}%</span>
      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cor }} />
      </div>
    </div>
  );
}

/** Card de KPI no topo do dashboard */
function KpiCard({
  label, value, sub, destaque, alerta,
}: {
  label: string; value: string | number; sub: string;
  destaque?: boolean; alerta?: boolean;
}) {
  const bg    = destaque ? GRADIENT : alerta ? "#FEF2F2" : "#FFFFFF";
  const clVal = destaque ? "text-white" : alerta ? "text-red-500" : `text-[${PETROL}]`;
  const clLbl = destaque ? "text-white/80" : "text-gray-400";
  const clSub = destaque ? "text-white/70" : alerta ? "text-red-400" : "text-gray-400";

  return (
    <div
      className="rounded-2xl p-5 border border-gray-100 transition-shadow hover:shadow-md"
      style={{ background: bg, boxShadow: destaque ? SHADOW_TEAL : "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <p className={`font-dm text-[11px] font-bold tracking-widest uppercase mb-2 ${clLbl}`}>{label}</p>
      <p className={`font-lora text-[2rem] font-bold leading-none ${clVal}`}>{value}</p>
      <p className={`font-dm text-xs mt-1.5 ${clSub}`}>{sub}</p>
    </div>
  );
}

// ─── Modal: Adicionar Lote ────────────────────────────────────────────────────

function ModalAdicionarLote({
  aberto, onFechar, onSalvar,
}: {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: (lote: Omit<Lote, "id" | "status">) => void;
}) {
  const [form, setForm] = useState({
    nome: "", categoria: "Alimentos" as Exclude<Categoria, "Todos">,
    lote: "", doador: "", validade: "", quantidade: 0, capacidade: 0,
  });

  if (!aberto) return null;

  function handleSalvar() {
    if (!form.nome || !form.lote || !form.validade || form.quantidade <= 0) return;
    onSalvar({ ...form });
    setForm({ nome:"", categoria:"Alimentos", lote:"", doador:"", validade:"", quantidade:0, capacidade:0 });
    onFechar();
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      {/* Painel */}
      <div className="bg-white rounded-2xl p-7 w-[480px] max-w-[95vw] shadow-2xl animate-[fadeInUp_0.25s_ease]">
        <p className="font-lora text-xl font-bold text-[#134E4A] mb-1">Adicionar Novo Lote</p>
        <p className="font-dm text-sm text-gray-400 mb-6">Registre a entrada de doações no estoque</p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="flex flex-col gap-1">
            <span className="font-dm text-[11px] font-bold uppercase tracking-wider text-gray-400">Nome do Item</span>
            <input
              className="border border-gray-200 rounded-xl px-3 py-2.5 font-dm text-sm focus:outline-none focus:border-[#2DD4BF] transition-colors"
              placeholder="Ex: Arroz 5kg"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-dm text-[11px] font-bold uppercase tracking-wider text-gray-400">Categoria</span>
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 font-dm text-sm focus:outline-none focus:border-[#2DD4BF] transition-colors bg-white"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value as Exclude<Categoria, "Todos"> })}
            >
              {(["Alimentos","Higiene","Limpeza","Vestuário"] as const).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="flex flex-col gap-1">
            <span className="font-dm text-[11px] font-bold uppercase tracking-wider text-gray-400">Código do Lote</span>
            <input
              className="border border-gray-200 rounded-xl px-3 py-2.5 font-dm text-sm focus:outline-none focus:border-[#2DD4BF] transition-colors"
              placeholder="LOT-2025-XXX"
              value={form.lote}
              onChange={(e) => setForm({ ...form, lote: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-dm text-[11px] font-bold uppercase tracking-wider text-gray-400">Doador / Empresa</span>
            <input
              className="border border-gray-200 rounded-xl px-3 py-2.5 font-dm text-sm focus:outline-none focus:border-[#2DD4BF] transition-colors"
              placeholder="Nome do doador"
              value={form.doador}
              onChange={(e) => setForm({ ...form, doador: e.target.value })}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="flex flex-col gap-1">
            <span className="font-dm text-[11px] font-bold uppercase tracking-wider text-gray-400">Data de Validade</span>
            <input
              type="date"
              className="border border-gray-200 rounded-xl px-3 py-2.5 font-dm text-sm focus:outline-none focus:border-[#2DD4BF] transition-colors"
              value={form.validade}
              onChange={(e) => setForm({ ...form, validade: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-dm text-[11px] font-bold uppercase tracking-wider text-gray-400">Quantidade</span>
            <input
              type="number" min={1}
              className="border border-gray-200 rounded-xl px-3 py-2.5 font-dm text-sm focus:outline-none focus:border-[#2DD4BF] transition-colors"
              placeholder="0"
              value={form.quantidade || ""}
              onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value), capacidade: Number(e.target.value) })}
            />
          </label>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            className="font-dm text-sm font-semibold bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl border-none cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={onFechar}
          >
            Cancelar
          </button>
          <button
            className="font-dm text-sm font-bold text-[#134E4A] px-5 py-2.5 rounded-xl border-none cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: GRADIENT, boxShadow: SHADOW_TEAL }}
            onClick={handleSalvar}
          >
            ✓ Salvar Lote
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast de notificação ────────────────────────────────────────────────────

function Toast({ msg, visivel }: { msg: string; visivel: boolean }) {
  if (!visivel) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl font-dm text-sm font-semibold text-white animate-[fadeInUp_0.3s_ease]"
      style={{ background: PETROL }}
    >
      ✅ {msg}
    </div>
  );
}

// ─── Componente principal: ControleEstoque ────────────────────────────────────

export default function ControleEstoque() {
  const [lotes,       setLotes]       = useState<Lote[]>(LOTES_INICIAIS);
  const [busca,       setBusca]       = useState("");
  const [filtro,      setFiltro]      = useState<Categoria>("Todos");
  const [ordem,       setOrdem]       = useState<OrdemPor>("validade");
  const [modalAberto, setModalAberto] = useState(false);
  const [toast,       setToast]       = useState({ visivel: false, msg: "" });

  // ── Estatísticas derivadas ──────────────────────────────────────────────────
  const totalItens   = useMemo(() => lotes.reduce((s, l) => s + l.quantidade, 0), [lotes]);
  const alertas      = useMemo(() => lotes.filter((l) => l.status === "atencao").length,  [lotes]);
  const vencidos     = useMemo(() => lotes.filter((l) => l.status === "vencido").length,  [lotes]);
  const metaMensal   = 2530; // ← ajuste conforme a meta real da ONG
  const pctMeta      = Math.min(100, Math.round((totalItens / metaMensal) * 100));

  // ── Filtragem + ordenação ───────────────────────────────────────────────────
  const lotesFiltrados = useMemo(() => {
    const q = busca.toLowerCase();
    return lotes
      .filter((l) => {
        const buscaOk = !q || l.nome.toLowerCase().includes(q)
                           || l.lote.toLowerCase().includes(q)
                           || l.doador.toLowerCase().includes(q);
        const filtroOk = filtro === "Todos" || l.categoria === filtro;
        return buscaOk && filtroOk;
      })
      .sort((a, b) => {
        if (ordem === "validade")   return a.validade.localeCompare(b.validade);
        if (ordem === "quantidade") return b.quantidade - a.quantidade;
        return a.nome.localeCompare(b.nome);
      });
  }, [lotes, busca, filtro, ordem]);

  // ── Ações ───────────────────────────────────────────────────────────────────
  function mostrarToast(msg: string) {
    setToast({ visivel: true, msg });
    setTimeout(() => setToast({ visivel: false, msg: "" }), 3000);
  }

  function adicionarLote(dados: Omit<Lote, "id" | "status">) {
    // Determina status automaticamente pela validade
    const hoje    = new Date();
    const valDate = new Date(dados.validade);
    const diasRestantes = Math.ceil((valDate.getTime() - hoje.getTime()) / 86_400_000);
    const status: StatusLote =
      diasRestantes < 0   ? "vencido" :
      diasRestantes <= 30 ? "atencao" : "ok";

    setLotes((prev) => [
      { ...dados, id: Date.now(), status },
      ...prev,
    ]);
    mostrarToast("Lote adicionado ao estoque com sucesso!");
  }

  function removerLote(id: number) {
    setLotes((prev) => prev.filter((l) => l.id !== id));
    mostrarToast("Lote removido do estoque.");
  }

  function exportarAuditoria() {
    // Gera CSV simples para download
    const cabecalho = ["Item","Categoria","Lote","Doador","Validade","Quantidade","Status"];
    const linhas    = lotes.map((l) =>
      [l.nome, l.categoria, l.lote, l.doador, formatarData(l.validade), l.quantidade, l.status].join(",")
    );
    const csv    = [cabecalho.join(","), ...linhas].join("\n");
    const blob   = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url    = URL.createObjectURL(blob);
    const link   = document.createElement("a");
    link.href    = url;
    link.download = `ongconecta-estoque-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    mostrarToast("Relatório exportado para auditoria!");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  const CATEGORIAS: Categoria[] = ["Todos","Alimentos","Higiene","Limpeza","Vestuário"];

  return (
    <>
      {/* Keyframe inline — evita depender de plugin externo */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .font-dm   { font-family: 'Figtree Variable', 'Figtree', sans-serif; }
        .font-lora { font-family: 'Figtree Variable', 'Figtree', sans-serif; font-weight:700; }
      `}</style>

      <div className="min-h-screen bg-[#F8FAF9] font-dm">

        {/* ── Cabeçalho da página ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-lora text-2xl md:text-3xl font-extrabold text-[#134E4A] tracking-tight">
                📦 Controle de Estoque
              </h1>
              <p className="font-dm text-sm text-gray-400 mt-1">
                Gestão por lotes · FIFO automático · Alertas de validade em tempo real
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 font-dm text-sm font-semibold text-gray-600 px-5 py-2.5 rounded-full border-2 border-gray-200 bg-white hover:border-[#2DD4BF] hover:text-[#0D9488] transition-all"
                onClick={exportarAuditoria}
              >
                ⬇ Exportar para Auditoria
              </button>
              <button
                className="flex items-center gap-2 font-dm text-sm font-bold text-[#134E4A] px-5 py-2.5 rounded-full border-none cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ background: GRADIENT, boxShadow: SHADOW_TEAL }}
                onClick={() => setModalAberto(true)}
              >
                ＋ Adicionar Lote
              </button>
            </div>
          </div>

          {/* ── KPIs ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* KPI 1: total com barra de progresso */}
            <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-dm text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Estoque Atual</p>
              <p className="font-lora text-[2rem] font-bold text-[#134E4A] leading-none">{totalItens.toLocaleString("pt-BR")}</p>
              <p className="font-dm text-xs text-gray-400 mt-1.5">{pctMeta}% da meta mensal (meta: {metaMensal.toLocaleString("pt-BR")})</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pctMeta}%`, background: GRADIENT }}
                />
              </div>
            </div>

            <KpiCard
              label="Alertas Críticos"
              value={alertas}
              sub="itens a vencer em 7 dias"
              destaque
            />
            <KpiCard
              label="Vencidos"
              value={vencidos}
              sub="Requer ação imediata"
              alerta={vencidos > 0}
            />
            <KpiCard
              label="Saídas Recentes"
              value={24}
              sub="kits distribuídos hoje"
            />
          </div>

          {/* ── Toolbar: busca + filtros + ordem ────────────────────────────── */}
          <div className="flex flex-wrap gap-3 items-center mb-5">
            {/* Busca */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl font-dm text-sm text-gray-900 bg-white outline-none focus:border-[#2DD4BF] transition-colors"
                placeholder="Buscar item, lote ou doador…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* Filtro por categoria */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  className={`font-dm text-xs font-semibold px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                    filtro === cat
                      ? "border-[#2DD4BF] bg-[#CCFBF1] text-[#0D9488]"
                      : "border-gray-200 bg-white text-gray-400 hover:border-[#2DD4BF] hover:text-[#0D9488]"
                  }`}
                  onClick={() => setFiltro(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Ordenação */}
            <select
              className="font-dm text-sm text-gray-600 px-3 py-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none cursor-pointer focus:border-[#2DD4BF] transition-colors"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as OrdemPor)}
            >
              <option value="validade">Ordenar: Validade</option>
              <option value="quantidade">Ordenar: Quantidade</option>
              <option value="nome">Ordenar: Nome A–Z</option>
            </select>
          </div>

          {/* ── Tabela ──────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
            {/* Cabeçalho da tabela */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="font-lora text-base font-bold text-[#134E4A]">Inventário de Lotes</p>
              <p className="font-dm text-xs text-gray-400">
                {lotesFiltrados.length} de {lotes.length} itens
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Item / Categoria","Lote","Doador","Validade","Quantidade","Status","Ações"].map((h) => (
                      <th key={h} className="text-left font-dm text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lotesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center font-dm text-sm text-gray-400 py-12">
                        Nenhum item encontrado.
                      </td>
                    </tr>
                  ) : (
                    lotesFiltrados.map((lote) => (
                      <tr
                        key={lote.id}
                        className="border-b border-gray-100 hover:bg-[#F0FDFA] transition-colors"
                      >
                        {/* Item + categoria */}
                        <td className="px-5 py-3.5">
                          <p className="font-dm text-sm font-semibold text-gray-900">{lote.nome}</p>
                          <p className="font-dm text-xs text-gray-400 mt-0.5">{lote.categoria}</p>
                        </td>

                        {/* Lote (monospace) */}
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                            {lote.lote}
                          </span>
                        </td>

                        {/* Doador */}
                        <td className="px-5 py-3.5 max-w-[140px]">
                          <p className="font-dm text-xs text-gray-500 truncate">{lote.doador}</p>
                        </td>

                        {/* Validade */}
                        <td className={`px-5 py-3.5 font-dm text-sm ${lote.status !== "ok" ? "text-red-500 font-bold" : "text-gray-600"}`}>
                          {formatarData(lote.validade)}
                        </td>

                        {/* Quantidade + mini barra */}
                        <td className="px-5 py-3.5">
                          <MiniBarra pct={pctBarra(lote.quantidade, lote.capacidade)} status={lote.status} />
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <BadgeStatus status={lote.status} />
                        </td>

                        {/* Ações */}
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity [tr:hover_&]:opacity-100">
                            <button
                              title="Editar"
                              className="w-8 h-8 rounded-lg border-2 border-gray-200 bg-white text-sm flex items-center justify-center hover:border-[#2DD4BF] hover:bg-[#CCFBF1] transition-all cursor-pointer"
                            >
                              ✏️
                            </button>
                            <button
                              title="Registrar saída"
                              className="w-8 h-8 rounded-lg border-2 border-gray-200 bg-white text-sm flex items-center justify-center hover:border-[#2DD4BF] hover:bg-[#CCFBF1] transition-all cursor-pointer"
                            >
                              📤
                            </button>
                            <button
                              title="Remover lote"
                              className="w-8 h-8 rounded-lg border-2 border-gray-200 bg-white text-sm flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer"
                              onClick={() => removerLote(lote.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé / paginação simples */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="font-dm text-xs text-gray-400">Página 1 de 1</p>
              <div className="flex gap-2">
                {["‹","1","›"].map((l, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-lg border-2 font-dm text-xs font-bold cursor-pointer transition-all ${
                      l === "1"
                        ? "border-[#2DD4BF] bg-[#2DD4BF] text-[#134E4A]"
                        : "border-gray-200 bg-white text-gray-400 hover:border-[#2DD4BF]"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <ModalAdicionarLote
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={adicionarLote}
      />

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Toast visivel={toast.visivel} msg={toast.msg} />
    </>
  );
}
