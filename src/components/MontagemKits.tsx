import { useMemo, useState, type FormEvent } from "react";
import { Field, inputCls, KpiCard, ModulePage, PageHeader, PrimaryButton, StatusBadge, Toast } from "./ModulePrimitives";

type ItemEstoque = { id: number; nome: string; categoria: string; quantidade: number };
type KitItem = { itemId: number; nome: string; quantidade: number };
type Kit = { id: number; nome: string; perfil: string; itens: KitItem[]; data: string };

const ITENS_INICIAIS: ItemEstoque[] = [
  { id: 1, nome: "Arroz Tipo 1 5kg", categoria: "Alimentos", quantidade: 38 },
  { id: 2, nome: "Feijao Carioca 1kg", categoria: "Alimentos", quantidade: 52 },
  { id: 3, nome: "Sabonete Liquido 1L", categoria: "Higiene", quantidade: 24 },
  { id: 4, nome: "Detergente 500ml", categoria: "Limpeza", quantidade: 30 },
];

export default function MontagemKits() {
  const [estoque, setEstoque] = useState(ITENS_INICIAIS);
  const [kits, setKits] = useState<Kit[]>([
    { id: 1, nome: "Kit familia 4 pessoas", perfil: "Familia com criancas", data: "2026-05-14", itens: [{ itemId: 1, nome: "Arroz Tipo 1 5kg", quantidade: 2 }, { itemId: 2, nome: "Feijao Carioca 1kg", quantidade: 3 }] },
  ]);
  const [nome, setNome] = useState("Kit basico");
  const [perfil, setPerfil] = useState("Familia prioritaria");
  const [selecionados, setSelecionados] = useState<Record<number, number>>({});
  const [toast, setToast] = useState({ visivel: false, msg: "" });

  const itensSelecionados = useMemo(
    () => estoque.filter((item) => (selecionados[item.id] ?? 0) > 0),
    [estoque, selecionados],
  );
  const totalKits = kits.length;
  const totalItensUsados = kits.reduce((s, kit) => s + kit.itens.reduce((a, item) => a + item.quantidade, 0), 0);

  function mostrarToast(msg: string) {
    setToast({ visivel: true, msg });
    setTimeout(() => setToast({ visivel: false, msg: "" }), 2500);
  }

  function criarKit(event: FormEvent) {
    event.preventDefault();

    const itens = itensSelecionados.map((item) => ({
      itemId: item.id,
      nome: item.nome,
      quantidade: selecionados[item.id] ?? 0,
    }));

    if (!itens.length) {
      mostrarToast("Selecione ao menos um item.");
      return;
    }

    const insuficiente = itens.find((item) => {
      const saldo = estoque.find((e) => e.id === item.itemId)?.quantidade ?? 0;
      return item.quantidade > saldo;
    });

    if (insuficiente) {
      mostrarToast(`Estoque insuficiente para ${insuficiente.nome}.`);
      return;
    }

    setKits((prev) => [{ id: Date.now(), nome, perfil, data: new Date().toISOString().slice(0, 10), itens }, ...prev]);
    setEstoque((prev) => prev.map((item) => ({ ...item, quantidade: item.quantidade - (selecionados[item.id] ?? 0) })));
    setSelecionados({});
    mostrarToast("Kit montado e estoque atualizado.");
  }

  return (
    <ModulePage>
      <PageHeader icon="🎁" title="Montagem de Kits" description="Selecao de itens do estoque, definicao de quantidades e baixa automatica apos montagem." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Kits montados" value={totalKits} sub="historico registrado" />
        <KpiCard label="Itens usados" value={totalItensUsados} sub="baixas no estoque" destaque />
        <KpiCard label="Itens disponiveis" value={estoque.reduce((s, i) => s + i.quantidade, 0)} sub="saldo simulado" />
        <KpiCard label="Itens no kit" value={itensSelecionados.length} sub="selecao atual" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <form onSubmit={criarKit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid gap-4">
          <p className="font-lora text-base font-bold text-[#134E4A]">Novo kit</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nome do kit">
              <input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} />
            </Field>
            <Field label="Perfil atendido">
              <input className={inputCls} value={perfil} onChange={(e) => setPerfil(e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-3">
            {estoque.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_120px] gap-3 items-center border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="font-dm text-sm font-semibold text-gray-900">{item.nome}</p>
                  <p className="font-dm text-xs text-gray-400">{item.categoria} · saldo {item.quantidade}</p>
                </div>
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  max={item.quantidade}
                  value={selecionados[item.id] ?? 0}
                  onChange={(e) => setSelecionados({ ...selecionados, [item.id]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>
          <PrimaryButton type="submit">Criar kit</PrimaryButton>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
            <p className="font-lora text-base font-bold text-[#134E4A]">Historico de Kits</p>
            <p className="font-dm text-xs text-gray-400">{kits.length} kits</p>
          </div>
          <div className="divide-y divide-gray-100">
            {kits.map((kit) => (
              <div key={kit.id} className="p-5 hover:bg-[#F0FDFA] transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="font-dm text-sm font-semibold text-gray-900">{kit.nome}</p>
                    <p className="font-dm text-xs text-gray-400">{kit.perfil} · montado em {kit.data}</p>
                  </div>
                  <StatusBadge>{kit.itens.length} itens</StatusBadge>
                </div>
                <div className="grid gap-2 mt-4">
                  {kit.itens.map((item) => (
                    <div key={`${kit.id}-${item.itemId}`} className="rounded-xl bg-gray-50 px-3 py-2 font-dm text-xs text-gray-500">
                      {item.quantidade}x {item.nome}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toast visivel={toast.visivel} msg={toast.msg} />
    </ModulePage>
  );
}
