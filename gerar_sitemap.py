#!/usr/bin/env python3
"""Gera sitemap.xml atualizado com todos os perfis do perfis.json"""

import json
from datetime import date

data = json.load(open("perfis.json"))
hoje = date.today().strftime("%Y-%m-%d")

linhas = ['<?xml version="1.0" encoding="UTF-8"?>']
linhas.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
linhas.append('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')

# Página principal
linhas.append('    <url>')
linhas.append('        <loc>https://guiavipbrasil.github.io/</loc>')
linhas.append(f'        <lastmod>{hoje}</lastmod>')
linhas.append('        <changefreq>daily</changefreq>')
linhas.append('        <priority>1.0</priority>')
linhas.append('    </url>')

# Perfis individuais
for p in data:
    url = p['url_amigavel']
    nome = p['nome']
    cidade = p['cidade']
    linhas.append('    <url>')
    linhas.append(f'        <loc>https://guiavipbrasil.github.io/{url}</loc>')
    linhas.append(f'        <lastmod>{hoje}</lastmod>')
    linhas.append('        <changefreq>weekly</changefreq>')
    linhas.append('        <priority>0.8</priority>')
    linhas.append(f'        <image:image>')
    linhas.append(f'            <image:loc>https://guiavipbrasil.github.io/profile-images/profile-{p["id"]}.jpeg</image:loc>')
    linhas.append(f'            <image:title>{nome} em {cidade}</image:title>')
    linhas.append(f'        </image:image>')
    linhas.append('    </url>')

linhas.append('</urlset>')

sitemap = '\n'.join(linhas) + '\n'

# Salvar em public/sitemap.xml e na raiz
with open('public/sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap)

# Também salvar na raiz para garantir acesso direto
with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap)

print(f"Sitemap gerado com {len(data)} perfis + página principal = {len(data)+1} URLs")
print(f"Data: {hoje}")
