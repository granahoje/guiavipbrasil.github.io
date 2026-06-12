import { useEffect } from "react";

interface MetaTagsProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: "website" | "article";
}

export function MetaTags({
  title,
  description,
  image,
  url,
  type = "website",
}: MetaTagsProps) {
  useEffect(() => {
    // Atualizar title
    document.title = title;

    // Função para atualizar ou criar meta tag
    const setMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) ||
        document.querySelector(`meta[property="${name}"]`);
      
      if (!tag) {
        tag = document.createElement("meta");
        const isProperty = name.startsWith("og:") || name.startsWith("twitter:");
        if (isProperty) {
          tag.setAttribute("property", name);
        } else {
          tag.setAttribute("name", name);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Meta tags padrão
    setMetaTag("description", description);
    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:image", image);
    setMetaTag("og:url", url);
    setMetaTag("og:type", type);
    setMetaTag("og:site_name", "Guia VIP Brasil");

    // Twitter Cards
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

  }, [title, description, image, url, type]);

  return null;
}
