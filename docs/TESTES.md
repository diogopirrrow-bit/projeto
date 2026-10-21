# Verificação do protótipo

Executada em **21 de outubro de 2026**, em Chromium **154.0.8037.57**, através de Playwright Python, contra o servidor local do projeto. Não equivale a certificação de acessibilidade, auditoria comercial ou preparação para produção.

## Testes funcionais executados

**9 grupos aprovados; 0 falhas na execução final** (`python3 tests/test_browser.py`, 15,730 s). A suite está incluída e não é necessária para abrir a demonstração.

| Grupo | Comportamento efetivamente verificado |
| --- | --- |
| Rotas e produtos | Homepage, loja, alugueres, conteúdo de marca, quatro fichas de produto e estado de produto inexistente; título de página e aviso demonstrativo. |
| Catálogo | Categorias, pesquisa por nome/categoria/cor sem depender de acentos ou maiúsculas, ordenação por preço e nome, estado vazio e limpeza de filtros; pesquisa com caracteres HTML tratada como texto. |
| Produto e seleção | Aproximação/vista completa, ajuda à escolha, variantes, adicionar, aumentar/diminuir quantidade, separar variantes, total, remover, estado vazio e recuperação da seleção após recarregar a mesma sessão. |
| Alugueres | Três escolhas de equipamento, duração, resumo com seleção correta, tarifa por definir e disponibilidade não consultada; nenhum pedido de reserva enviado. |
| Pesquisa global e diálogos | Pesquisa abre com foco no campo, Tab/Shift+Tab permanecem no diálogo, Escape fecha e devolve foco; submissão abre o catálogo correto. |
| Mobile | Menu, navegação, abertura/fecho dos filtros, categoria e seleção através de teclado. |
| Larguras e imagens | **32 combinações: 8 rotas × 360, 390, 768 e 1440 px**. Sem scroll horizontal, imagens HTML carregadas e diálogo dentro da largura disponível. |
| Movimento e foco | Preferência `prefers-reduced-motion`, navegação Tab/Shift+Tab e foco visível nos controlos verificados. |
| Salto de navegação | “Saltar para o conteúdo” mantém a ficha de produto atual e coloca o foco no conteúdo. |

Durante estes percursos: **0 erros de JavaScript/consola, 0 pedidos de recursos externos e 0 falhas de carregamento de recursos**. O link externo para Instagram não foi aberto pela suite; é uma ação explícita disponível no rodapé, sem recursos do Instagram carregados no protótipo.

Foram encontrados e corrigidos durante a revisão: overflow de categorias em 360 px, passagem de foco para fora do diálogo ao completar um ciclo de Tab e conflito entre o link de salto e a navegação por hash. Os testes correspondentes passaram após as correções.

## Repetir os testes

Com Python e Playwright disponíveis na máquina e um Chromium instalado:

```sh
cd /workspace/projeto
python3 -m http.server 8000 --bind 127.0.0.1
# Noutro terminal:
python3 tests/test_browser.py
```

O servidor é apenas local. As variáveis opcionais `SURF_POINT_BASE_URL` e `CHROMIUM_PATH` permitem usar outra porta ou executável. Abrir/apresentar o site não exige Playwright nem Chromium de sistema; estes são recursos de teste.

## Verificação automática de acessibilidade

Executadas **10 análises com axe-core 4.14.0**, com os grupos WCAG 2.0/2.1 A e AA: homepage, catálogo, ficha Atlantic Midlength, alugueres e conteúdo de marca, em **390 e 1440 px**.

**Resultado final: 0 violações detetadas nos 10 cenários** (incluindo 0 críticas e 0 sérias). Foi corrigida uma divergência entre texto visível e nome acessível no wordmark e nos links de produto. O relatório final estruturado está em `axe-results.json`.

O axe devolveu `incomplete` para a regra de contraste em elementos sobre imagens, superfícies com transparência e máscaras. Isso significa **verificação automática inconclusiva**, não aprovação nem falha de contraste. Elementos abrangidos: legendas da hero, etiquetas sobre produtos, selo de aluguer e rótulos sobre a imagem do equipamento. A revisão visual continua necessária. Não se declara conformidade WCAG integral com base neste resultado.

A ferramenta de análise foi obtida do pacote oficial npm `axe-core@4.14.0`, através de TLS, com SHA-512 conferido contra `dist.integrity`. Foi usada apenas nos testes; não integra a aplicação nem é carregada pelo protótipo.

Para repetir opcionalmente:

```sh
mkdir -p /tmp/surf-axe
npm --cache /tmp/surf-npm-cache pack axe-core@4.14.0 --pack-destination /tmp/surf-axe
tar -xzf /tmp/surf-axe/axe-core-4.14.0.tgz -C /tmp/surf-axe package/axe.min.js
python3 tests/check_accessibility.py --axe /tmp/surf-axe/package/axe.min.js
```

## Limites

O HTML autónomo final foi reconstruído e validado num contexto Chromium offline: cinco rotas, imagens/fontes incorporadas, escolha de variante e seleção, equipamento combinado e duração no resumo de aluguer. Foi necessário apenas um pedido de documento, satisfeito em memória; nenhum recurso auxiliar ou serviço externo. Zero erros de JavaScript. A abertura literal de um URL `file://` foi bloqueada pela política do navegador gerido antes de carregar o HTML e não é descrita como testada.

- Testado neste Chromium; Safari, Firefox e dispositivos físicos não foram executados.
- Sem validação de disponibilidade, catálogo real, pagamentos, encomendas, reservas ou condições comerciais: esses serviços não existem nesta demonstração.
- Não foi executada uma auditoria com leitor de ecrã nem uma avaliação integral WCAG.
- As referências externas e o Instagram ao vivo ficaram bloqueados pelo proxy. A sua análise documental e a leitura das capturas fornecidas estão distinguidas em `REFERENCIAS.md`.
- A revisão visual e as capturas do protótipo complementam estes testes; as imagens da costa e dos produtos continuam a ser conceptuais.
