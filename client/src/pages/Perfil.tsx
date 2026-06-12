import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, X, Send, MapPin, ShieldCheck, Clock } from "lucide-react";
import { MetaTags } from "@/components/MetaTags";
import { profileExtensions } from "../profileExtensions";
import { useState, useEffect } from "react";

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
}

type Mensagem = { tipo: "usuario" | "assistente"; texto: string };

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
  "Está disponível hoje?",
  "Qual cidade atende?",
  "Como funciona o contato?",
  "Quero saber mais sobre discrição",
  "Qual é o valor?",
  "Como é o atendimento?",
];

function gerarResposta(perfil: Perfil, mensagem: string) {
  const texto = normalizar(mensagem);

  if (/\b(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|e aí|opa|e aew|oie)\b/.test(texto)) {
    return `Oi, tudo bem? Sou ${perfil.nome}! 😈 Vem conversar comigo, adoro conhecer gente interessante...`;
  }

  if (texto.includes("cidade") || texto.includes("local") || texto.includes("onde")) {
    return `Estou em ${perfil.cidade}, pertinho de você! Quer vir me visitar? 🔥`;
  }

  if (texto.includes("disponivel") || texto.includes("hoje") || texto.includes("agora") || texto.includes("horario")) {
    return `Depende do dia, mas se você quiser, a gente marca! Me manda a data e horário que você quer, e a gente combina tudo... 😉`;
  }

  if (texto.includes("valor") || texto.includes("preco") || texto.includes("quanto") || texto.includes("tabela")) {
    return `Os valores estão ali na tabela, mas tudo depende do que você quer fazer comigo... Quanto mais tempo, mais diversão! 💦`;
  }

  if (texto.includes("atendimento") || texto.includes("servico") || texto.includes("faz o que")) {
    return `Ah, eu faço de tudo! Adoro dar o cuzinho, gozar na sua boca, sentar na sua cara... Qualquer coisa que você quiser, eu topo! 🍆💦`;
  }

  if (texto.includes("contato") || texto.includes("whatsapp") || texto.includes("falar")) {
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

  const respostasGerais = [
    `Oi, tudo bem? Quer saber mais sobre mim? Sou uma gata que adora sexo e estou aqui pra você se divertir! 🔥`,
    `Me faz uma pergunta que eu respondo! Quer saber sobre valores, disponibilidade ou como a gente faz? 😏`,
    `Estou aqui e pronta pra te deixar louco! Quer marcar um encontro gostoso? 💦`,
    `Que tal a gente parar de conversa e partir pra ação? Manda um PIX e vem me ver! 🍆`,
    `Adoro conversar, mas o que eu mais gosto é de ação! Bora marcar? 😈`
  ];

  return respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
}

export default function Perfil() {
  const { url: id } = useParams();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [pixCopiado, setPixCopiado] = useState(false);
  const { pathname } = useLocation();
  const urlCompleta = `${window.location.origin}${pathname}`;

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((perfis: Perfil[]) => {
        const encontrado = perfis.find((p) => p.url_amigavel === id);
        if (encontrado) {
          setPerfil(encontrado);
          setMensagens([
            {
              tipo: "assistente",
              texto: `Oi! Sou ${encontrado.nome}. Pergunte sobre disponibilidade, cidade, contato, discrição ou detalhes do perfil.`,
            },
          ]);
        } else {
          setErro(true);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        setErro(true);
        setCarregando(false);
      });
  }, [id]);

  const enviarMensagem = (textoPersonalizado?: string) => {
    if (!perfil) return;

    const texto = (textoPersonalizado ?? inputMensagem).trim();
    if (!texto) return;

    setMensagens((prev) => [...prev, { tipo: "usuario", texto }]);
    setInputMensagem("");

    window.setTimeout(() => {
      setMensagens((prev) => [...prev, { tipo: "assistente", texto: gerarResposta(perfil, texto) }]);
    }, 500);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(perfil?.pix_chave || "52295826-c5c1-4577-a7b0-88dcde648f71");
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 2000);
  };

  if (carregando) {
    return (
      <div className="site-shell flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  if (erro || !perfil) {
    return (
      <div className="site-shell flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-2xl font-bold text-foreground">Perfil não encontrado</p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags title={`${perfil.nome} - Guia VIP Brasil`} description={perfil.descricao} image={getProfileImageUrl(perfil)} />
      <div className="site-shell min-h-screen">
        <header className="border-b border-white/10 bg-black/40 backdrop-blur">
          <div className="container flex items-center justify-between py-4">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar ao guia</span>
            </button>
          </div>
        </header>

        <main className="container py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="relative h-96 overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={getProfileImageUrl(perfil)}
                  alt={`${perfil.nome} em ${perfil.cidade}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
                  {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-1 md:p-3">
              <div>
                <p className="eyebrow mb-3">Perfil VIP</p>
                <h1 className="text-4xl font-bold text-foreground md:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {perfil.nome}
                </h1>
                <div className="accent-line mt-5" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="info-card">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span>Localização</span>
                  <strong>{perfil.cidade}</strong>
                </div>
                <div className="info-card">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <span>Atendimento</span>
                  <strong>Reservado</strong>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Sobre</p>
                <p className="leading-8 text-foreground/90">{perfil.descricao}</p>
              </div>

              {perfil.valores && (
                <div className="rounded-2xl border-2 border-pink-500/60 bg-gradient-to-r from-pink-600/20 to-pink-500/10 p-6 shadow-lg shadow-pink-500/20">
                  <p className="mb-5 text-center text-lg font-bold uppercase tracking-[0.2em] text-pink-400">💰 Tabela de Valores 💰</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border-2 border-pink-400/50 bg-pink-500/15 p-4 text-center hover:scale-105 transition-transform">
                      <p className="text-sm font-bold text-pink-200">30 MINUTOS</p>
                      <p className="mt-3 text-3xl font-black text-pink-300">R$ {perfil.valores["30min"]}</p>
                    </div>
                    <div className="rounded-xl border-2 border-pink-400/50 bg-pink-500/15 p-4 text-center hover:scale-105 transition-transform">
                      <p className="text-sm font-bold text-pink-200">1 HORA</p>
                      <p className="mt-3 text-3xl font-black text-pink-300">R$ {perfil.valores["1hora"]}</p>
                    </div>
                    <div className="rounded-xl border-2 border-pink-400/50 bg-pink-500/15 p-4 text-center hover:scale-105 transition-transform">
                      <p className="text-sm font-bold text-pink-200">2 HORAS</p>
                      <p className="mt-3 text-3xl font-black text-pink-300">R$ {perfil.valores["2horas"]}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-sm leading-7 text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground"><Clock className="h-4 w-4 text-accent" />Dica para contato</div>
                Envie uma mensagem educada, com cidade, dia e horário desejados. Assim o atendimento tende a ser mais rápido e organizado.
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <Button className="w-full btn-primary" onClick={() => setChatAberto(true)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Conversar Agora
                </Button>
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3"
                  onClick={copiarPix}
                >
                  {pixCopiado ? '✓ PIX Copiado!' : '💰 Copiar PIX'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
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

        {chatAberto && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm md:items-center md:justify-center">
            <div className="chat-container w-full max-w-md max-h-96 md:rounded-3xl">
              <div className="chat-header flex items-center justify-between">
                <h3 className="text-pink-300 font-bold">{perfil.nome}</h3>
                <button onClick={() => setChatAberto(false)} className="text-pink-300 hover:text-pink-100 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="chat-messages">
                {mensagens.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.tipo === "usuario" ? "usuario" : "assistente"}`}>
                    {msg.texto}
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <div className="chat-input">
                  <input
                    type="text"
                    value={inputMensagem}
                    onChange={(e) => setInputMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                    placeholder="Escreva algo sexy..."
                    className="chat-input input"
                  />
                  <button onClick={() => enviarMensagem()} className="rounded-full bg-pink-600 hover:bg-pink-700 p-2 text-white transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                {sugestoes.length > 0 && (
                  <div className="chat-suggestions">
                    {sugestoes.map((sugestao, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputMensagem(sugestao);
                          setTimeout(() => enviarMensagem(sugestao), 0);
                        }}
                        className="chat-suggestion-btn"
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
