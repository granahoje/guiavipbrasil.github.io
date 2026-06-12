import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, X, Send, MapPin, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { MetaTags } from "@/components/MetaTags";

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
}

type Mensagem = { tipo: "usuario" | "assistente"; texto: string };

const getProfileImageUrl = (perfil: Perfil) => `/profile-images/profile-${perfil.id}.svg`;

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
];

function gerarResposta(perfil: Perfil, mensagem: string) {
  const texto = normalizar(mensagem);
  const saudacao = `Olá! Sou o assistente virtual de ${perfil.nome}.`;

  if (/\b(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|e aí)\b/.test(texto)) {
    return `${saudacao} Posso ajudar com informações sobre localização, disponibilidade, discrição, perfil e próximos passos para contato.`;
  }

  if (texto.includes("cidade") || texto.includes("local") || texto.includes("onde") || texto.includes("endereco") || texto.includes("endereço")) {
    return `${perfil.nome} está listada em ${perfil.cidade}. Para combinar detalhes específicos, use o contato do perfil e informe o melhor período para atendimento.`;
  }

  if (texto.includes("disponivel") || texto.includes("disponibilidade") || texto.includes("hoje") || texto.includes("agora") || texto.includes("horario") || texto.includes("horário")) {
    return `A disponibilidade de ${perfil.nome} pode variar ao longo do dia. Recomendo enviar uma mensagem objetiva com data, horário desejado e cidade para receber confirmação mais rápida.`;
  }

  if (texto.includes("valor") || texto.includes("preco") || texto.includes("preço") || texto.includes("custa") || texto.includes("cache") || texto.includes("cachê")) {
    return `Valores e condições devem ser confirmados diretamente com ${perfil.nome}. O ideal é informar duração, cidade e preferências de atendimento para receber uma resposta completa.`;
  }

  if (texto.includes("whatsapp") || texto.includes("telefone") || texto.includes("contato") || texto.includes("falar") || texto.includes("mensagem")) {
    return `Para falar com ${perfil.nome}, envie uma mensagem clara e respeitosa pelo canal de contato disponível no perfil. Inclua seu nome, cidade, data e horário pretendidos.`;
  }

  if (texto.includes("discreto") || texto.includes("discricao") || texto.includes("discrição") || texto.includes("sigilo") || texto.includes("privacidade")) {
    return `${perfil.nome} valoriza discrição e atendimento reservado. Evite enviar informações sensíveis desnecessárias e combine todos os detalhes com respeito e clareza.`;
  }

  if (texto.includes("perfil") || texto.includes("sobre") || texto.includes("descricao") || texto.includes("descrição") || texto.includes("quem")) {
    return `${perfil.nome} é um perfil ${perfil.categoria === "feminina" ? "feminino" : "trans"} em ${perfil.cidade}. Sobre: ${perfil.descricao}`;
  }

  if (texto.includes("seguro") || texto.includes("segurança") || texto.includes("seguranca") || texto.includes("golpe") || texto.includes("confiavel") || texto.includes("confiável")) {
    return `Combine tudo com calma, confirme informações antes de qualquer deslocamento e mantenha a conversa em tom respeitoso. O Guia VIP Brasil organiza os perfis, mas detalhes finais devem ser confirmados diretamente com ${perfil.nome}.`;
  }

  if (texto.includes("obrigado") || texto.includes("obrigada") || texto.includes("valeu")) {
    return `Por nada. Se quiser, posso ajudar com informações sobre cidade, disponibilidade, contato, discrição ou resumo do perfil de ${perfil.nome}.`;
  }

  const respostasGerais = [
    `${saudacao} Posso ajudar com cidade, disponibilidade, contato, discrição e resumo do perfil. O que você gostaria de saber primeiro?`,
    `${perfil.nome} está em ${perfil.cidade}. Para agilizar, envie uma pergunta sobre horário, contato, valores ou detalhes do perfil.`,
    `Entendi. Para uma resposta mais precisa, me diga se você quer saber sobre localização, disponibilidade, contato, privacidade ou características do perfil.`,
    `Posso orientar o primeiro contato com ${perfil.nome}: seja respeitoso, informe cidade, dia, horário desejado e aguarde a confirmação.`
  ];

  return respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
}

export default function Perfil() {
  const { url } = useParams();
  const [, navigate] = useLocation();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputMensagem, setInputMensagem] = useState("");

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data: Perfil[]) => {
        const encontrado = data.find((p) => p.url_amigavel === url);
        if (encontrado) {
          setPerfil(encontrado);
          setMensagens([
            {
              tipo: "assistente",
              texto: `Olá! Sou o assistente virtual de ${encontrado.nome}. Pergunte sobre disponibilidade, cidade, contato, discrição ou detalhes do perfil.`,
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
  }, [url]);

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

  if (carregando) {
    return (
      <div className="site-shell flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  if (erro || !perfil) {
    return (
      <div className="site-shell flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-muted-foreground">Perfil não encontrado.</p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  const urlCompleta = typeof window !== "undefined" ? window.location.href : "";
  const imagemCompartilhamento = getProfileImageUrl(perfil);

  return (
    <div className="site-shell min-h-screen bg-background">
      <MetaTags title={`${perfil.nome} - Guia VIP Brasil`} description={perfil.descricao} image={imagemCompartilhamento} url={urlCompleta} type="article" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="container py-4">
          <Button onClick={() => navigate("/")} variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao guia
          </Button>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <div className="profile-detail-card grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-3xl bg-muted">
            <img src={getProfileImageUrl(perfil)} alt={`${perfil.nome} em ${perfil.cidade}`} className="h-full min-h-[520px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
            <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
              {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
            </span>
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
                variant="outline"
                className="w-full"
                onClick={() => {
                  const texto = `Confira ${perfil.nome} no Guia VIP Brasil`;
                  if (navigator.share) {
                    navigator.share({ title: `${perfil.nome} - Guia VIP Brasil`, text: texto, url: urlCompleta });
                  } else {
                    navigator.clipboard?.writeText(urlCompleta);
                    alert("Link copiado para a área de transferência.");
                  }
                }}
              >
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </main>

      {chatAberto && (
        <div className="chat-panel fixed bottom-4 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl md:right-6">
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-amber-600 to-yellow-500 p-4 text-black">
            <div>
              <h3 className="font-bold">Assistente Virtual</h3>
              <p className="text-xs font-semibold opacity-80">Respondendo por {perfil.nome}</p>
            </div>
            <button onClick={() => setChatAberto(false)} className="rounded-full p-2 transition hover:bg-black/10" aria-label="Fechar chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {mensagens.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.tipo === "usuario" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${msg.tipo === "usuario" ? "bg-primary text-primary-foreground" : "bg-white/[0.07] text-foreground"}`}>
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {sugestoes.map((sugestao) => (
                <button key={sugestao} onClick={() => enviarMensagem(sugestao)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground transition hover:border-accent hover:text-foreground">
                  {sugestao}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMensagem}
                onChange={(e) => setInputMensagem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                placeholder="Digite sua pergunta..."
                className="flex-1 rounded-xl border border-white/10 bg-background px-3 py-3 text-sm outline-none transition focus:border-accent"
              />
              <Button size="sm" onClick={() => enviarMensagem()} className="h-auto px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {!chatAberto && (
        <button onClick={() => setChatAberto(true)} className="fixed bottom-5 right-5 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-[0_18px_45px_rgba(217,159,73,0.34)] transition hover:-translate-y-1" title="Abrir chat com assistente virtual">
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
