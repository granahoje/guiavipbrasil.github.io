import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "feminina" | "trans">("todos");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Carregar perfis do JSON
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

  const perfisFiltrados =
    filtro === "todos"
      ? perfis
      : perfis.filter((p) => p.categoria === filtro);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                Guia VIP Brasil
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Portal de acompanhantes de luxo
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <section className="bg-card border-b border-border">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-semibold">Filtrar:</span>
            <div className="flex gap-2">
              <Button
                variant={filtro === "todos" ? "default" : "outline"}
                onClick={() => setFiltro("todos")}
                className="rounded-full"
              >
                Todos ({perfis.length})
              </Button>
              <Button
                variant={filtro === "feminina" ? "default" : "outline"}
                onClick={() => setFiltro("feminina")}
                className="rounded-full"
              >
                Femininas ({perfis.filter((p) => p.categoria === "feminina").length})
              </Button>
              <Button
                variant={filtro === "trans" ? "default" : "outline"}
                onClick={() => setFiltro("trans")}
                className="rounded-full"
              >
                Trans ({perfis.filter((p) => p.categoria === "trans").length})
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Perfis */}
      <section className="container py-12">
        {carregando ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando perfis...</p>
          </div>
        ) : perfisFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum perfil encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perfisFiltrados.map((perfil) => (
              <Link key={perfil.id} href={`/${perfil.url_amigavel}`}>
                <a className="profile-card group cursor-pointer">
                  {/* Imagem do Perfil */}
                  <div className="relative overflow-hidden bg-muted h-64">
                    <img
                      src={`/manus-storage/${perfil.foto_original}`}
                      alt={perfil.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay com gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="profile-category">
                        {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                      </span>
                    </div>
                    <h2 className="profile-name mb-1">{perfil.nome}</h2>
                    <p className="profile-city mb-3">{perfil.cidade}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {perfil.descricao}
                    </p>
                    <Button className="w-full btn-primary">
                      Ver Perfil
                    </Button>
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
