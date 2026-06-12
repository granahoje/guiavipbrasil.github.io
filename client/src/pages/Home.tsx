import { useState, useMemo, useEffect } from "react";
import { MapPin, Search, Shield, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { profileExtensions } from "../profileExtensions";

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
}

const getProfileImageUrl = (perfil: Perfil): string => {
  const ext = profileExtensions[perfil.id] || ".jpeg";
  return `/profile-images/profile-${perfil.id}${ext}`;
};

export default function Home() {
  const [perfisFiltrados, setPerfisFiltrados] = useState<Perfil[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | "feminina" | "trans">("todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data: Perfil[]) => {
        setPerfisFiltrados(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfis:", err);
        setCarregando(false);
      });
  }, []);

  const perfisExibidos = useMemo(() => {
    return perfisFiltrados.filter((perfil) => {
      const atendeFiltro =
        filtro === "todos" || perfil.categoria === filtro;
      const atendeBusca =
        busca === "" ||
        perfil.nome.toLowerCase().includes(busca.toLowerCase()) ||
        perfil.cidade.toLowerCase().includes(busca.toLowerCase()) ||
        perfil.descricao.toLowerCase().includes(busca.toLowerCase());
      return atendeFiltro && atendeBusca;
    });
  }, [perfisFiltrados, filtro, busca]);

  const contadores = {
    total: perfisFiltrados.length,
    femininas: perfisFiltrados.filter((p) => p.categoria === "feminina").length,
    trans: perfisFiltrados.filter((p) => p.categoria === "trans").length,
  };

  return (
    <div className="min-h-screen bg-background site-shell">

      {/* ── TOP BAR ── */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3 text-accent" />
            <span>Plataforma verificada e segura</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3 w-3 text-amber-400" />
            <span>Perfis premium selecionados</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <header className="hero-section border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-4 py-10">

          {/* Logo + Título */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-accent" />
              <p className="eyebrow">Curadoria Premium em Todo o Brasil</p>
              <Crown className="h-5 w-5 text-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
              Guia <span className="text-accent">VIP</span> Brasil
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Perfis selecionados com discrição, elegância e profissionalismo em todo o território nacional.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
            <div className="stat-card text-center">
              <strong className="text-accent">{contadores.total}</strong>
              <span>Perfis</span>
            </div>
            <div className="stat-card text-center">
              <strong className="text-amber-400">{contadores.femininas}</strong>
              <span>Femininas</span>
            </div>
            <div className="stat-card text-center">
              <strong className="text-pink-400">{contadores.trans}</strong>
              <span>Trans</span>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="search-box">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar por nome, cidade ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
              />
            </div>
            <div className="flex gap-2">
              {[
                { label: `Todos (${contadores.total})`, value: "todos" },
                { label: `Femininas (${contadores.femininas})`, value: "feminina" },
                { label: `Trans (${contadores.trans})`, value: "trans" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltro(f.value as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    filtro === f.value
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                      : "border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── GRID DE PERFIS ── */}
      <main className="container mx-auto max-w-7xl px-4 py-14">
        {carregando ? (
          <div className="text-center py-20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-accent mb-4"></div>
            <p className="text-muted-foreground text-sm">Carregando perfis...</p>
          </div>
        ) : perfisExibidos.length === 0 ? (
          <div className="empty-state">
            <p className="text-muted-foreground">Nenhum perfil encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {perfisExibidos.map((perfil) => (
              <Link key={perfil.id} href={`/${perfil.url_amigavel}`}>
                <a className="profile-card group cursor-pointer block">
                  {/* Imagem */}
                  <div className="relative h-72 overflow-hidden bg-muted">
                    <img
                      src={getProfileImageUrl(perfil)}
                      alt={`${perfil.nome} em ${perfil.cidade}`}
                      loading="lazy"
                      className="profile-image group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = `/profile-images/profile-${perfil.id}.svg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <span className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm ${
                      perfil.categoria === "feminina"
                        ? "border-amber-400/50 bg-amber-500/30 text-amber-200"
                        : "border-pink-400/60 bg-pink-600/40 text-pink-100 shadow-lg shadow-pink-500/20"
                    }`}>
                      {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                    </span>
                    {/* Cidade no canto superior direito */}
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-white/70 backdrop-blur-sm">
                      <MapPin className="h-2.5 w-2.5" />
                      {perfil.cidade}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h2 className="profile-name mb-1 text-2xl">{perfil.nome}</h2>
                    <p className="profile-city mb-3 flex items-center gap-1.5 text-xs">
                      <MapPin className="h-3 w-3 text-accent" />
                      {perfil.cidade}
                    </p>
                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {perfil.descricao}
                    </p>
                    <Button className="w-full btn-primary text-sm">Ver Perfil</Button>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md mt-10">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold text-foreground">Guia VIP Brasil</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A plataforma de curadoria premium de acompanhantes do Brasil. Perfis verificados, discrição garantida.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Categorias</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><button onClick={() => setFiltro("feminina")} className="hover:text-accent transition-colors">Acompanhantes Femininas</button></li>
                <li><button onClick={() => setFiltro("trans")} className="hover:text-accent transition-colors">Acompanhantes Trans</button></li>
                <li><button onClick={() => setFiltro("todos")} className="hover:text-accent transition-colors">Todos os Perfis</button></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Informações</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-accent" /> Plataforma segura e verificada</li>
                <li className="flex items-center gap-1.5"><Star className="h-3 w-3 text-amber-400" /> Perfis premium selecionados</li>
                <li className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-pink-400" /> Cobertura em todo o Brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Guia VIP Brasil · Todos os direitos reservados · Plataforma para maiores de 18 anos
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
