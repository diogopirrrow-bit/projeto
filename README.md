# Surf Point — Ponto de Mar

Protótipo de apresentação de uma loja de surf: homepage, catálogo, quatro fichas de produto, seleção local e simulação de alugueres. Inclui uma página editorial de marca. HTML, CSS e JavaScript, sem dependências de execução, backend ou serviços pagos.

## Apresentar sem instalar nada

Abre **`Surf_Point_Abrir.html`** num navegador recente. O ficheiro inclui imagens, fontes, estilos e interações; pode ser partilhado sozinho e não depende de ligação à internet. O botão do Instagram é um link externo explícito, aberto apenas se o utilizador o escolher.

O Chromium gerido deste ambiente bloqueia URLs `file://` por política. Por isso, a abertura por duplo clique ficou por verificar aqui; o mesmo HTML autónomo foi validado num contexto offline, fornecido integralmente em memória e sem ficheiros auxiliares. Num equipamento com restrições semelhantes, usa o servidor local abaixo.

## Abrir as fontes e editar

Na pasta deste projeto, executa:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre o endereço local indicado pelo terminal no teu computador. Não é necessário `npm install` nem um processo de build para o site funcionar. Usa `Ctrl+C` para parar o servidor.

- `index.html`: estrutura, cabeçalho, rodapé e diálogo partilhado.
- `style.css`: fontes locais, cores, componentes e regras responsivas.
- `app.js`: conteúdo, produtos, navegação e interações locais.
- `assets/`: imagens fornecidas, fontes livres e respetivas licenças.
- `capturas/`: capturas reais do protótipo a 1440 e 390 px.

Depois de editar, recria a versão autónoma com Python 3.9 ou posterior:

```sh
python3 tools/build_standalone.py
```

O gerador não altera as fontes. Não edites o HTML autónomo: seria substituído na próxima geração. A seleção é guardada apenas no `sessionStorage` deste navegador, com alternativa em memória se não estiver disponível; não é enviada para nenhum serviço.

## Direção criativa e conteúdo

Foram consideradas **Atlântico Essencial**, mais atmosférica, e **Ponto de Mar**, mais gráfica e centrada no equipamento. Foi escolhida a segunda e ajustada às capturas de `@surfpointstore_`: lettering estreito, contraste preto/branco, símbolo circular e protagonismo da loja e das pranchas. O laranja assinala a ação principal. A navegação dá prioridade à loja e distingue o percurso de alugueres.

A marca tipográfica e o símbolo são uma interpretação provisória, não os ficheiros oficiais da identidade. As fotografias do Instagram não foram extraídas para o site. O material fotográfico usado provém dos anexos e foi originalmente gerado por IA. A costa não representa uma praia comprovada; os quatro artigos não representam stock real.

Produtos, nomes, variantes e preços são ilustrativos. Espessura do fato e medidas das pranchas são exemplos, não especificações comerciais confirmadas. Construção, volume, composição e guias de tamanhos estão por validar. Tarifas, durações, cauções, recolha, entregas e devoluções não são condições comerciais. Não existem pagamentos, autenticação, base de dados, reservas, tracking, formulários enviados, descontos ou avaliações inventadas.

## Verificação e documentação

- [Testes e limitações](docs/TESTES.md): verificações executadas e resultados, separados das verificações pendentes.
- [Referências e decisões](docs/REFERENCIAS.md): 58 Surf, Quiksilver, Hurley, Semente, Finisterre, Mollusk e needessentials; base documental e tentativas de consulta atual. A rede recusou o acesso aos sites e ao Instagram, pelo que não se afirma ter feito uma auditoria visual externa.
- [Leitura dos anexos](docs/ANEXOS.md): requisitos confirmados, propostas e decisões não aprovadas.
- [Recursos e licenças](docs/RECURSOS.md): proveniência de imagens e fontes locais.
- [Apresentação de cinco minutos](docs/APRESENTACAO.md): percurso de demonstração e lista do conteúdo real a confirmar.

Os testes automatizados opcionais usam Python com Playwright 1.62.0 e Chromium. No ambiente preparado, com o servidor ativo:

```sh
python3 tests/test_browser.py
```

Noutro ambiente, instala Playwright num ambiente virtual e disponibiliza Chromium; `CHROMIUM_PATH` permite indicar o executável e `SURF_POINT_BASE_URL` permite mudar a origem local. Estas ferramentas servem apenas para desenvolvimento e teste, não são necessárias para apresentar o protótipo.

## Próximo passo

Apresentar a visão ao proprietário e confirmar interesse, identidade, catálogo, fotografias autorizadas e condições. Não foi feita publicação pública ou alteração de contas externas. A futura plataforma comercial é uma decisão separada; este código não promete instalação direta em Shopify ou noutra plataforma de produção.
