import { KpiCard, ModulePage, PageHeader, StatusBadge, GRADIENT } from "./ModulePrimitives";

const indicadores = [
  { label: "Estoque", valor: 1097, meta: 2530 },
  { label: "Doacoes", valor: 42, meta: 60 },
  { label: "Kits", valor: 18, meta: 30 },
  { label: "Entregas", valor: 24, meta: 40 },
];

const categorias = [
  { label: "Alimentos", valor: 58 },
  { label: "Higiene", valor: 24 },
  { label: "Limpeza", valor: 12 },
  { label: "Vestuario", valor: 6 },
];

export default function DashboardsSimples() {
  return (
    <ModulePage>
      <PageHeader icon="📊" title="Dashboards Simples" description="Indicadores gerais do sistema para estoque, doacoes, kits e entregas." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Estoque atual" value="1.097" sub="itens cadastrados" destaque />
        <KpiCard label="Doacoes" value="42" sub="entradas no mes" />
        <KpiCard label="Kits montados" value="18" sub="preparados para entrega" />
        <KpiCard label="Alertas" value="5" sub="validade e prioridade" alerta />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="font-lora text-base font-bold text-[#134E4A]">Visao operacional</p>
            <StatusBadge>Atualizado agora</StatusBadge>
          </div>

          <div className="grid gap-5">
            {indicadores.map((item) => {
              const pct = Math.min(100, Math.round((item.valor / item.meta) * 100));
              return (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <p className="font-dm text-sm font-semibold text-gray-700">{item.label}</p>
                    <p className="font-dm text-xs text-gray-400">{pct}% da meta</p>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: GRADIENT }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="font-lora text-base font-bold text-[#134E4A] mb-6">Distribuicao por categoria</p>
          <div className="grid gap-4">
            {categorias.map((item) => (
              <div key={item.label} className="grid grid-cols-[90px_1fr_42px] items-center gap-3">
                <p className="font-dm text-xs font-semibold text-gray-500">{item.label}</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#2DD4BF]" style={{ width: `${item.valor}%` }} />
                </div>
                <p className="font-dm text-xs font-bold text-[#134E4A] text-right">{item.valor}%</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <p className="font-lora text-base font-bold text-[#134E4A] mb-4">Resumo rapido</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-[#F0FDFA] p-4">
            <p className="font-dm text-xs font-bold uppercase text-teal-700">Estoque</p>
            <p className="font-dm text-sm text-gray-500 mt-1">3 lotes precisam de prioridade por validade.</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="font-dm text-xs font-bold uppercase text-gray-500">Kits</p>
            <p className="font-dm text-sm text-gray-500 mt-1">18 kits prontos para agenda de distribuicao.</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="font-dm text-xs font-bold uppercase text-amber-700">Entregas</p>
            <p className="font-dm text-sm text-gray-500 mt-1">2 familias de alta prioridade seguem em rota.</p>
          </div>
        </div>
      </section>
    </ModulePage>
  );
}
