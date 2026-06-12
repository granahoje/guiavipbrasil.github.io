#!/usr/bin/env python3
"""Melhora o head do index.html com metatags SEO, Open Graph e link para sitemap"""

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_head = '''<head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Guia VIP Brasil</title>
    <script src="https://quge5.com/88/tag.min.js" data-zone="248874" async data-cfasync="false"></script>
    <script src="https://pl29718960.effectivecpmnetwork.com/93/cc/a9/93cca95fcf8777285dbf3301f4d19ff8.js"></script>    
    <!-- THIS IS THE START OF A COMMENT BLOCK, BLOCK TO BE DELETED: Google Fonts here, example:
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    THIS IS THE END OF A COMMENT BLOCK, BLOCK TO BE DELETED -->
    <script type="module" crossorigin src="/assets/index-CGX1ROXh.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-D_hUvo7i.css">
  </head>'''

new_head = '''<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Guia VIP Brasil | Curadoria Premium de Acompanhantes no Brasil</title>
    <meta name="description" content="Guia VIP Brasil — curadoria premium de acompanhantes femininas e trans em todo o Brasil. Perfis verificados, discrição garantida, atendimento VIP." />
    <meta name="keywords" content="guia vip brasil, acompanhantes, acompanhantes de luxo, acompanhantes brasil, perfis premium" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://guiavipbrasil.github.io/" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://guiavipbrasil.github.io/" />
    <meta property="og:title" content="Guia VIP Brasil | Curadoria Premium" />
    <meta property="og:description" content="Perfis premium selecionados com discrição e elegância em todo o Brasil." />
    <meta property="og:image" content="https://guiavipbrasil.github.io/profile-images/profile-1.jpeg" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Guia VIP Brasil" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Guia VIP Brasil | Curadoria Premium" />
    <meta name="twitter:description" content="Perfis premium selecionados com discrição e elegância em todo o Brasil." />
    <meta name="twitter:image" content="https://guiavipbrasil.github.io/profile-images/profile-1.jpeg" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <!-- Analytics -->
    <script src="https://quge5.com/88/tag.min.js" data-zone="248874" async data-cfasync="false"></script>
    <script src="https://pl29718960.effectivecpmnetwork.com/93/cc/a9/93cca95fcf8777285dbf3301f4d19ff8.js"></script>

    <script type="module" crossorigin src="/assets/index-CGX1ROXh.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-D_hUvo7i.css">
  </head>'''

if old_head in content:
    content = content.replace(old_head, new_head)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Head atualizado com sucesso!")
else:
    # Tentar substituição parcial apenas do <head>...</head>
    import re
    head_match = re.search(r'<head>.*?</head>', content, re.DOTALL)
    if head_match:
        print("Head encontrado mas diferente do esperado:")
        print(head_match.group()[:500])
    else:
        print("Head não encontrado!")
