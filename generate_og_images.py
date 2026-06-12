#!/usr/bin/env python3
"""
Gera imagens Open Graph 1200x630px para cada perfil.
Estilo: Dark Luxury Editorial com dourado, rosé e tipografia elegante.
"""

import json
import os
from PIL import Image, ImageDraw, ImageFilter
import requests
from io import BytesIO

# Configurações
OG_WIDTH = 1200
OG_HEIGHT = 630
PROJECT_PATH = "/home/ubuntu/guia-vip-brasil"
ASSETS_PATH = "/home/ubuntu/webdev-static-assets/guia-vip-brasil"
OUTPUT_DIR = f"{PROJECT_PATH}/client/public/og-images"

# Cores (Dark Luxury Editorial)
COLOR_BG = "#0a0a0a"  # Preto profundo
COLOR_ACCENT = "#c9a84c"  # Dourado
COLOR_ACCENT_ROSE = "#e8a0b0"  # Rosé
COLOR_TEXT = "#ffffff"  # Branco
COLOR_TEXT_SECONDARY = "#b0b0b0"  # Cinza claro

# Criar diretório de saída
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Carregar dados dos perfis
with open(f"{PROJECT_PATH}/perfis.json", "r", encoding="utf-8") as f:
    perfis = json.load(f)

# Carregar mapeamento de storage
with open(f"{PROJECT_PATH}/storage_map.json", "r", encoding="utf-8") as f:
    storage_map = json.load(f)

def download_image(url):
    """Baixa uma imagem e retorna como PIL Image."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        print(f"  ⚠ Erro ao baixar {url}: {e}")
        return None

def resize_and_crop_to_fit(img, target_width, target_height):
    """Redimensiona e corta a imagem para caber em um retângulo mantendo aspect ratio."""
    img_ratio = img.width / img.height
    target_ratio = target_width / target_height
    
    if img_ratio > target_ratio:
        # Imagem é mais larga, cortar os lados
        new_height = target_height
        new_width = int(new_height * img_ratio)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        left = (new_width - target_width) // 2
        img = img.crop((left, 0, left + target_width, target_height))
    else:
        # Imagem é mais alta, cortar topo/fundo
        new_width = target_width
        new_height = int(new_width / img_ratio)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        top = (new_height - target_height) // 2
        img = img.crop((0, top, target_width, top + target_height))
    
    return img

def create_og_image(perfil, foto_url):
    """Cria a imagem Open Graph para um perfil."""
    
    # Baixar foto
    print(f"  Processando {perfil['nome']}...", end=" ")
    foto = download_image(foto_url)
    
    if foto is None:
        print("❌ Foto não disponível")
        return False
    
    # Redimensionar e cortar foto
    foto = resize_and_crop_to_fit(foto, OG_WIDTH, OG_HEIGHT)
    
    # Criar imagem base com fundo escuro
    og_image = Image.new("RGB", (OG_WIDTH, OG_HEIGHT), COLOR_BG)
    
    # Colar foto (ocupando 60% da largura à esquerda)
    foto_width = int(OG_WIDTH * 0.6)
    foto_resized = foto.resize((foto_width, OG_HEIGHT), Image.Resampling.LANCZOS)
    og_image.paste(foto_resized, (0, 0))
    
    # Criar overlay gradiente sobre a foto (escurecimento)
    overlay = Image.new("RGBA", (foto_width, OG_HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Gradiente de transparência (esquerda opaca, direita transparente)
    for x in range(foto_width):
        alpha = int(100 * (1 - x / foto_width))  # Gradiente de 100 a 0
        overlay_draw.rectangle([(x, 0), (x + 1, OG_HEIGHT)], fill=(0, 0, 0, alpha))
    
    og_image.paste(overlay, (0, 0), overlay)
    
    # Desenhar seção de texto (lado direito)
    draw = ImageDraw.Draw(og_image)
    text_x = foto_width + 40
    text_y_start = 100
    
    # Linha decorativa dourada
    line_y = text_y_start - 30
    draw.line([(text_x, line_y), (text_x + 150, line_y)], fill=COLOR_ACCENT, width=3)
    
    # Nome (grande e elegante)
    nome_text = perfil["nome"]
    draw.text((text_x, text_y_start), nome_text, fill=COLOR_TEXT, font=None)
    
    # Categoria (pequena, com cor diferenciada)
    categoria_text = "FEMININA" if perfil["categoria"] == "feminina" else "TRANS"
    categoria_color = COLOR_ACCENT if perfil["categoria"] == "feminina" else COLOR_ACCENT_ROSE
    draw.text((text_x, text_y_start + 60), categoria_text, fill=categoria_color, font=None)
    
    # Cidade
    draw.text((text_x, text_y_start + 100), perfil["cidade"], fill=COLOR_TEXT_SECONDARY, font=None)
    
    # Logo/marca (rodapé)
    draw.text((text_x, OG_HEIGHT - 60), "Guia VIP Brasil", fill=COLOR_ACCENT, font=None)
    
    # Salvar imagem
    output_path = f"{OUTPUT_DIR}/{perfil['url_amigavel']}.png"
    og_image.save(output_path, "PNG", quality=95)
    print("✓")
    
    return True

# Processar todos os perfis
print(f"\n🎨 Gerando {len(perfis)} imagens Open Graph 1200x630px...\n")

sucesso = 0
for perfil in perfis:
    foto_original = perfil["foto_original"]
    if foto_original in storage_map:
        foto_url = f"https://manus.space{storage_map[foto_original]}"
        if create_og_image(perfil, foto_url):
            sucesso += 1
    else:
        print(f"  ⚠ Foto não encontrada no mapa: {foto_original}")

print(f"\n✓ {sucesso}/{len(perfis)} imagens geradas com sucesso")
print(f"📁 Salvas em: {OUTPUT_DIR}")
