# Reps Sem Pedidos (NovaForma) — v1.0

Visual personalizado separado (4ª página). Mostra **só a tabela** da aba "REPS SEM PEDIDOS":
título `REPS SEM PEDIDOS - MÊS` (editável), faixa azul `POSITIVAÇÃO` (editável) e as colunas
REPRESENTANTES | UF | SUP | CLI MÊS. CLI MÊS mostra **NÃO VENDEU** (fundo rosa, texto vermelho) para
cada representante ativo sem nenhum cliente positivado no período. Ordem alfabética.

Pacote: `dist/RepsSemPedidos_v1.0.pbiviz` · GUID `repsSemPedidosNovaForma1C95BC9145E74EDFAD85D9FD7AC1C142`

## Como montar no Power BI
1. Crie a medida `Reps Sem Pedidos (visual)` na tabela `@Medida` com o conteúdo de `Reps_Sem_Pedidos_medida.dax`.
2. Importe o `.pbiviz` e arraste:
   - **Representante** ← `d_Representantes[Nome do Rep]`
   - **Reps Sem Pedidos (medida)** ← `[Reps Sem Pedidos (visual)]`
3. Formatar: Título (mostrar, texto, texto da faixa), Fundo do visual, Filtros, Exportação.

## Regra (igual ao Painel Mês)
- Universo: `d_Representantes` com `Ativo SAP = TRUE`, `Código do Vendedor <> "#"` e nome sem "VENDA".
- CLI MÊS = medida `[CLI Mês]` (clientes distintos de faturamento + carteira, mês até a `[Data Ref]`).
- Lista = representantes do universo com `[CLI Mês]` vazio no contexto de filtro atual.
- Período: 1º dia do mês da `[Data Ref]` até a `[Data Ref]`. A `[Data Ref]` só muda quando há **um** Dia,
  **um** Mês e **um** Ano escolhidos; com só Mês/Ano o período continua sendo o mês de hoje (regra da `[Data Ref]`).
- O Painel Mês de referência (37 reps de SUP-ES/MG) bate com `d_Representantes[Bloq central compras] = "#"`.
  Se a página não tiver esse filtro, entram também os representantes bloqueados ("X"). Ponha esse filtro
  na página (ou no visual) para ficar igual ao Painel.

## Contrato da medida
Uma linha por representante do universo: `nome|uf|sup|cliMes` (cliMes vazio = não vendeu).
Na 1ª linha (1º representante em ordem alfabética entre os selecionados) vem, depois de `~`:
`dataRef|anos|meses|dias|supervisões|representantes|ufs|famílias|materiais` — `dataRef` em `yyyy-mm-dd`,
cada lista com os valores separados por `^`. As listas alimentam o botão **Filtros** e ignoram o filtro
do próprio campo (como uma segmentação). Representante segue a Supervisão/UF escolhidas; Material segue a Família.

## Botão Filtros (filtra a página toda)
Painel dentro do visual com 8 campos: Ano, Mês, Dia, Supervisão, Representante, Família, Material, UF.
Cada campo: busca, lista com seleção múltipla, "Marcar visíveis", "Limpar". "Aplicar" envia os filtros;
"Limpar tudo" remove todos. O botão mostra quantos campos estão filtrados.

Como funciona: `host.applyJsonFilter([...BasicFilter], "general", "filter", merge)` filtra os **outros visuais**
da página (igual a uma segmentação) e a mesma lista vai para `"general", "selfFilter"` para a medida do
próprio visual recalcular (Formatar > Filtros > "Filtrar também este visual"). Os filtros voltam ao abrir o
relatório e com indicadores (`jsonFilters`).

Colunas filtradas (Formatar > Filtros, formato `Tabela[Coluna]`, várias separadas por `;`):

| Campo | Coluna padrão |
|---|---|
| Ano | `d_Calendario[Ano]` |
| Mês | `d_Calendario[Mês]` |
| Dia | `d_Calendario[Dia]` |
| Supervisão | `d_Representantes[Supervisão]` |
| Representante | `d_Representantes[Nome do Rep]` |
| Família | `f_Faturamento[Família]; f_Carteira[Família]` |
| Material | `f_Faturamento[Material]; f_Carteira[Material]` |
| UF | `d_Representantes[UF]` |

Família e Material filtram as duas fatos porque `d_Material`/`d_Familia` não têm relação com elas.

### Limitações
- **Sem poços para os 8 campos.** Um visual faz uma consulta só e recebe um DataView só; colocar Ano, Mês,
  Material etc. como campos de agrupamento multiplicaria as linhas (representante × ano × mês × material...).
  Por isso os valores vêm da própria medida (cabeçalho) e as colunas alvo ficam em Formatar > Filtros.
  Se trocar a coluna em Formatar, ajuste também a lista correspondente na medida.
- Vários filtros saem numa chamada só (lista de BasicFilter, aceita pela API 5.11: `IFilter[]`). Se alguma
  versão do Power BI aplicar só um, o sintoma é o botão mostrar N filtros e a página filtrar por um só.
- `selfFilter` é o jeito suportado de o visual filtrar a si mesmo; se não funcionar no seu Power BI,
  os outros visuais filtram, mas a tabela não. Use então uma segmentação nativa para a tabela.
- Segmentações nativas da página continuam valendo junto com os filtros do botão.

## Exportar
Botão **Exportar ▾**: Tabela (células editáveis) e/ou Aba com dados brutos. O visual manda só os dados
(JSON deflate-raw em base64url no `#`, link ≈ 700 caracteres) para `download-page/` (v1.9, tipo
`repsSemPedidos`), que monta o `.xlsx`. Sem a página: exportação do Power BI (`downloadService`) ou download direto.
No Excel: título, faixa, cabeçalho, linhas "NÃO VENDEU" e, abaixo, data de geração, período e filtros aplicados.

## Build
```bash
npm i   # ou use node_modules de outro visual
npx --yes powerbi-visuals-tools@latest package
```
API 5.11.1, sem `innerHTML`, `fetch`, CDN ou fontes externas (Anton embutida em `style/anton.less`).
