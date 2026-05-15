import { useMemo, useState, type FormEvent } from "react";
import { Field, inputCls, KpiCard, ModulePage, PageHeader, PrimaryButton, StatusBadge, Toast } from "./ModulePrimitives";

type Prioridade = "Alta" | "Media" | "Baixa";
type StatusEntrega = "Planejada" | "Em rota" | "Entregue" | "Pendente";
type Entrega = {
  id: number;
  familia: string;
  bairro: string;
  kit: string;
  prioridade: Prioridade;
  status: StatusEntrega;
  data: string;
  observacoes: string;
};

const ENTREGAS_INICIAIS: Entrega[] = [
  { id: 1, familia: "Familia Silva", bairro: "Cidade Nova", kit: "Kit familia 4 pessoas", prioridade: "Alta", status: "Entregue", data: "2026-05-14", observacoes: "Entrega confirmada." },
  { id: 2, familia: "Familia Oliveira", bairro: "Compensa", kit: "Kit basico", prioridade: "Alta", status: "Em rota", data: "2026-05-15", observacoes: "Aguardar responsavel." },
  { id: 3, familia: "Familia Santos", bairro: "Alvorada", kit: "Kit higiene", prioridade: "Media", status: "Planejada", data: "2026-05-16", observacoes: "Primeira entrega." },
];

function prioridadeTone(prioridade: Prioridade) {
  if (prioridade === "Alta") return "red" as const;
  if (prioridade === "Media") return "amber" as const;
  return "teal" as const;
}

function statusTone(status: StatusEntrega) {
  if (status === "Entregue") return "teal" as const;
  if (status === "Em rota") return "blue" as const;
  if (status === "Pendente") return "amber" as const;
  return "gray" as const;
}

export default function RegistroEntregas() {
  const [entregas, setEntregas] = useState(ENTREGAS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade | "Todas">("Todas");
  const [toast, setToast] = useState({ visivel: false, msg: "" });
  const [form, setForm] = useState<Omit<Entrega, "id">>({
    familia: "",
    bairro: "",
    kit: "Kit basico",
    prioridade: "Media",
    status: "Planejada",
    data: new Date().toISOString().slice(0, 10),
    observacoes: "",
  });

  const filtradas = useMemo(() => {
    const q = busca.toLowerCase();
    return entregas.filter((e) => {
      const buscaOk = !q || e.familia.toLowerCase().includes(q) || e.bairro.toLowerCase().includes(q);
      const prioridadeOk = prioridade === "Todas" || e.prioridade === prioridade;
      return buscaOk && prioridadeOk;
    });
  }, [busca, entregas, prioridade]);

  function mostrarToast(msg: string) {
    setToast({ visivel: true, msg });
    setTimeout(() => setToast({ visivel: false, msg: "" }), 2500);
  }

  function salvar(event: FormEvent) {
    event.preventDefault();
    if (!form.familia || !form.bairro) return;
    setEntregas((prev) => [{ ...form, id: Date.now() }, ...prev]);
    setForm({ ...form, familia: "", bairro: "", observacoes: "", status: "Planejada" });
    mostrarToast("Entrega registrada.");
  }

  function atualizarStatus(id: number, status: StatusEntrega) {
    setEntregas((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    mostrarToast("Status da entrega atualizado.");
  }

  return (
    <ModulePage>
      <PageHeader icon="🚚" title="Registro de Entregas" description="Cadastro de entregas, prioridade de familias, historico e rastreamento basico." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Entregas" value={entregas.length} sub="registros totais" />
        <KpiCard label="Concluidas" value={entregas.filter((e) => e.status === "Entregue").length} sub="kits entregues" destaque />
        <KpiCard label="Alta prioridade" value={entregas.filter((e) => e.prioridade === "Alta").length} sub="familias criticas" alerta />
        <KpiCard label="Em rota" value={entregas.filter((e) => e.status === "Em rota").length} sub="acompanhamento ativo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6">
        <form onSubmit={salvar} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid gap-3">
          <p className="font-lora text-base font-bold text-[#134E4A]">Nova entrega</p>
          <Field label="Familia">
            <input className={inputCls} value={form.familia} onChange={(e) => setForm({ ...form, familia: e.target.value })} />
          </Field>
          <Field label="Bairro">
            <input className={inputCls} value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kit">
              <select className={inputCls} value={form.kit} onChange={(e) => setForm({ ...form, kit: e.target.value })}>
                {["Kit basico", "Kit familia 4 pessoas", "Kit higiene"].map((kit) => <option key={kit}>{kit}</option>)}
              </select>
            </Field>
            <Field label="Prioridade">
              <select className={inputCls} value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value as Prioridade })}>
                {["Alta", "Media", "Baixa"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as StatusEntrega })}>
                {["Planejada", "Em rota", "Entregue", "Pendente"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Data">
              <input className={inputCls} type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </Field>
          </div>
          <Field label="Observacoes">
            <textarea className={`${inputCls} min-h-24`} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
          </Field>
          <PrimaryButton type="submit">Cadastrar entrega</PrimaryButton>
        </form>

        <div>
          <div className="flex flex-wrap gap-3 items-center mb-5">
            <input className={`${inputCls} flex-1 min-w-[220px]`} placeholder="Buscar familia ou bairro..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            <select className={inputCls} value={prioridade} onChange={(e) => setPrioridade(e.target.value as Prioridade | "Todas")}>
              {["Todas", "Alta", "Media", "Baixa"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
              <p className="font-lora text-base font-bold text-[#134E4A]">Historico de Entregas</p>
              <p className="font-dm text-xs text-gray-400">{filtradas.length} registros</p>
            </div>
            <div className="divide-y divide-gray-100">
              {filtradas.map((entrega) => (
                <div key={entrega.id} className="p-5 hover:bg-[#F0FDFA] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="font-dm text-sm font-semibold text-gray-900">{entrega.familia}</p>
                      <p className="font-dm text-xs text-gray-400">{entrega.bairro} · {entrega.kit} · {entrega.data}</p>
                      <p className="font-dm text-xs text-gray-500 mt-2">{entrega.observacoes}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <StatusBadge tone={prioridadeTone(entrega.prioridade)}>Prioridade {entrega.prioridade}</StatusBadge>
                      <StatusBadge tone={statusTone(entrega.status)}>{entrega.status}</StatusBadge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(["Planejada", "Em rota", "Entregue", "Pendente"] as StatusEntrega[]).map((status) => (
                      <button key={status} className="font-dm text-xs font-semibold px-3 py-1.5 rounded-full border-2 border-gray-200 bg-white text-gray-500 hover:border-[#2DD4BF]" onClick={() => atualizarStatus(entrega.id, status)}>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toast visivel={toast.visivel} msg={toast.msg} />
    </ModulePage>
  );
}
