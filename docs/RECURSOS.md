# Recursos visuais e licenças

## Imagens fornecidas

`assets/hero.png` e `assets/produtos.png` são cópias byte a byte dos ficheiros incluídos no ZIP fornecido pelo utilizador. Não foram retocadas. Segundo `IMAGENS.md` do pacote original, ambas foram geradas por IA para demonstração: não são fotografia real da Surf Point, registo de uma praia específica ou documentação de produtos disponíveis.

| Ficheiro | Dimensões | SHA-256 do original preservado |
| --- | --- | --- |
| `hero.png` | 1536 × 1024 | `81d2766b2934487b719cf8658c0b758e21534f0d5dc352fc9a019e2445bac33c` |
| `produtos.png` | 1254 × 1254 | `e505bab058c8117b893c78665eb5b46dc9c59ff50060464e32e9dc7470eed32f` |

As imagens fornecidas autorizam o trabalho desta demonstração; o pacote não inclui uma licença independente para redistribuição comercial. Uma futura loja exige validação dos direitos e conteúdo real aprovado. Fotografias ou interfaces de Instagram e de lojas concorrentes servem apenas como referências de investigação; não foram copiadas para os recursos comerciais do protótipo.

## Fontes locais

Obtidas do registo npm oficial em 21/10/2026, através de `npm pack`, sem adicionar dependências ao projeto. As ligações TLS e a verificação de integridade foram mantidas; os SHA-512 dos dois tarballs foram comparados com os valores `dist.integrity` publicados pelo registo. Os WOFF2 não foram modificados; só os nomes dos ficheiros locais foram simplificados.

| Caminho em `assets/fonts/` | Família e peso | Origem dentro do pacote |
| --- | --- | --- |
| `display-regular.woff2` | Barlow Condensed 400 normal, Latin | `files/barlow-condensed-latin-400-normal.woff2` |
| `display-semibold.woff2` | Barlow Condensed 600 normal, Latin | `files/barlow-condensed-latin-600-normal.woff2` |
| `display-bold.woff2` | Barlow Condensed 700 normal, Latin | `files/barlow-condensed-latin-700-normal.woff2` |
| `body-regular.woff2` | DM Sans 400 normal, Latin | `files/dm-sans-latin-400-normal.woff2` |
| `body-medium.woff2` | DM Sans 500 normal, Latin | `files/dm-sans-latin-500-normal.woff2` |
| `body-semibold.woff2` | DM Sans 600 normal, Latin | `files/dm-sans-latin-600-normal.woff2` |

- Barlow Condensed: `@fontsource/barlow-condensed@5.3.0`, <https://registry.npmjs.org/@fontsource/barlow-condensed>; Copyright 2017 The Barlow Project Authors. Licença SIL Open Font License 1.1 em `assets/fonts/LICENSE-barlow-condensed.txt`.
- DM Sans: `@fontsource/dm-sans@5.3.0`, <https://registry.npmjs.org/@fontsource/dm-sans>; Copyright 2014 The DM Sans Project Authors. Licença SIL Open Font License 1.1 em `assets/fonts/LICENSE-dm-sans.txt`.

As licenças permitem incorporação e redistribuição conjunta com o projeto, conservando os avisos e o texto da licença. Não há carregamento de fontes de serviços externos durante a apresentação.
