# Referências e decisões de design

Pesquisa nesta sessão: 21 de outubro de 2026. O conteúdo fornecido em `02_Design_e_Experiencia_Digital.pdf`, pp. 2–3 e 8, foi lido como estudo preliminar, não como instrução de produção nem design aprovado.

## Acesso efetivamente verificado

Existe navegador Chromium com Playwright. Foram tentados os sites abaixo no navegador, com a verificação TLS ativa. Todas as navegações externas falharam antes de receber conteúdo (`net::ERR_TUNNEL_CONNECTION_FAILED`). Uma segunda verificação com Python urllib devolveu `Tunnel connection failed: 403 Forbidden`. Isto indica recusa no percurso de proxy/egress; não foi interpretado como defeito dos sites.

Não foi possível observar agora as interfaces reais, páginas interiores ou versões mobile destes concorrentes. Não se produziram capturas falsas nem se apresentam inferências como observações visuais. Os princípios abaixo derivam da análise crítica do estudo documental fornecido e de decisões próprias para este protótipo.

| Marca | URLs tentados | Base documental fornecida; princípio adaptável |
| --- | --- | --- |
| 58 Surf | https://58surf.com/ · https://58surf.com/prt/surfboards?product_labels=NEW | O estudo descreve categorias técnicas, campanhas e apoio à escolha. Adaptar acessos diretos às categorias de equipamento e uma seleção curta. A extração original do catálogo era incompleta; não se inferem resultados de conversão. |
| Quiksilver | https://www.quiksilver.pt/ · https://www.quiksilver.pt/homem-surf-fatos/ | O estudo descreve filtros de tamanho/espessura, guia e informação de entrega. Adaptar controlos relevantes, variantes visíveis e condições claramente identificadas; evitar um megamenu desproporcionado à coleção de demonstração. |
| Hurley | https://eu.hurley.com/ · https://eu.hurley.com/collections/men-wetsuits | O estudo descreve catálogo, tamanhos, cores e preços. Adaptar leitura rápida de produto, variante e preço; manter as imagens do equipamento como protagonista. |
| Semente Surfboards | https://www.semente.pt/en/ · https://www.semente.pt/en/surfboard/mid-length-2/ | O estudo descreve modelos, equipa e dimensões/volume. Adaptar explicações curtas sobre a escolha; não inventar medidas técnicas, litros, construção ou história da Surf Point. |
| Finisterre | https://finisterre.com/ | O estudo descreve cuidados, reparação e serviços ao longo da vida do produto. Adaptar a clareza do conteúdo de apoio; não anunciar serviços ou alegações ambientais sem confirmação. |
| Mollusk | https://mollusksurfshop.com/ | O estudo descreve separação entre Surf/Beach/vestuário e conteúdo cultural. Adaptar uma sequência editorial ligada ao surf, com entradas comerciais claras; não copiar identidade, fotografia ou layout. |
| needessentials | https://needessentials.com/ | O estudo descreve guias de tamanhos/temperatura e conteúdo técnico. Adaptar ajuda à escolha que admita o que falta validar. |

A pesquisa documental original está datada de 20/10/2026 e declara expressamente que não testou mobile, velocidade, animações, cores ou fontes exatas. Essas limitações mantêm-se para as referências nesta entrega. A verificação visual do nosso próprio protótipo é um trabalho separado, registado em `TESTES.md` quando executado.

## Duas direções consideradas

1. **Atlântico Essencial:** verdes marinhos, tons de areia, composição calma e fotografia panorâmica. Aproxima-se do protótipo anexado; exige controlar a tendência para um catálogo de lifestyle genérico.
2. **Ponto de Mar:** cultura de surf independente, tipografia sans expressiva, contraste entre fotografia e superfícies gráficas, equipamento isolado com enquadramento consistente, cor usada como sinal de ação e navegação. Dá mais protagonismo ao material e permite uma loja contemporânea sem depender de história inventada.

A implementação pode combinar o rigor comercial da segunda direção com a atmosfera atlântica do material autorizado. O nome e marca tipográfica são propostas reversíveis; nenhuma decisão constitui identidade oficial aprovada. Compra é a intenção principal; aluguer tem percurso próprio e distinto. Não foram reutilizados logótipos, textos comerciais, fotografias nem código dos concorrentes.

## Para uma futura revisão das referências

Quando houver acesso de rede, observar home, catálogo e produto em 1440 e 390 px, incluindo filtros, variantes, menu e hierarquia. Comparar os princípios com o protótipo, sem alargar o âmbito nem substituir os testes locais por esta pesquisa.

## Direção ajustada às capturas fornecidas do Instagram

O utilizador acrescentou capturas do perfil **@surfpointstore_** e pediu que a direção se baseasse nessa página. A leitura das capturas fornecidas, comunicada pela revisão visual do agente principal, tem prioridade sobre as hipóteses do estudo anterior:

- O lettering `SURFPOINT` da fachada é fino, alto/condensado, com um `O` que lembra um alvo circular; a presença dominante é preto sobre branco.
- As capturas mostram lojas, racks de equipamento, pessoas e material real. Sustentam uma direção centrada na cultura e no equipamento de surf, em vez de uma linguagem de resort ou de luxo genérico.
- A bio visível menciona “Ericeira | Peniche | Vila do Bispo”; aparecem destaques como Ericeira, Rentals, Hot Deal, Boards, Peniche e Questions. Isto descreve as capturas; não confirma moradas exatas, condições, stock, parcerias ou âmbito operacional de cada localização.

Em 21/10/2026 tentou-se também abrir https://www.instagram.com/surfpointstore_/ no Chromium. O acesso ao vivo falhou com `net::ERR_TUNNEL_CONNECTION_FAILED`; urllib confirmou `Tunnel connection failed: 403 Forbidden`. Portanto, não se afirma ter navegado no perfil real nem verificado publicações recentes, links, seguidores ou outras informações ausentes das capturas.

**Direção escolhida: Ponto de Mar.** Base preto/tinta e branco/giz, tipografia condensada inspirada na sinalética observada, laranja de sinalização como acento e equipamento em primeiro plano. A composição, a tipografia digital e o tratamento de produto são uma interpretação proposta para a demonstração, não um novo manual oficial da marca. A imagem do `O` e o lettering não devem ser tratados como uma reprodução vetorial aprovada.

As capturas servem de referência para identidade e contexto. O seu envio não é tomado como autorização geral para extrair e reutilizar fotografias de publicações ou retratos no protótipo. Não se deduzem contactos, história, avaliações, descontos ou condições de aluguer a partir destes elementos.
