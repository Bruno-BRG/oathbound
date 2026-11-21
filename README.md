# Oathbound — Ficha de personagem

Ficha digital para o RPG **Oathbound** (baseado em Ironsworn). Roda 100% no navegador.
Sem servidor, sem banco de dados, sem conta.

## Layout

Segue a estrutura do Stargazer (Iron Journal), com visual próprio:

- **Cabeçalho:** menu de campanhas (≡), busca (Ctrl+K), dados e diário.
- **Abas:** Campaign · nome do personagem · Challenges · Amarin · Guide.
- **Gaveta da direita:** Dice (rolagens e log) · Oracles · Moves · Journal. Pode ser recolhida com o botão redondo.
- **Menu da esquerda:** lista de campanhas, exportar e carregar JSON, exportar diário (.md), duplicar, imprimir, cores de destaque.

### Abas
- **Campaign:** nome da campanha, as 8 *Truths* do Amarin (escolha, d100 ou texto próprio), facções e notas.
- **Character:** identidade, vida/espírito/suprimento/foco/momentum em faixas, stats (clique no número para rolar), impactos, notas, bonds, XP e assets.
- **Challenges:** vows e progresso (journeys, fights, rituals). Clique nas caixas para marcar. Foes fica aqui também.
- **Amarin:** mapa do livro com grade hexagonal. Clique num hex para nomear, marcar controle e escrever notas. Roll a place preenche o nome.
- **Guide:** resumo das regras e tabelas de referência.

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
js/view-campaign.js   abas Campaign e Amarin (mapa hexagonal)
js/view-guide.js      aba Guide
js/view-moves.js      moves na gaveta
js/view-oracles.js    oráculos e foes
js/view-log.js        dados e log de rolagens
js/drawer.js          diário na gaveta
js/app.js             casca do app, menu, eventos e ações
assets/               arte e fontes
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
- Menu ≡ → **Dice Style (3D)**: cor do corpo e dos números, acabamento (brilhante, fosco, metal), qualidade (low/medium/high), pontos no d6, 10 temas prontos.
