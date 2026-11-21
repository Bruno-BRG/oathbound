# Oathbound — Ficha de personagem

Ficha digital para o RPG **Oathbound** (baseado em Ironsworn). Roda 100% no navegador.
Sem servidor. Sem banco de dados. Sem conta.

## O que tem

| Aba | O que faz |
|---|---|
| **Sheet** | Identidade, stats, health/spirit/supply/focus/momentum, debilities, bonds, XP, tier, Ascend, checklist de criação, setup semi-aleatório |
| **Tracks** | Oaths, journeys, fights e rituals com trilha de 10 caixas × 4 ticks, por rank |
| **Assets** | Class card, path cards, talents, companions, artifacts, spells |
| **Moves** | Todos os moves do Waystone, com botões de rolagem e resultado de strong hit, weak hit e miss |
| **Oracles** | Todos os oráculos do Waystone (d100), Ask the Oracle, nomes por heritage, geradores combinados |
| **Foes** | Bestiário por rank, pack builder, fights |
| **Guide** | Regras resumidas, magia, deuses, patronos, o mapa e as regiões do Amarin |
| **Journal** | Diário de sessão e *Your Truths* (as 8 verdades do mundo) |

O painel de **Dice** (à direita, ou o botão 🎲 no celular) faz a rolagem de ação (d6 + stat + adds contra 2d10),
**burn momentum**, momentum negativo, matches, rolagem de progresso e guarda o log de rolagens.

## Salvar e carregar

- Salva sozinho no **localStorage** do navegador.
- **Export JSON** baixa o personagem. **Import** carrega o arquivo (ou arraste o `.json` para a janela).
- Faça o backup em JSON. Se limpar os dados do navegador, o save local some.

## Publicar na Vercel

Não há build. É um site estático.

1. Suba este repositório no GitHub.
2. Na Vercel: **Add New → Project**, escolha o repositório.
3. **Framework Preset: Other**. Deixe Build Command e Output Directory vazios. **Deploy**.

Ou pela CLI: `npx vercel --prod` na pasta do projeto.

Para testar local, abra o `index.html` no navegador, ou rode `npx serve .`.

## Estrutura

```
index.html          página
css/style.css       visual
js/data.js          regras: heritages, classes, moves, oráculos (Waystone)
js/assets-data.js   cartas de classe, mundo, truths, regiões (Core Rulebook)
js/core.js          estado, save, import/export
js/engine.js        dados, moves, efeitos, tracks, tiers
js/view-*.js        telas
js/app.js           eventos e ações
assets/             arte do livro
```

## Completar as path cards

As **class cards** das 10 classes estão completas. A path **Evoker** (Arcane Bolt, Fireball) e os artefatos
Emberbrand e Crown of the Drowned King também. As outras path cards, os talents e os companions do
Apêndice A do Core Rulebook entram em `js/assets-data.js`, em `OB.PATH_CARDS`. Enquanto isso, a ficha cria o card
com o nome certo e você digita as habilidades.

## Créditos e licença

*Oathbound* por Bruno Rocha Guimarães, baseado em *Ironsworn* de Shawn Tomkin.
Texto e arte do livro: CC BY-NC-SA 4.0. Uso não comercial, com crédito, e compartilhe sob a mesma licença.
