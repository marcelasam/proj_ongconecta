import { useState, useEffect } from "react";

// ─── Tipagem ───────────────────────────────────────────────────────────────────

type Priority = "Alta" | "Média";

interface Stat       { value: string; label: string }
interface Feature    { icon: string;  title: string; desc: string }
interface Problem    { icon: string;  title: string; desc: string; accentBorder: string }
interface FamilyCard { name: string;  cidade: string; descricao: string; prioridade: Priority; accentBar: string }

// ─── Dados estáticos ───────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { value: "1.200+", label: "Famílias atendidas"   },
  { value: "48.000", label: "Itens doados"          },
  { value: "320",    label: "Voluntários ativos"    },
  { value: "R$2M+",  label: "Recursos mobilizados"  },
];

const FEATURES: Feature[] = [
  { icon: "📥", title: "Registro de Doações",      desc: "Cadastre lotes de empresas e doações individuais com rastreabilidade completa de origem e data." },
  { icon: "📦", title: "Controle de Estoque",       desc: "Gestão por lotes com data de validade, alertas automáticos e rotação FIFO para alimentos." },
  { icon: "🎁", title: "Montagem de Kits",          desc: "Monte cestas e kits com fluxo de aprovação, garantindo padronização e controle de saídas." },
  { icon: "🚚", title: "Registro de Entregas",      desc: "Histórico completo por família com critérios de priorização e rastreabilidade de cada kit entregue." },
  { icon: "📊", title: "Dashboards Simples",        desc: "Visão geral do estoque, entregas e famílias atendidas. Exportação para relatórios de parceiros." },
  { icon: "🔒", title: "Funciona Offline",          desc: "Projetado para internet instável. Sincroniza dados quando a conexão é restabelecida." },
];

const PROBLEMS: Problem[] = [
  { icon: "⚠️", title: "Estoque divergente",          desc: "O papel não bate com o físico. Entradas e saídas manuais geram erros frequentes.",               accentBorder: "border-l-red-400"     },
  { icon: "⏰", title: "Validade ignorada",            desc: "Sem rotação FIFO, alimentos e kits de higiene vencem antes de serem distribuídos.",               accentBorder: "border-l-orange-400"  },
  { icon: "👥", title: "Distribuição desigual",        desc: "Sem histórico, algumas famílias recebem mais de uma vez enquanto outras ficam sem.",               accentBorder: "border-l-red-400"     },
  { icon: "📋", title: "Prestação de contas manual",   desc: "Relatórios para parceiros exigem horas de trabalho extra e ainda ficam incompletos.",             accentBorder: "border-l-emerald-400" },
];

const FAMILIES: FamilyCard[] = [
  { name: "Família Silva",    cidade: "Manaus, AM", descricao: "3 crianças em idade escolar, mãe solo.",            prioridade: "Alta",  accentBar: "bg-red-400"     },
  { name: "Família Oliveira", cidade: "Manaus, AM", descricao: "Idosa e neto dependente, sem renda fixa.",          prioridade: "Alta",  accentBar: "bg-orange-400"  },
  { name: "Família Santos",   cidade: "Manaus, AM", descricao: "Recém-chegados, precisam de kit básico.",           prioridade: "Média", accentBar: "bg-emerald-400" },
];

// Links da navegação com slug de âncora pré-calculado
const NAV_LINKS = [
  { label: "Sobre",    anchor: "#sobre"    },
  { label: "Solução",  anchor: "#solucao"  },
  { label: "Famílias", anchor: "#familias" },
  { label: "Contato",  anchor: "#contato"  },
];

const FOOTER_LINKS = ["Privacidade", "Termos", "Contato"];

// ─── Constantes de estilo reutilizadas ────────────────────────────────────────

// Gradiente primário da marca (verde teal → verde claro)
const GRADIENT_PRIMARY = "linear-gradient(135deg, #19c19e, #69e3a9)";
const SHADOW_GREEN     = "0 4px 18px rgba(25,193,158,0.4)";

// Classes Tailwind compartilhadas entre botões primários
const BTN_PRIMARY_CLS =
  "font-dm text-sm font-semibold text-white px-7 py-3 rounded-full no-underline inline-block transition-all hover:-translate-y-0.5";

const BTN_OUTLINE_DARK_CLS =
  "font-dm text-sm font-semibold text-[#1a2e25] border-2 border-[#1a2e25] px-7 py-3 rounded-full no-underline transition-all hover:bg-[#1a2e25] hover:text-white hover:-translate-y-0.5";

// Tamanho de título de seção com escala fluida via clamp
const SECTION_TITLE_STYLE = { fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)" };

// ─── Subcomponentes ────────────────────────────────────────────────────────────

/** Tag de seção com linha decorativa lateral esquerda */
function SectionTag({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 font-dm text-xs font-semibold tracking-[0.1em] uppercase text-[#19c19e] mb-4">
      <span className="w-6 h-0.5 bg-[#19c19e] block" />
      {children}
    </div>
  );
}

/** Cartão de feature na seção de solução — borda gradiente aparece no hover via pseudo-elemento */
function FeatureCard({ feature, delayIndex }: { feature: Feature; delayIndex: number }) {
  // Delay escalonado cria entrada em cascata por coluna (índice mod 3)
  const staggerDelay = `${0.1 * (delayIndex % 3)}s`;

  return (
    <div
      className="feature-card-hover relative bg-white/5 border border-emerald-300/15 rounded-2xl p-8
                 overflow-hidden transition-all hover:bg-white/[0.08] hover:-translate-y-1.5 hover:border-emerald-300/35"
      style={{ transitionDelay: staggerDelay }}
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-300/10 border border-emerald-300/25
                      flex items-center justify-center text-2xl mb-5">
        {feature.icon}
      </div>
      <p className="font-lora text-base font-semibold text-white mb-2">{feature.title}</p>
      <p className="font-dm text-sm text-white/50 leading-relaxed font-light">{feature.desc}</p>
    </div>
  );
}

/** Cartão de problema com borda lateral colorida indicando severidade */
function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <div className={`bg-white rounded-2xl px-5 py-4 border-l-4 ${problem.accentBorder}
                     shadow-[0_4px_16px_rgba(26,46,37,0.06)] flex items-start gap-4
                     transition-all hover:shadow-[0_8px_28px_rgba(26,46,37,0.12)] hover:translate-x-1`}>
      <span className="text-2xl flex-shrink-0 mt-0.5">{problem.icon}</span>
      <div>
        <p className="font-dm font-semibold text-sm text-[#1a2e25] mb-1">{problem.title}</p>
        <p className="font-dm text-xs text-[#6b8c7d] leading-relaxed">{problem.desc}</p>
      </div>
    </div>
  );
}

/** Cartão de família com badge de prioridade e barra colorida na borda inferior */
function FamilyCardItem({ family }: { family: FamilyCard }) {
  const isHighPriority = family.prioridade === "Alta";

  return (
    <div className="relative bg-white rounded-2xl p-7 overflow-hidden border border-[rgba(26,46,37,0.06)]
                    shadow-[0_6px_24px_rgba(26,46,37,0.07)] transition-all
                    hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(26,46,37,0.13)]">

      {/* Barra inferior colorida: indicador visual de prioridade da família */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl ${family.accentBar}`} />

      <span className={`inline-flex items-center gap-1 font-dm text-xs font-bold tracking-widest uppercase
                        px-3 py-1 rounded-full mb-5
                        ${isHighPriority ? "bg-red-50 text-red-500" : "bg-emerald-50 text-[#2d4a3e]"}`}>
        {isHighPriority ? "🔴" : "🟢"} Prioridade {family.prioridade}
      </span>

      <p className="font-lora text-lg font-semibold text-[#1a2e25] mb-1">{family.name}</p>
      <p className="font-dm text-xs text-[#6b8c7d] mb-3">📍 {family.cidade}</p>
      <p className="font-dm text-sm text-[#3d5a4e] leading-relaxed border-t border-[rgba(26,46,37,0.07)] pt-3">
        {family.descricao}
      </p>
    </div>
  );
}

/** Mini-cartão flutuante reutilizável para a visual do hero */
function HeroFloatCard({
  label, value, sub, className, style,
}: {
  label: string; value: string; sub: string;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute rounded-2xl p-5 shadow-[0_10px_40px_rgba(26,46,37,0.1)]
                  hover:-translate-y-1.5 transition-transform ${className}`}
      style={style}
    >
      <p className="font-dm text-xs font-semibold tracking-widest uppercase mb-1.5 opacity-70">{label}</p>
      <p className="font-lora text-[1.8rem] font-bold leading-tight">{value}</p>
      <p className="font-dm text-sm mt-1 opacity-80">{sub}</p>
    </div>
  );
}

// ─── CSS global ───────────────────────────────────────────────────────────────
// Separado do JSX pois contém: @import de fontes, keyframes de animação
// e pseudo-elemento ::before (não suportados como utilitários Tailwind inline)

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .font-dm   { font-family: 'DM Sans', sans-serif; }
  .font-lora { font-family: 'Lora', Georgia, serif; }

  html { scroll-behavior: smooth; }

  /* Animação de entrada ao entrar na viewport */
  .fade-up         { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  /* Blobs flutuantes do fundo do hero */
  @keyframes floatBlob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%      { transform: translate(20px, -30px) scale(1.05); }
  }
  .blob-1 { animation: floatBlob 8s  ease-in-out infinite; }
  .blob-2 { animation: floatBlob 10s ease-in-out infinite reverse; }

  /* Barra de progresso do cartão de estoque no hero */
  @keyframes growBar {
    from { width: 0; }
    to   { width: 73%; }
  }
  .progress-fill { animation: growBar 1.5s ease 1s both; width: 73%; }

  /* Animações de entrada escalonadas do hero */
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-badge       { animation: fadeInDown 0.6s ease        both; }
  .hero-title-anim  { animation: fadeInUp   0.7s ease 0.1s   both; }
  .hero-desc-anim   { animation: fadeInUp   0.7s ease 0.2s   both; }
  .hero-ctas-anim   { animation: fadeInUp   0.7s ease 0.3s   both; }
  .hero-visual-anim { animation: fadeInUp   0.9s ease 0.2s   both; }

  /* Linha gradiente que aparece no topo do feature card ao hover (pseudo-elemento) */
  .feature-card-hover::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #19c19e, #69e3a9);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .feature-card-hover:hover::before { opacity: 1; }
`;

// ─── Componente principal ──────────────────────────────────────────────────────

export default function Home() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // Observa elementos com [data-animate] e os marca como visíveis ao entrar na viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, target.id]));
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Retorna a classe de animação de fade-in para a seção informada
  const fadeIn = (sectionId: string) =>
    `fade-up ${visibleSections.has(sectionId) ? "visible" : ""}`;

  return (
    <div className="font-serif bg-[#f8f9f5] overflow-x-hidden" style={{ fontFamily: "'Lora', Georgia, serif" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── Navegação ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                      px-6 md:px-16 py-4 bg-[rgba(248,249,245,0.92)] backdrop-blur-md
                      border-b border-emerald-200/30">
        <a href="#" className="flex items-center gap-3 no-underline">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: GRADIENT_PRIMARY, boxShadow: "0 4px 14px rgba(25,193,158,0.35)" }}
          >
            🤲
          </div>
          <div>
            <p className="font-lora font-bold text-[1.1rem] text-[#1a2e25] leading-tight">Mãos Solidárias</p>
            <p className="font-dm text-[0.65rem] text-[#6b8c7d] tracking-widest uppercase">Gestão de doações</p>
          </div>
        </a>

        <ul className="hidden md:flex gap-10 list-none">
          {NAV_LINKS.map(({ label, anchor }) => (
            <li key={anchor}>
              <a href={anchor}
                 className="font-dm text-sm font-medium text-[#3d5a4e] no-underline hover:text-[#19c19e] transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#solucao"
           className="font-dm text-sm font-semibold text-white px-6 py-2.5 rounded-full no-underline transition-all hover:-translate-y-0.5"
           style={{ background: GRADIENT_PRIMARY, boxShadow: SHADOW_GREEN }}>
          Acessar sistema
        </a>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section id="hero" className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center
                                    px-6 md:px-16 pt-28 pb-16 relative overflow-hidden">

        {/* Blobs decorativos com animação flutuante */}
        <div className="blob-1 absolute rounded-full pointer-events-none z-0"
             style={{ width: 600, height: 600, top: -100, right: -100, filter: "blur(80px)",
                      background: "radial-gradient(circle, rgba(105,227,169,0.25), transparent 70%)" }} />
        <div className="blob-2 absolute rounded-full pointer-events-none z-0"
             style={{ width: 400, height: 400, bottom: -50, left: 200, filter: "blur(80px)",
                      background: "radial-gradient(circle, rgba(157,247,181,0.2), transparent 70%)" }} />

        {/* Texto principal */}
        <div className="relative z-10 max-w-xl">
          <div className="hero-badge inline-flex items-center gap-2 bg-emerald-100/50 border border-emerald-300/50
                          text-[#2d4a3e] font-dm text-xs font-semibold tracking-widest uppercase
                          px-4 py-1.5 rounded-full mb-7">
            <span>🌱</span>
            <span>ONG Mãos Solidárias — Manaus, AM</span>
          </div>

          <h1 className="hero-title-anim font-lora font-bold text-[#1a2e25] leading-[1.18] mb-5"
              style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)" }}>
            Cada doação,<br />
            <em className="italic text-[#19c19e]">cada família,</em><br />
            cada entrega.
          </h1>

          <p className="hero-desc-anim font-dm font-light text-[#3d5a4e] leading-[1.75] mb-10 max-w-md text-base">
            Um sistema centralizado que transforma planilhas e mensagens em rastreabilidade real —
            do recebimento da doação até a cesta nas mãos de quem precisa.
          </p>

          <div className="hero-ctas-anim flex flex-wrap gap-4">
            <a href="#solucao" className={BTN_PRIMARY_CLS}
               style={{ background: GRADIENT_PRIMARY, boxShadow: SHADOW_GREEN }}>
              Ver o sistema →
            </a>
            <a href="#sobre" className={BTN_OUTLINE_DARK_CLS}>
              Saiba mais
            </a>
          </div>
        </div>

        {/* Visual com cartões de métricas flutuantes */}
        <div className="hero-visual-anim relative z-10 hidden md:flex justify-end">
          <div className="relative w-[420px] h-[460px]">

            {/* Cartão principal: estoque com barra de progresso animada */}
            <div className="absolute w-[280px] top-0 left-[50px] bg-white rounded-2xl p-5
                            border border-emerald-200/50 shadow-[0_10px_40px_rgba(26,46,37,0.1)]
                            hover:-translate-y-1.5 transition-transform">
              <p className="font-dm text-xs font-semibold tracking-widest uppercase text-[#6b8c7d] mb-1.5">
                Estoque atual
              </p>
              <p className="font-lora text-[1.8rem] font-bold text-[#1a2e25] leading-tight">1.847</p>
              <p className="font-dm text-sm text-[#6b8c7d] mt-1">itens cadastrados</p>
              <div className="mt-3 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div className="progress-fill h-full rounded-full"
                     style={{ background: "linear-gradient(90deg, #19c19e, #69e3a9)" }} />
              </div>
              <p className="font-dm text-xs text-[#6b8c7d] mt-1.5">73% da meta mensal atingida</p>
            </div>

            {/* Cartão secundário: entregas do dia */}
            <HeroFloatCard
              label="Entregas hoje" value="24" sub="kits distribuídos"
              className="w-[200px] bottom-5 right-0 bg-white rotate-3 border border-emerald-100/50 text-[#1a2e25]"
            />

            {/* Cartão de alerta: itens próximos do vencimento */}
            <HeroFloatCard
              label="Alerta" value="12" sub="itens a vencer"
              className="w-[160px] bottom-10 left-0 -rotate-[4deg] text-white"
              style={{ background: GRADIENT_PRIMARY }}
            />
          </div>
        </div>
      </section>

      {/* ── Estatísticas ─────────────────────────────────────────────────────── */}
      <div className="bg-[#1a2e25] px-6 md:px-16 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center px-4">
            <p className="font-lora text-[2.4rem] font-bold text-emerald-300 leading-none">{stat.value}</p>
            <p className="font-dm text-sm text-white/55 mt-2 tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Problema ─────────────────────────────────────────────────────────── */}
      <section id="sobre" className="bg-[#f8f9f5]">
        <div id="problem" data-animate
             className={`${fadeIn("problem")} max-w-6xl mx-auto px-6 md:px-16 py-24
                         grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center`}>
          <div>
            <SectionTag>O Problema</SectionTag>
            <h2 className="font-lora font-bold text-[#1a2e25] leading-[1.25] mb-5"
                style={SECTION_TITLE_STYLE}>
              Controle manual gera<br />injustiça e desperdício
            </h2>
            <p className="font-dm text-base text-[#3d5a4e] leading-[1.75] font-light mb-8">
              A operação da ONG Mãos Solidárias cresceu, mas os processos ainda dependem de
              planilhas e grupos de mensagem. Isso cria divergências de estoque, itens vencendo
              sem rotação e distribuição desigual entre famílias.
            </p>
            <a href="#solucao" className={BTN_PRIMARY_CLS}
               style={{ background: GRADIENT_PRIMARY, boxShadow: SHADOW_GREEN }}>
              Conhecer a solução →
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {PROBLEMS.map((problem) => (
              <ProblemCard key={problem.title} problem={problem} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Solução ──────────────────────────────────────────────────────────── */}
      <section id="solucao" className="relative overflow-hidden py-24 px-6 md:px-16"
               style={{ background: "linear-gradient(160deg, #1a2e25 0%, #2d4a3e 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div id="solution" data-animate className={`${fadeIn("solution")} text-center mb-16`}>
            {/* Tag centralizada: linha decorativa após o texto (invertida em relação às demais) */}
            <div className="inline-flex items-center gap-2 font-dm text-xs font-semibold tracking-[0.1em] uppercase text-[#19c19e] mb-4">
              A Solução
              <span className="w-6 h-0.5 bg-[#19c19e] block" />
            </div>
            <h2 className="font-lora font-bold text-white leading-[1.25] mb-4" style={SECTION_TITLE_STYLE}>
              Sistema integrado do recebimento à entrega
            </h2>
            <p className="font-dm text-base text-white/60 font-light leading-[1.75] max-w-xl mx-auto">
              Um MVP pensado para a realidade da ONG: funciona com internet instável, permite exportação
              para auditorias e centraliza todo o processo de gestão de doações.
            </p>
          </div>

          <div id="features" data-animate
               className={`${fadeIn("features")} grid grid-cols-1 md:grid-cols-3 gap-6`}>
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} delayIndex={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Famílias ─────────────────────────────────────────────────────────── */}
      <section id="familias" className="max-w-6xl mx-auto px-6 md:px-16 py-24">
        <div id="families" data-animate
             className={`${fadeIn("families")} flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12`}>
          <div>
            <SectionTag>Famílias Cadastradas</SectionTag>
            <h2 className="font-lora font-bold text-[#1a2e25] leading-[1.25]" style={SECTION_TITLE_STYLE}>
              Quem aguarda sua ajuda
            </h2>
          </div>
          <a href="#" className={`${BTN_OUTLINE_DARK_CLS} flex-shrink-0`}>
            Ver todas →
          </a>
        </div>

        <div id="families-grid" data-animate
             className={`${fadeIn("families-grid")} grid grid-cols-1 md:grid-cols-3 gap-6`}>
          {FAMILIES.map((family) => (
            <FamilyCardItem key={family.name} family={family} />
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section id="contato" className="relative overflow-hidden py-24 px-6 md:px-16 text-center"
               style={{ background: GRADIENT_PRIMARY }}>
        {/* Círculos decorativos de fundo */}
        <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-white/[0.08]" />
        <div className="absolute bottom-[-80px] left-[-40px] w-[250px] h-[250px] rounded-full bg-white/[0.06]" />

        <div id="cta" data-animate className={`${fadeIn("cta")} relative z-10 max-w-xl mx-auto`}>
          <h2 className="font-lora font-bold text-white mb-5 leading-tight"
              style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}>
            Junte-se à missão solidária
          </h2>
          <p className="font-dm text-base text-white/80 font-light leading-[1.7] mb-10">
            Seja como voluntário, doador ou parceiro — cada contribuição chega diretamente
            a uma família em Manaus que precisa de apoio.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="font-dm font-semibold text-sm bg-white text-[#19c19e] px-8 py-3.5
                               rounded-full cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.12)]
                               transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
              Quero ser voluntário
            </button>
            <button className="font-dm font-semibold text-sm bg-transparent text-white border-2
                               border-white/60 px-8 py-3.5 rounded-full cursor-pointer
                               transition-all hover:border-white hover:bg-white/10 hover:-translate-y-0.5">
              Fazer uma doação
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1a2e25] px-6 md:px-16 py-12
                         flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
        <p className="font-lora font-bold text-base text-white">
          🤲 Mãos <span className="text-emerald-300">Solidárias</span>
        </p>
        <p className="font-dm text-xs text-white/35 text-center leading-relaxed">
          © 2025 ONG Mãos Solidárias · Manaus, Amazonas<br />
          Projeto acadêmico · Todos os direitos reservados
        </p>
        <ul className="flex gap-8 list-none">
          {FOOTER_LINKS.map((link) => (
            <li key={link}>
              <a href="#" className="font-dm text-xs text-white/45 no-underline transition-colors hover:text-emerald-300">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}