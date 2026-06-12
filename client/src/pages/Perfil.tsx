import { useParams, useLocation } from "wouter";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, X, Send, MapPin, ShieldCheck, Clock, Mail, Send as SendIcon, Heart, Star, Copy, Check } from "lucide-react";
import { MetaTags } from "@/components/MetaTags";
import { profileExtensions } from "../profileExtensions";
import { useState, useEffect, useRef } from "react";

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
  valores?: { "30min": number; "1hora": number; "2horas": number };
  pix_chave?: string;
  telegram?: string;
  email?: string;
}

type Mensagem = { tipo: "usuario" | "assistente"; texto: string };

const PIX_GLOBAL = "58e64b53-1ab7-443b-9495-46a5bf13057d";

const getProfileImageUrl = (perfil: Perfil) => {
  const ext = profileExtensions[perfil.id] || ".svg";
  return `/profile-images/profile-${perfil.id}${ext}`;
};

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const sugestoes = [
  "Quer me chupar?",
  "Quanto custa?",
  "Tá disponível?",
  "Como funciona?",
];

function gerarResposta(perfil: Perfil, mensagem: string, valor?: number) {
  const texto = normalizar(mensagem);

  if (/\b(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|e aí|opa|e aew|oie|opa)\b/.test(texto)) {
    return `Oi, tudo bem? Sou ${perfil.nome}! 🔥 Vem conversar comigo, adoro conhecer gente interessante...`;
  }

  if (texto.includes("chupar") || texto.includes("boca") || texto.includes("lingua")) {
    return `Mmm, adoro chupar e gozar na boca! 💦 Quer me provar? Manda o PIX e a gente marca! 😈`;
  }

  if (texto.includes("cuzinho") || texto.includes("cu") || texto.includes("rabo")) {
    return `Ai, come meu cuzinho! 🍑 Que delicia... Quer experimentar? Manda o PIX de ${valor || 150} e vem me ver! 🔥`;
  }

  if (texto.includes("goza") || texto.includes("leite") || texto.includes("porra")) {
    return `Goza na minha boca, na minha bunda, onde você quiser! 💦 Vem logo, manda o PIX! 😈`;
  }

  if (texto.includes("valor") || texto.includes("preco") || texto.includes("quanto") || texto.includes("tabela")) {
    return `Os valores estão ali: 30min por R$${valor || 150}, 1h por R$${(valor || 150) + 130}, 2h por R$${(valor || 150) + 360}. Manda o PIX e vem me buscar! 🔥`;
  }

  if (texto.includes("disponivel") || texto.includes("hoje") || texto.includes("agora") || texto.includes("horario")) {
    return `Depende do dia, mas se você quiser, a gente marca! Manda a data, horário e o PIX que a gente combina tudo... 😉`;
  }

  if (texto.includes("pix") || texto.includes("pagamento") || texto.includes("transferencia")) {
    return `PIX: ${PIX_GLOBAL} - Manda o valor que você quer e vem me ver! Quanto mais você gasta, mais diversão! 💰🔥`;
  }

  if (texto.includes("cidade") || texto.includes("local") || texto.includes("onde")) {
    return `Estou em ${perfil.cidade}, pertinho de você! Quer vir me visitar? 🔥`;
  }

  if (texto.includes("atendimento") || texto.includes("servico") || texto.includes("faz o que")) {
    return `Ah, eu faço de tudo! Adoro dar o cuzinho, gozar na sua boca, sentar na sua cara... Qualquer coisa que você quiser, eu topo! 🍆💦`;
  }

  if (texto.includes("contato") || texto.includes("telegram") || texto.includes("falar")) {
    return `Aqui a gente já tá conversando! Mas se quiser me chamar de outro jeito, manda um PIX e a gente combina tudo direitinho... 😏`;
  }

  if (texto.includes("discreto") || texto.includes("sigilo") || texto.includes("privacidade")) {
    return `Claro! Tudo que acontecer entre a gente fica entre a gente. Sigilo total, sem preocupação! 🤐`;
  }

  if (texto.includes("perfil") || texto.includes("sobre") || texto.includes("quem")) {
    return `Sou ${perfil.nome}, uma gata de ${perfil.cidade} que adora sexo. Meu lema é: quanto mais safado, melhor! Vem comigo que você não vai se arrepender... 😘`;
  }

  if (texto.includes("seguro") || texto.includes("confiavel") || texto.includes("real")) {
    return `Pode confiar! Sou real, minhas fotos são todas recentes. Já atendi muita gente e todos voltam querendo mais! 🔥`;
  }

  if (texto.includes("obrigado") || texto.includes("valeu")) {
    return `De nada, babe! Qualquer dúvida, é só chamar. Estou aqui pra te deixar louco de tesão! 😈`;
  }

  if (texto.includes("fotos") || texto.includes("foto") || texto.includes("imagem")) {
    return `As fotos são todas minhas mesmo, recentes e gostosas! Quer mais? Vem me ver pessoalmente que é muito melhor... 📸🔥`;
  }

  if (texto.includes("primeira vez")) {
    return `Primeira vez? Sem problema! Eu vou te ensinar tudo que você precisa saber... e muito mais! 😉💦`;
  }

  if (texto.includes("casal")) {
    return `Amo casais! A gente faz uma putaria gostosa mesmo. Me chama que a gente combina tudo! 🔥`;
  }

  if (texto.includes("hotel") || texto.includes("motel") || texto.includes("lugar")) {
    return `Posso ir no seu lugar ou você vem aqui. Tanto faz, desde que a gente fique sozinho pra fazer putaria! 😈`;
  }

  return `Interessante... me conta mais sobre isso? 😏 Ou quer marcar logo um horário pra gente se divertir? Manda o PIX! 🔥`;
}

export default function Perfil() {
  const { url_amigavel } = useParams();
  const [, setLocation] = useLocation();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [chatAberto, setChatAberto] = useState(true); // Chat aberto por padrão
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [pixCopiado, setPixCopiado] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });
  const [pixCopiadoGlobal, setPixCopiadoGlobal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const urlCompleta = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data: Perfil[]) => {
        const p = data.find((item) => item.url_amigavel === url_amigavel);
        if (p) {
          setPerfil(p);
          setMensagens([{ tipo: "assistente", texto: `Oi! Sou ${p.nome}. Vem conversar comigo, adoro conhecer gente interessante... 😈` }]);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        setCarregando(false);
      });
  }, [url_amigavel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = (textoOverride?: string) => {
    const texto = textoOverride || inputMensagem;
    if (!texto.trim()) return;

    const novasMensagens: Mensagem[] = [...mensagens, { tipo: "usuario", texto }];
    setMensagens(novasMensagens);
    setInputMensagem("");

    setTimeout(() => {
      if (perfil) {
        const valor = perfil.valores?.["30min"] || 150;
        setMensagens([...novasMensagens, { tipo: "assistente", texto: gerarResposta(perfil, texto, valor) }]);
      }
    }, 1000);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(PIX_GLOBAL);
    setPixCopiadoGlobal(true);
    setTimeout(() => setPixCopiadoGlobal(false), 3000);
  };

  const copiarPixPerfil = () => {
    if (perfil?.pix_chave) {
      navigator.clipboard.writeText(perfil.pix_chave);
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 3000);
    }
  };

  const enviarFormulario = () => {
    if (!formData.nome || !formData.email || !formData.mensagem) {
      alert("Preencha todos os campos");
      return;
    }
    alert(`Mensagem enviada para ${perfil?.nome}! Você receberá uma resposta em breve.`);
    setFormAberto(false);
    setFormData({ nome: "", email: "", mensagem: "" });
  };

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background site-shell">
        <p className="animate-pulse text-xl font-bold uppercase tracking-widest text-accent">Carregando...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center site-shell">
        <h1 className="mb-4 text-4xl font-bold">Perfil não encontrado</h1>
        <p className="mb-8 text-muted-foreground">O perfil que você está procurando não existe ou foi removido.</p>
        <Button onClick={() => setLocation("/")} className="btn-primary px-8">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <>
      <MetaTags title={`${perfil.nome} - Guia VIP Brasil`} description={perfil.descricao} image={getProfileImageUrl(perfil)} />
      <div className="site-shell min-h-screen">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/40 backdrop-blur sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-semibold">Voltar</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Perfil Verificado</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            
            {/* Coluna Esquerda - Foto e Chat */}
            <div className="flex flex-col gap-6">
              {/* Foto Principal */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 aspect-[3/4]">
                <img
                  src={getProfileImageUrl(perfil)}
                  alt={`${perfil.nome} em ${perfil.cidade}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = `/profile-images/profile-${perfil.id}.svg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 backdrop-blur">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                  </span>
                </div>
              </div>

              {/* Chat Box - Reposicionado para cima */}
              {chatAberto && (
                <div className="chat-container w-full max-h-96 rounded-3xl overflow-hidden flex flex-col bg-black/80 border border-white/10">
                  <div className="chat-header flex items-center justify-between p-4 bg-gradient-to-r from-accent/20 to-accent/10 border-b border-white/10">
                    <h3 className="font-bold text-foreground">{perfil.nome}</h3>
                    <button onClick={() => setChatAberto(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
                    {mensagens.map((msg, idx) => (
                      <div key={idx} className={`chat-message ${msg.tipo === "usuario" ? "usuario" : "assistente"}`}>
                        {msg.texto}
                      </div>
                    ))}
                  </div>

                  <div className="chat-input-area p-4 bg-black/40 border-t border-white/10">
                    <div className="flex gap-2 mb-3">
                      {sugestoes.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => enviarMensagem(sug)}
                          className="text-xs bg-accent/20 hover:bg-accent/40 text-accent px-2 py-1 rounded-full transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMensagem}
                        onChange={(e) => setInputMensagem(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                        placeholder="Escreva algo sexy..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-accent"
                      />
                      <button 
                        onClick={() => enviarMensagem()}
                        className="bg-accent text-accent-foreground rounded-full p-2 hover:opacity-90 transition-opacity"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!chatAberto && (
                <Button 
                  onClick={() => setChatAberto(true)}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Abrir Chat
                </Button>
              )}
            </div>

            {/* Coluna Direita - Informações e CTA */}
            <div className="flex flex-col gap-6">
              
              {/* Header do Perfil */}
              <div>
                <p className="eyebrow mb-2">Perfil Premium</p>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-5xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {perfil.nome}
                  </h1>
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-3 py-1 text-xs font-bold text-black uppercase tracking-wider">
                    <span>✓</span>
                    <span>Verificado</span>
                  </div>
                </div>
                <div className="accent-line" />
              </div>

              {/* Descrição */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-3">Sobre</p>
                <p className="leading-7 text-foreground/90 text-lg">{perfil.descricao}</p>
              </div>

              {/* Info Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="info-card">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span>Localização</span>
                  <strong>{perfil.cidade}</strong>
                </div>
                <div className="info-card">
                  <Heart className="h-5 w-5 text-accent" />
                  <span>Categoria</span>
                  <strong>{perfil.categoria === "feminina" ? "Feminina" : "Trans"}</strong>
                </div>
              </div>

              {/* Tabela de Valores */}
              {perfil.valores && (
                <div className="rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 p-6 shadow-lg shadow-accent/20">
                  <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-accent">💎 Tabela de Valores</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border-2 border-accent/30 bg-accent/15 p-5 text-center hover:scale-105 transition-transform hover:border-accent/60">
                      <p className="text-xs font-bold text-accent uppercase tracking-wider">30 Minutos</p>
                      <p className="mt-3 text-3xl font-black text-foreground">R$ {perfil.valores["30min"]}</p>
                    </div>
                    <div className="rounded-2xl border-2 border-accent/30 bg-accent/15 p-5 text-center hover:scale-105 transition-transform hover:border-accent/60">
                      <p className="text-xs font-bold text-accent uppercase tracking-wider">1 Hora</p>
                      <p className="mt-3 text-3xl font-black text-foreground">R$ {perfil.valores["1hora"]}</p>
                    </div>
                    <div className="rounded-2xl border-2 border-accent/30 bg-accent/15 p-5 text-center hover:scale-105 transition-transform hover:border-accent/60">
                      <p className="text-xs font-bold text-accent uppercase tracking-wider">2 Horas</p>
                      <p className="mt-3 text-3xl font-black text-foreground">R$ {perfil.valores["2horas"]}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PIX em Destaque */}
              <div className="rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 p-6 shadow-lg shadow-emerald-500/20">
                <p className="mb-4 text-center text-lg font-bold uppercase tracking-[0.2em] text-emerald-400">💰 Pix para Confirmar</p>
                <div className="bg-black/40 rounded-2xl p-4 border border-emerald-500/30 mb-4">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Chave PIX</p>
                  <p className="text-sm font-mono text-foreground break-all">{PIX_GLOBAL}</p>
                </div>
                <Button 
                  onClick={copiarPix}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 flex items-center justify-center gap-2"
                >
                  {pixCopiadoGlobal ? (
                    <>
                      <Check className="h-5 w-5" />
                      PIX Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copiar Chave PIX
                    </>
                  )}
                </Button>
              </div>

              {/* Dica para Contato */}
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-sm leading-7 text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-accent" />
                  Como Funciona
                </div>
                Escolha o valor desejado, mande o PIX e confirme o encontro. Quanto mais você gasta, mais diversão! 🔥
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-3 mt-auto">
                
                {/* Telegram */}
                {perfil.telegram && (
                  <a 
                    href={`https://t.me/${perfil.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary text-center flex items-center justify-center gap-2 py-3 font-bold"
                  >
                    <SendIcon className="h-5 w-5" />
                    Contatar via Telegram
                  </a>
                )}

                {/* Email */}
                {perfil.email && (
                  <a 
                    href={`mailto:${perfil.email}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    Enviar Email
                  </a>
                )}

                {/* Formulário */}
                <Button 
                  onClick={() => setFormAberto(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Formulário de Contato
                </Button>

                {/* Compartilhar */}
                <Button
                  variant="outline"
                  className="w-full border-white/20 hover:bg-white/5"
                  onClick={() => {
                    const texto = `Confira ${perfil.nome} no Guia VIP Brasil`;
                    if (navigator.share) {
                      navigator.share({ title: `${perfil.nome} - Guia VIP Brasil`, text: texto, url: urlCompleta });
                    }
                  }}
                >
                  Compartilhar Perfil
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Modal - Formulário */}
        {formAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/80 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Enviar Mensagem</h3>
                <button onClick={() => setFormAberto(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Seu Nome</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Seu Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Mensagem</label>
                  <textarea
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent resize-none"
                    placeholder="Sua mensagem aqui..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={() => {
                    if (!formData.nome || !formData.email || !formData.mensagem) {
                      alert("Preencha todos os campos");
                      return;
                    }
                    alert(`Mensagem enviada para ${perfil?.nome}! Você receberá uma resposta em breve.`);
                    setFormAberto(false);
                    setFormData({ nome: "", email: "", mensagem: "" });
                  }}
                  className="w-full btn-primary py-3 font-bold"
                >
                  Enviar Mensagem
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
