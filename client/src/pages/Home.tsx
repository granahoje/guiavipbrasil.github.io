import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, Sparkles, MapPin } from "lucide-react";

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
}

const getProfileImageUrl = (perfil: Perfil) => `/profile-images/profile-${perfil.id}.svg`;

export default function Home() {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "feminina" | "trans">("todos");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data) => {
        setPerfis(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfis:", err);
        setCarregando(false);
      });
  }, []);

  const perfisFiltrados = perfis.filter((perfil) => {
    const filtroCategoria = filtro === "todos" || perfil.categoria === filtro;
    const termo = busca.trim().toLowerCase();
    const filtroBusca =
      termo.length === 0 ||
      perfil.nome.toLowerCase().includes(termo) ||
      perfil.cidade.toLowerCase().includes(termo) ||
      perfil.descricao.toLowerCase().includes(termo);

    return filtroCategoria && filtroBusca;
  });

  const totalFemininas = perfis.filter((p) => p.categoria === "feminina").length;
  const totalTrans = perfis.filter((p) => p.categoria === "trans").length;

  return (
    <div className="site-shell min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Curadoria premium em todo o Brasil</p>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Guia VIP Brasil
              </h1>
            </div>
            <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground md:flex">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Perfis organizados por cidade e categoria
            </div>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="container py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow mb-4">Portal de acompanhantes de luxo</p>
              <h2 className="max-w-4xl text-4xl font-bold leading-tight text-foreground md:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Encontre perfis VIP com uma experiência mais bonita, rápida e confiável.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Navegue por perfis selecionados, filtre por categoria, pesquise por cidade e converse pelo assistente virtual de cada perfil.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="stat-card"><strong>{perfis.length}</strong><span>perfis</span></div>
                <div className="stat-card"><strong>{totalFemininas}</strong><span>femininas</span></div>
                <div className="stat-card"><strong>{totalTrans}</strong><span>trans</span></div>
              </div>
            </div>
            <div className="hero-card">
              <Sparkles className="h-9 w-9 text-accent" />
              <h3>Experiência atualizada</h3>
              <p>Imagens locais, rotas corrigidas para GitHub Pages e visual premium com cards responsivos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/35">
        <div className="container py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="search-box">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome, cidade ou descrição..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-semibold text-muted-foreground">Filtrar:</span>
              <Button variant={filtro === "todos" ? "default" : "outline"} onClick={() => setFiltro("todos")} className="rounded-full">
                Todos ({perfis.length})
              </Button>
              <Button variant={filtro === "feminina" ? "default" : "outline"} onClick={() => setFiltro("feminina")} className="rounded-full">
                Femininas ({totalFemininas})
              </Button>
              <Button variant={filtro === "trans" ? "default" : "outline"} onClick={() => setFiltro("trans")} className="rounded-full">
                Trans ({totalTrans})
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        {carregando ? (
          <div className="empty-state"><p>Carregando perfis...</p></div>
        ) : perfisFiltrados.length === 0 ? (
          <div className="empty-state"><p>Nenhum perfil encontrado para sua busca.</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {perfisFiltrados.map((perfil) => (
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
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
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
      </section>
    </div>
  );
}
