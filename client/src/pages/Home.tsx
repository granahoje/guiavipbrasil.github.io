import { useState, useMemo, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
}

export default function Home() {
  const [perfisFiltrados, setPerfisFiltrados] = useState<Perfil[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | "feminina" | "trans">("todos");
  const [busca, setBusca] = useState("");

  // Carregar perfis
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

  // Filtrar perfis
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

  const getProfileImageUrl = (perfil: Perfil): string => {
    const baseUrl = "/profile-images/";
    return baseUrl + perfil.foto_original;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-2">
              Curadoria Premium em Todo o Brasil
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Guia VIP Brasil</h1>
            <p className="text-muted-foreground">Perfis organizados por cidade e categoria</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{contadores.total}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Perfis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{contadores.femininas}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Femininas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">{contadores.trans}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Trans</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, cidade ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground self-center">Filtrar:</span>
            {[
              { label: `Todos (${contadores.total})`, value: "todos" },
              { label: `Femininas (${contadores.femininas})`, value: "feminina" },
              { label: `Trans (${contadores.trans})`, value: "trans" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtro === f.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-12">
        {carregando ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-accent"></div>
            <p className="mt-4 text-muted-foreground">Carregando perfis...</p>
          </div>
        ) : perfisExibidos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum perfil encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            {perfisExibidos.map((perfil) => (
              <Link key={perfil.id} href={`/${perfil.url_amigavel}`}>
                <a className="profile-card group cursor-pointer">
                  <div className="relative h-72 overflow-hidden bg-muted">
                    <img
                      src={getProfileImageUrl(perfil)}
                      alt={`${perfil.nome} em ${perfil.cidade}`}
                      loading="lazy"
                      className="profile-image group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                    <span className={`absolute left-4 top-4 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur ${
                      perfil.categoria === "feminina"
                        ? "border-amber-400/50 bg-amber-500/40 text-amber-100"
                        : "border-pink-400/60 bg-pink-600/50 text-pink-100 shadow-lg shadow-pink-500/30"
                    }`}>
                      {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="profile-name mb-2">{perfil.nome}</h2>
                    <p className="profile-city mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" />{perfil.cidade}</p>
                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-muted-foreground">{perfil.descricao}</p>
                    <Button className="w-full btn-primary">Ver Perfil</Button>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
