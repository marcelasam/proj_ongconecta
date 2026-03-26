"use client";

import { useState, useEffect, useRef } from "react";

const stats = [
  { value: "1.200+", label: "Famílias atendidas" },
  { value: "48.000", label: "Itens doados" },
  { value: "320", label: "Voluntários ativos" },
  { value: "R$2M+", label: "Recursos mobilizados" },
];

const categories = [
  { icon: "🥫", name: "Alimentos", desc: "Cestas básicas completas" },
  { icon: "🧴", name: "Higiene", desc: "Kits de cuidado pessoal" },
  { icon: "👕", name: "Vestuário", desc: "Roupas e calçados" },
  { icon: "📦", name: "Doações", desc: "Recebemos lotes e individuais" },
  { icon: "🤝", name: "Voluntariado", desc: "Venha fazer parte" },
  { icon: "📊", name: "Transparência", desc: "Prestação de contas clara" },
];

const featuredNeeds = [
  {
    name: "Família Silva",
    cidade: "Manaus, AM",
    descricao: "3 crianças em idade escolar, mãe solo.",
    prioridade: "Alta",
    cor: "#ff6b6b",
  },
  {
    name: "Família Oliveira",
    cidade: "Manaus, AM",
    descricao: "Idosa e neto dependente, sem renda fixa.",
    prioridade: "Alta",
    cor: "#ffa94d",
  },
  {
    name: "Família Santos",
    cidade: "Manaus, AM",
    descricao: "Recém-chegados, precisam de kit básico.",
    prioridade: "Média",
    cor: "#69e3a9",
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", background: "#f8f9f5", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --green-primary: #19c19e;
          --green-light: #69e3a9;
          --green-pale: #9df7b5;
          --cream: #f8f9f5;
          --dark: #1a2e25;
          --mid: #2d4a3e;
          --text-body: #3d5a4e;
          --text-muted: #6b8c7d;
          --accent-warm: #f0a500;
        }

        html { scroll-behavior: smooth; }

        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }

        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 4rem;
          background: rgba(248, 249, 245, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(105, 227, 169, 0.2);
          transition: all 0.3s ease;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--green-light), var(--green-primary));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          box-shadow: 0 4px 14px rgba(25, 193, 158, 0.35);
        }

        .nav-logo-text {
          font-family: 'Lora', serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--dark);
          line-height: 1.1;
        }

        .nav-logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }

        .nav-links a {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-body);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }

        .nav-links a:hover { color: var(--green-primary); }

        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          background: linear-gradient(135deg, var(--green-primary), var(--green-light));
          color: white;
          border: none;
          padding: 0.7rem 1.6rem;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(25, 193, 158, 0.4);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.01em;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(25, 193, 158, 0.5);
        }

        .btn-outline {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          background: transparent;
          color: var(--dark);
          border: 2px solid var(--dark);
          padding: 0.7rem 1.6rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.01em;
        }

        .btn-outline:hover {
          background: var(--dark);
          color: white;
          transform: translateY(-2px);
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 7rem 4rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .blob-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(105, 227, 169, 0.25), transparent 70%);
          top: -100px; right: -100px;
          animation: floatBlob 8s ease-in-out infinite;
        }

        .blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(157, 247, 181, 0.2), transparent 70%);
          bottom: -50px; left: 200px;
          animation: floatBlob 10s ease-in-out infinite reverse;
        }

        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.05); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 580px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(105, 227, 169, 0.15);
          border: 1px solid rgba(105, 227, 169, 0.4);
          color: var(--mid);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          margin-bottom: 1.8rem;
          animation: fadeInDown 0.6s ease both;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-title {
          font-family: 'Lora', serif;
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          font-weight: 700;
          color: var(--dark);
          line-height: 1.18;
          margin-bottom: 1.4rem;
          animation: fadeInUp 0.7s ease 0.1s both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-title em {
          font-style: italic;
          color: var(--green-primary);
        }

        .hero-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 300;
          color: var(--text-body);
          line-height: 1.75;
          margin-bottom: 2.5rem;
          max-width: 460px;
          animation: fadeInUp 0.7s ease 0.2s both;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fadeInUp 0.7s ease 0.3s both;
        }

        .hero-visual {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: flex-end;
          animation: fadeInUp 0.9s ease 0.2s both;
        }

        .hero-card-cluster {
          position: relative;
          width: 420px;
          height: 460px;
        }

        .hero-card {
          position: absolute;
          background: white;
          border-radius: 20px;
          padding: 1.4rem;
          box-shadow: 0 10px 40px rgba(26, 46, 37, 0.1);
          transition: transform 0.4s ease;
        }

        .hero-card:hover { transform: translateY(-6px) !important; }

        .card-main {
          width: 280px;
          top: 0; left: 50px;
          border: 1px solid rgba(105, 227, 169, 0.3);
        }

        .card-secondary {
          width: 200px;
          bottom: 20px; right: 0;
          transform: rotate(3deg);
          border: 1px solid rgba(157, 247, 181, 0.3);
        }

        .card-accent {
          width: 160px;
          bottom: 40px; left: 0;
          transform: rotate(-4deg);
          background: linear-gradient(135deg, var(--green-primary), var(--green-light));
          color: white;
        }

        .card-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.6rem;
        }

        .card-accent .card-label { color: rgba(255,255,255,0.7); }

        .card-value {
          font-family: 'Lora', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--dark);
          line-height: 1.1;
        }

        .card-accent .card-value { color: white; }

        .card-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.3rem;
        }

        .card-accent .card-sub { color: rgba(255,255,255,0.8); }

        .card-progress-bar {
          margin-top: 1rem;
          height: 6px;
          background: rgba(105, 227, 169, 0.2);
          border-radius: 10px;
          overflow: hidden;
        }

        .card-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--green-primary), var(--green-light));
          border-radius: 10px;
          width: 73%;
          animation: growBar 1.5s ease 1s both;
        }

        @keyframes growBar {
          from { width: 0; }
          to { width: 73%; }
        }

        /* STATS */
        .stats-section {
          background: var(--dark);
          padding: 3.5rem 4rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
        }

        .stat-value {
          font-family: 'Lora', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--green-light);
          line-height: 1;
        }

        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          margin-top: 0.5rem;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.1);
          align-self: stretch;
          display: none;
        }

        /* PROBLEM */
        .problem-section {
          padding: 6rem 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--green-primary);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-tag::before {
          content: '';
          display: block;
          width: 24px;
          height: 2px;
          background: var(--green-primary);
        }

        .section-title {
          font-family: 'Lora', serif;
          font-size: clamp(1.8rem, 2.5vw, 2.6rem);
          font-weight: 700;
          color: var(--dark);
          line-height: 1.25;
          margin-bottom: 1.4rem;
        }

        .section-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          color: var(--text-body);
          line-height: 1.75;
          font-weight: 300;
        }

        .problem-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .problem-card {
          background: white;
          border-radius: 16px;
          padding: 1.3rem 1.5rem;
          border-left: 4px solid var(--green-light);
          box-shadow: 0 4px 16px rgba(26, 46, 37, 0.06);
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .problem-card:hover {
          box-shadow: 0 8px 28px rgba(26, 46, 37, 0.12);
          transform: translateX(4px);
        }

        .problem-card.critical { border-left-color: #ff6b6b; }
        .problem-card.warning { border-left-color: #ffa94d; }
        .problem-card.info { border-left-color: var(--green-primary); }

        .problem-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .problem-card-title {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--dark);
          margin-bottom: 0.25rem;
        }

        .problem-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* SOLUTION */
        .solution-section {
          background: linear-gradient(160deg, var(--dark) 0%, var(--mid) 100%);
          padding: 6rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .solution-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .solution-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .solution-header .section-tag {
          justify-content: center;
        }

        .solution-header .section-tag::before { display: none; }
        .solution-header .section-tag::after {
          content: '';
          display: block;
          width: 24px;
          height: 2px;
          background: var(--green-primary);
        }

        .solution-header .section-title {
          color: white;
        }

        .solution-header .section-body {
          color: rgba(255,255,255,0.6);
          max-width: 560px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .feature-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(105, 227, 169, 0.15);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--green-primary), var(--green-light));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-6px);
          border-color: rgba(105, 227, 169, 0.35);
        }

        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: rgba(105, 227, 169, 0.12);
          border: 1px solid rgba(105, 227, 169, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 1.2rem;
        }

        .feature-title {
          font-family: 'Lora', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.6rem;
        }

        .feature-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.65;
          font-weight: 300;
        }

        /* FAMILIES SECTION */
        .families-section {
          padding: 6rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .families-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        .families-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .family-card {
          background: white;
          border-radius: 20px;
          padding: 1.8rem;
          box-shadow: 0 6px 24px rgba(26, 46, 37, 0.07);
          border: 1px solid rgba(26, 46, 37, 0.06);
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .family-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          transition: opacity 0.3s;
          opacity: 0;
        }

        .family-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(26, 46, 37, 0.13);
        }

        .family-card:hover::after { opacity: 1; }

        .priority-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          border-radius: 50px;
          margin-bottom: 1.2rem;
        }

        .priority-high {
          background: rgba(255, 107, 107, 0.1);
          color: #e05252;
        }

        .priority-medium {
          background: rgba(105, 227, 169, 0.15);
          color: var(--mid);
        }

        .family-name {
          font-family: 'Lora', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 0.3rem;
        }

        .family-city {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.9rem;
        }

        .family-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: var(--text-body);
          line-height: 1.6;
          border-top: 1px solid rgba(26, 46, 37, 0.07);
          padding-top: 0.9rem;
        }

        /* CTA SECTION */
        .cta-section {
          background: linear-gradient(135deg, var(--green-primary) 0%, var(--green-light) 100%);
          padding: 6rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        .cta-section::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -40px;
          width: 250px; height: 250px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        .cta-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }

        .cta-title {
          font-family: 'Lora', serif;
          font-size: clamp(2rem, 3vw, 3rem);
          font-weight: 700;
          color: white;
          margin-bottom: 1.2rem;
        }

        .cta-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          color: rgba(255,255,255,0.8);
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        .btn-white {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          background: white;
          color: var(--green-primary);
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }

        .btn-white:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
        }

        .btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.6);
          padding: 0.85rem 2rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-ghost:hover {
          border-color: white;
          background: rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }

        /* FOOTER */
        footer {
          background: var(--dark);
          padding: 3rem 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .footer-brand {
          font-family: 'Lora', serif;
          font-weight: 700;
          font-size: 1rem;
          color: white;
        }

        .footer-brand span {
          color: var(--green-light);
        }

        .footer-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          text-align: center;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .footer-links a {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover { color: var(--green-light); }

        @media (max-width: 900px) {
          nav { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          .hero { grid-template-columns: 1fr; padding: 6rem 1.5rem 3rem; }
          .hero-visual { display: none; }
          .stats-section { grid-template-columns: repeat(2, 1fr); padding: 2.5rem 1.5rem; }
          .problem-section { grid-template-columns: 1fr; padding: 4rem 1.5rem; gap: 3rem; }
          .solution-section { padding: 4rem 1.5rem; }
          .features-grid { grid-template-columns: 1fr; }
          .families-section { padding: 4rem 1.5rem; }
          .families-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .families-grid { grid-template-columns: 1fr; }
          .cta-section { padding: 4rem 1.5rem; }
          footer { padding: 2rem 1.5rem; flex-direction: column; text-align: center; }
          .footer-links { justify-content: center; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo" style={{ textDecoration: "none" }}>
          <div className="nav-logo-icon">🤲</div>
          <div>
            <div className="nav-logo-text">Mãos Solidárias</div>
            <div className="nav-logo-sub">Gestão de doações</div>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#solucao">Solução</a></li>
          <li><a href="#familias">Famílias</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <a href="#solucao" className="btn-primary" style={{ textDecoration: "none" }}>
          Acessar sistema
        </a>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef} id="hero">
        <div className="hero-bg-blob blob-1" />
        <div className="hero-bg-blob blob-2" />
        <div className="hero-content">
          <div className="hero-badge">
            <span>🌱</span>
            <span>ONG Mãos Solidárias — Manaus, AM</span>
          </div>
          <h1 className="hero-title">
            Cada doação,<br />
            <em>cada família,</em><br />
            cada entrega.
          </h1>
          <p className="hero-desc">
            Um sistema centralizado que transforma planilhas e mensagens em rastreabilidade real —
            do recebimento da doação até a cesta nas mãos de quem precisa.
          </p>
          <div className="hero-ctas">
            <a href="#solucao" className="btn-primary">Ver o sistema →</a>
            <a href="#sobre" className="btn-outline">Saiba mais</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-cluster">
            <div className="hero-card card-main">
              <div className="card-label">Estoque atual</div>
              <div className="card-value">1.847</div>
              <div className="card-sub">itens cadastrados</div>
              <div className="card-progress-bar">
                <div className="card-progress-fill" />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                73% da meta mensal atingida
              </div>
            </div>
            <div className="hero-card card-secondary">
              <div className="card-label">Entregas hoje</div>
              <div className="card-value">24</div>
              <div className="card-sub">kits distribuídos</div>
            </div>
            <div className="hero-card card-accent">
              <div className="card-label">Alerta</div>
              <div className="card-value">12</div>
              <div className="card-sub">itens a vencer</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* PROBLEM */}
      <section id="sobre" style={{ background: "#f8f9f5" }}>
        <div
          className={`problem-section fade-up ${isVisible("problem") ? "visible" : ""}`}
          id="problem"
          data-animate
        >
          <div>
            <div className="section-tag">O Problema</div>
            <h2 className="section-title">
              Controle manual gera<br />
              injustiça e desperdício
            </h2>
            <p className="section-body">
              A operação da ONG Mãos Solidárias cresceu, mas os processos ainda dependem de
              planilhas e grupos de mensagem. Isso cria divergências de estoque, itens vencendo
              sem rotação e distribuição desigual entre famílias.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <a href="#solucao" className="btn-primary">
                Conhecer a solução →
              </a>
            </div>
          </div>
          <div className="problem-cards">
            {[
              {
                icon: "⚠️",
                title: "Estoque divergente",
                desc: "O papel não bate com o físico. Entradas e saídas manuais geram erros frequentes.",
                type: "critical",
              },
              {
                icon: "⏰",
                title: "Validade ignorada",
                desc: "Sem rotação FIFO, alimentos e kits de higiene vencem antes de serem distribuídos.",
                type: "warning",
              },
              {
                icon: "👥",
                title: "Distribuição desigual",
                desc: "Sem histórico, algumas famílias recebem mais de uma vez enquanto outras ficam sem.",
                type: "critical",
              },
              {
                icon: "📋",
                title: "Prestação de contas manual",
                desc: "Relatórios para parceiros exigem horas de trabalho extra e ainda ficam incompletos.",
                type: "info",
              },
            ].map((p, i) => (
              <div key={i} className={`problem-card ${p.type}`}>
                <div className="problem-icon">{p.icon}</div>
                <div>
                  <div className="problem-card-title">{p.title}</div>
                  <div className="problem-card-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solucao" className="solution-section">
        <div className="solution-inner">
          <div
            className={`solution-header fade-up ${isVisible("solution") ? "visible" : ""}`}
            id="solution"
            data-animate
          >
            <div className="section-tag">A Solução</div>
            <h2 className="section-title">Sistema integrado do recebimento à entrega</h2>
            <p className="section-body">
              Um MVP pensado para a realidade da ONG: funciona com internet instável, permite exportação
              para auditorias e centraliza todo o processo de gestão de doações.
            </p>
          </div>
          <div
            className={`features-grid fade-up ${isVisible("features") ? "visible" : ""}`}
            id="features"
            data-animate
          >
            {[
              { icon: "📥", title: "Registro de Doações", desc: "Cadastre lotes de empresas e doações individuais com rastreabilidade completa de origem e data." },
              { icon: "📦", title: "Controle de Estoque", desc: "Gestão por lotes com data de validade, alertas automáticos e rotação FIFO para alimentos." },
              { icon: "🎁", title: "Montagem de Kits", desc: "Monte cestas e kits com fluxo de aprovação, garantindo padronização e controle de saídas." },
              { icon: "🚚", title: "Registro de Entregas", desc: "Histórico completo por família com critérios de priorização e rastreabilidade de cada kit entregue." },
              { icon: "📊", title: "Dashboards Simples", desc: "Visão geral do estoque, entregas e famílias atendidas. Exportação para relatórios de parceiros." },
              { icon: "🔒", title: "Funciona Offline", desc: "Projetado para internet instável. Sincroniza dados quando a conexão é restabelecida." },
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card fade-up visible"
                style={{ transitionDelay: `${0.1 * (i % 3)}s` }}
              >
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILIES */}
      <section id="familias" className="families-section">
        <div
          className={`families-header fade-up ${isVisible("families") ? "visible" : ""}`}
          id="families"
          data-animate
        >
          <div>
            <div className="section-tag">Famílias Cadastradas</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Quem aguarda sua ajuda
            </h2>
          </div>
          <a href="#" className="btn-outline" style={{ flexShrink: 0 }}>
            Ver todas →
          </a>
        </div>
        <div
          className={`families-grid fade-up ${isVisible("families-grid") ? "visible" : ""}`}
          id="families-grid"
          data-animate
        >
          {featuredNeeds.map((f, i) => (
            <div key={i} className="family-card" style={{ ["--accent-color" as string]: f.cor }}>
              <div
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  height: "3px",
                  background: f.cor,
                  borderRadius: "0 0 20px 20px",
                }}
              />
              <span className={`priority-badge ${f.prioridade === "Alta" ? "priority-high" : "priority-medium"}`}>
                {f.prioridade === "Alta" ? "🔴" : "🟢"} Prioridade {f.prioridade}
              </span>
              <div className="family-name">{f.name}</div>
              <div className="family-city">📍 {f.cidade}</div>
              <div className="family-desc">{f.descricao}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="cta-section">
        <div className={`cta-inner fade-up ${isVisible("cta") ? "visible" : ""}`} id="cta" data-animate>
          <h2 className="cta-title">Junte-se à missão solidária</h2>
          <p className="cta-desc">
            Seja como voluntário, doador ou parceiro — cada contribuição chega diretamente
            a uma família em Manaus que precisa de apoio.
          </p>
          <div className="cta-buttons">
            <button className="btn-white">Quero ser voluntário</button>
            <button className="btn-ghost">Fazer uma doação</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          🤲 Mãos <span>Solidárias</span>
        </div>
        <div className="footer-text">
          © 2025 ONG Mãos Solidárias · Manaus, Amazonas<br />
          Projeto acadêmico · Todos os direitos reservados
        </div>
        <ul className="footer-links">
          <li><a href="#">Privacidade</a></li>
          <li><a href="#">Termos</a></li>
          <li><a href="#">Contato</a></li>
        </ul>
      </footer>
    </div>
  );
}