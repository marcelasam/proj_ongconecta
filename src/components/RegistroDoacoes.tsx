import { useMemo, useState, type FormEvent } from "react";
import { Field, inputCls, KpiCard, ModulePage, PageHeader, PrimaryButton, StatusBadge, Toast } from "./ModulePrimitives";

type Categoria = "Alimentos" | "Higiene" | "Limpeza" | "Vestuario";
type Doacao = {
  id: number;
  doador: string;
  categoria: Categoria;
  quantidade: number;
  data: string;
  validade: string;
  observacoes: string;
};

const DOACOES_INICIAIS: Doacao[] = [
  { id: 1, doador: "Supermercado Boa Compra", categoria: "Alimentos", quantidade: 120, data: "2026-05-10", validade: "2026-07-30", observacoes: "Lote para cestas basicas." },
  { id: 2, doador: "Industria Clean", categoria: "Higiene", quantidade: 80, data: "2026-05-12", validade: "2027-01-20", observacoes: "Itens lacrados." },
  { id: 3, doador: "Doacao Pessoa Fisica", categoria: "Limpeza", quantidade: 18, data: "2026-05-14", validade: "2026-05-25", observacoes: "Priorizar distribuicao." },
];

function diasAte(validade: string) {
  const hoje = new Date();
  const alvo = new Date(`${validade}T00:00:00`);
  return Math.ceil((alvo.getTime() - hoje.getTime()) / 86_400_000);
}

function statusValidade(validade: string) {
  const dias = diasAte(validade);
  if (dias < 0) return { label: "Vencido", tone: "red" as const };
  if (dias <= 30) return { label: "Atencao", tone: "amber" as const };
  return { label: "Em dia", tone: "teal" as const };
}

export default function RegistroDoacoes() {
  const [doacoes, setDoacoes] = useState(DOACOES_INICIAIS);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "Todos">("Todos");
  const [editando, setEditando] = useState<number | null>(null);
  const [toast, setToast] = useState({ visivel: false, msg: "" });
  const [form, setForm] = useState<Omit<Doacao, "id">>({
    doador: "",
    categoria: "Alimentos",
    quantidade: 1,
    data: new Date().toISOString().slice(0, 10),
    validade: "",
    observacoes: "",
  });

  const filtradas = useMemo(() => {
    const q = busca.toLowerCase();
    return doacoes.filter((d) => {
      const buscaOk = !q || d.doador.toLowerCase().includes(q) || d.observacoes.toLowerCase().includes(q);
      const categoriaOk = categoria === "Todos" || d.categoria === categoria;
      return buscaOk && categoriaOk;
    });
  }, [busca, categoria, doacoes]);

  const total = useMemo(() => doacoes.reduce((s, d) => s + d.quantidade, 0), [doacoes]);
  const alertas = useMemo(() => doacoes.filter((d) => statusValidade(d.validade).tone !== "teal").length, [doacoes]);

  function mostrarToast(msg: string) {
    setToast({ visivel: true, msg });
    setTimeout(() => setToast({ visivel: false, msg: "" }), 2500);
  }

  function limparForm() {
    setEditando(null);
    setForm({ doador: "", categoria: "Alimentos", quantidade: 1, data: new Date().toISOString().slice(0, 10), validade: "", observacoes: "" });
  }

  function salvar(event: FormEvent) {
    event.preventDefault();
    if (!form.doador || !form.validade || form.quantidade <= 0) return;

    if (editando) {
      setDoacoes((prev) => prev.map((d) => (d.id === editando ? { ...form, id: editando } : d)));
      mostrarToast("Doacao atualizada com sucesso.");
    } else {
      setDoacoes((prev) => [{ ...form, id: Date.now() }, ...prev]);
      mostrarToast("Doacao registrada com sucesso.");
    }
    limparForm();
  }

  function editar(doacao: Doacao) {
    setEditando(doacao.id);
    setForm({ doador: doacao.doador, categoria: doacao.categoria, quantidade: doacao.quantidade, data: doacao.data, validade: doacao.validade, observacoes: doacao.observacoes });
  }

  return (
    <ModulePage>
      <PageHeader icon="📥" title="Registro de Doacoes" description="Cadastro, filtros, historico e alertas de validade para cada entrada recebida." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Doacoes" value={doacoes.length} sub="registros no historico" />
        <KpiCard label="Itens recebidos" value={total} sub="unidades cadastradas" destaque />
        <KpiCard label="Alertas" value={alertas} sub="validade sensivel" alerta={alertas > 0} />
        <KpiCard label="Categorias" value={new Set(doacoes.map((d) => d.categoria)).size} sub="tipos recebidos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6">
        <form onSubmit={salvar} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid gap-3">
          <p className="font-lora text-base font-bold text-[#134E4A]">{editando ? "Editar doacao" : "Nova doacao"}</p>
          <Field label="Doador">
            <input className={inputCls} value={form.doador} onChange={(e) => setForm({ ...form, doador: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoria">
              <select className={inputCls} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}>
                {["Alimentos", "Higiene", "Limpeza", "Vestuario"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Quantidade">
              <input className={inputCls} type="number" min={1} value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data">
              <input className={inputCls} type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </Field>
            <Field label="Validade">
              <input className={inputCls} type="date" value={form.validade} onChange={(e) => setForm({ ...form, validade: e.target.value })} />
            </Field>
          </div>
          <Field label="Observacoes">
            <textarea className={`${inputCls} min-h-24`} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
          </Field>
          <div className="flex gap-3">
            <PrimaryButton type="submit">{editando ? "Salvar alteracoes" : "Cadastrar doacao"}</PrimaryButton>
            {editando ? <button type="button" className="font-dm text-sm font-semibold bg-gray-100 text-gray-600 px-5 py-2.5 rounded-full" onClick={limparForm}>Cancelar</button> : null}
          </div>
        </form>

        <div>
          <div className="flex flex-wrap gap-3 items-center mb-5">
            <input className={`${inputCls} flex-1 min-w-[220px]`} placeholder="Buscar por doador ou observacao..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            <select className={inputCls} value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria | "Todos")}>
              {["Todos", "Alimentos", "Higiene", "Limpeza", "Vestuario"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
              <p className="font-lora text-base font-bold text-[#134E4A]">Historico de Doacoes</p>
              <p className="font-dm text-xs text-gray-400">{filtradas.length} registros</p>
            </div>
            <div className="divide-y divide-gray-100">
              {filtradas.length === 0 ? (
                <p className="font-dm text-sm text-gray-400 text-center py-12">Nenhuma doacao encontrada.</p>
              ) : filtradas.map((doacao) => {
                const status = statusValidade(doacao.validade);
                return (
                  <div key={doacao.id} className="p-5 hover:bg-[#F0FDFA] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <p className="font-dm text-sm font-semibold text-gray-900">{doacao.doador}</p>
                        <p className="font-dm text-xs text-gray-400 mt-0.5">{doacao.categoria} · {doacao.quantidade} unidades · validade {doacao.validade}</p>
                        <p className="font-dm text-xs text-gray-500 mt-2">{doacao.observacoes || "Sem observacoes."}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                        <button className="w-8 h-8 rounded-lg border-2 border-gray-200 bg-white text-sm hover:border-[#2DD4BF]" onClick={() => editar(doacao)}>✏️</button>
                        <button className="w-8 h-8 rounded-lg border-2 border-gray-200 bg-white text-sm hover:border-red-300" onClick={() => { setDoacoes((prev) => prev.filter((d) => d.id !== doacao.id)); mostrarToast("Doacao removida."); }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Toast visivel={toast.visivel} msg={toast.msg} />
    </ModulePage>
  );
}
