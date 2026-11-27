# Oathbound — Ficha de personagem

Ficha digital para o RPG **Oathbound** (baseado em Ironsworn). Roda 100% no navegador.
Sem servidor, sem banco de dados, sem conta.

## Layout

Segue a estrutura do Stargazer (Iron Journal), com visual próprio:

- **Cabeçalho:** menu de campanhas (≡), busca (Ctrl+K), dados e diário.
- **Abas:** Campaign · nome do personagem · Challenges · Guide.
- **Gaveta da direita:** Dice (rolagens e log) · Oracles · Moves · Journal. Pode ser recolhida com o botão redondo.
- **Menu da esquerda:** lista de campanhas, exportar e carregar JSON, exportar diário (.md), baixar os PDFs dos livros, duplicar, imprimir, cores de destaque.

### Abas
- **Campaign:** nome da campanha, as 8 *Truths* do Amarin (escolha, d100 ou texto próprio), facções e notas.
- **Character:** identidade, vida/espírito/suprimento/foco/momentum em faixas, stats (clique no número para rolar), impactos, notas, bonds, XP e assets.
- **Challenges:** vows e progresso (journeys, rituals, other). Os inimigos ficam todos na seção **Foes**, cada um com a sua única trilha de progresso — não há duas listas para o mesmo combate.
- **Guide:** resumo das regras e tabelas de referência. A seção *The Amarin* traz o mapa ilustrado do livro (`assets/map.jpg`), só para consulta. Não há mapa customizável nem outras imagens no site.

## PDFs dos livros

Os dois livros em PDF ficam em `output/pdf/` e são servidos pelo próprio site:

- `output/pdf/Oathbound_Core_Rulebook.pdf` — Core Rulebook (classes, paths, heranças, upbringings, Amarin).
- `output/pdf/Waystone_Oathbound_Reference.pdf` — Waystone Reference (oráculos, foes, turning points).

No app, os links ficam na aba **Guide** (seção *Rulebooks* e no fim de *Credits*) e no menu **≡ → Rulebook PDFs**.

No deploy, a pasta `output/` precisa ir junto: o `Dockerfile` copia `output/` para a imagem e o `nginx.conf` serve `/output/pdf/` como `application/pdf` (sem isso o nginx devolve o `index.html` e o download quebra). Na Vercel, como é site estático, os arquivos do repositório já são servidos no mesmo caminho.

## Salvar e carregar

- Salva sozinho no **localStorage** do navegador.
- **Export** no menu baixa a campanha em JSON. **Load** carrega o arquivo (ou arraste o `.json` para a janela).
- Faça backup em JSON. Se limpar os dados do navegador, o save local some.

## Publicar na Vercel

Não há build. É um site estático.

1. Na Vercel: **Add New → Project**, escolha o repositório.
2. **Framework Preset: Other**. Build Command e Output Directory vazios.
3. Em **Production Branch**, use `main`. **Deploy**.

## Estrutura

```
index.html            página (carrega os scripts nesta ordem)
css/style.css         visual
js/data.js            regras: heritages, classes, moves, oráculos (Waystone)
js/assets-data.js     cartas de classe, mundo, truths, regiões (Core Rulebook)
js/core.js            estado, save, import/export
js/engine.js          rolagens, moves, efeitos, tracks, tiers
js/icons.js           ícones em SVG
js/ui.js              componentes (faixas, bandas, modal)
js/view-character.js  aba Character
js/view-challenges.js aba Challenges
js/view-campaign.js   aba Campaign (truths, facções, notas)
js/view-guide.js      aba Guide
js/view-moves.js      moves na gaveta
js/view-oracles.js    oráculos e foes
js/view-log.js        dados e log de rolagens
js/drawer.js          diário na gaveta
js/app.js             casca do app, menu, eventos e ações
assets/               mapa do livro, ícones, fontes e o three.js
```

## Completar as path cards

As class cards das 10 classes estão completas, e a path Evoker também. As outras path cards, talents e companions do Apêndice A do Core Rulebook entram em `OB.PATH_CARDS` (em `js/assets-data.js`). Enquanto isso, a ficha cria o card com o nome certo e você digita as habilidades.

## Créditos e licença

*Oathbound* por Bruno Rocha Guimarães, baseado em *Ironsworn* de Shawn Tomkin.
Texto e arte do livro: CC BY-NC-SA 4.0. Uso não comercial, com crédito, e compartilhe sob a mesma licença.

## PWA (app instalável)

- `manifest.webmanifest`, ícones em `assets/icons/` e `sw.js` (service worker).
- Depois da primeira visita o app abre **sem internet** (HTML/JS/CSS: rede primeiro; imagens e fontes: cache).
- Para instalar: menu ≡ → **Install App** (Chrome/Edge/Android), ou "Adicionar à Tela de Início" no iPad/iPhone.
- Ao publicar uma versão nova, mude `VERSION` em `sw.js`.
- O service worker só liga em `http(s)`, não em `file://`.

## Tablet

- Gaveta fixa ao lado da ficha a partir de 1024 px (iPad na horizontal); abaixo disso ela vira painel sobre a página.
- Em telas de toque: alvos de 44 px, campos de 16 px (sem zoom no iOS), botões ± dos atributos sempre visíveis, áreas seguras (notch) respeitadas.

## Dados 3D

- three.js (MIT) em `assets/vendor/three-dice.js`; carrega só quando precisa. Sem WebGL, o app usa o rolo 2D.
- O jogo sorteia o resultado antes; a animação só mostra o resultado.
- Menu ≡ → **Dice Style (3D)**: cor do corpo e dos números, acabamento (brilhante, fosco, metal), qualidade (low/medium/high), 10 temas prontos.

## Deploy no Coolify (Docker)

O repositório tem `Dockerfile` (nginx) e `nginx.conf`.

1. Coolify → New Resource → o repositório → **Build Pack: Dockerfile**, branch `main`, porta **80**.
2. Ative **Auto Deploy** (webhook do GitHub) para cada push na `main` publicar sozinho.
3. Domínio e HTTPS: configure no próprio Coolify. O PWA e o service worker precisam de HTTPS.
4. Atualização: a cada versão nova, mude `VERSION` em `sw.js` e `OB.BUILD` em `js/app.js` (mesmo valor). O app instalado baixa os arquivos novos e recarrega uma vez. HTML, JS e CSS sempre vêm da rede primeiro.
5. Cache: HTML, JS, CSS e `sw.js` sempre revalidam (nginx `no-cache`). Imagens ficam 7 dias, fontes 1 ano.
6. Saúde: `GET /healthz` responde `ok`.

Se a tela antiga continuar depois do deploy, use **Redeploy com "Force rebuild"** e limpe os dados do site no navegador uma vez.

### Se o site não abrir no Coolify

- **Porta:** o nginx escuta em `80` e em `3000`. Em Configurações → Network → *Ports Exposes*, use `80` (ou `3000`). Valor diferente dá "no available server".
- **Build Pack** tem que ser **Dockerfile**, *Base Directory* `/`, *Dockerfile Location* `/Dockerfile`.
- **Logs:** Deployments → último deploy (erro de build) e Logs do container (erro do nginx).
- **Healthcheck:** o container responde `ok` em `/healthz`. Se o deploy fica "unhealthy", desligue o healthcheck do Coolify e veja o log.
- **Domínio:** em *Domains* use `https://oathbound.brunorocha.dev.br` e confira o DNS (registro A para o IP do VPS).

