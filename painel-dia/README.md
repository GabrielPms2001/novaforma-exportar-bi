# Painel Dia (NovaForma) — v1.2

Visual personalizado da página "PAINEL DE VENDAS - DIA": cards VENDIDO NO DIA e VENDIDO NO MÊS, 6 medidores por família (representantes
que venderam no dia), título e tabela POSITIVAÇÃO DIÁRIA (CLI DIA, CLI MÊS) | MIX (MÊS). Botões **Filtros** (novo, filtra a página toda) e **Exportar ▾**
no canto superior direito.

Pacote: `dist/PainelDia_v1.2.0.pbiviz` · GUID `painelDiaNovaForma7C1D2E3F4A5B60718293A4B5C6D7E8F90`
(o mesmo da v1.1: ao importar, o Power BI troca o visual da página pela v1.2).

## v1.2 — o que mudou
- Entrou o botão **Filtros** ao lado do Exportar (mesmo mecanismo do Pedido Diário v2.0 / Reps Sem Pedidos).
  Card, medidores, tabela, faixas, Exportar e estilos continuam iguais.
- Formatar ganhou o cartão **Filtros** (mostrar botão, "Filtrar também este visual", colunas-alvo).
- Exportar: o Excel traz no rodapé o período e os filtros aplicados (como nos outros visuais).
- Medida: **substitua** `Painel Dia` pelo conteúdo de `Painel_Dia_medida.dax`.

## Como montar no Power BI
1. Atualize a medida `Painel Dia` na tabela `@Medida` com o conteúdo de `Painel_Dia_medida.dax`.
2. Importe o `.pbiviz`. Campos (não mudaram):
   - **Representante** ← `d_Representantes[Nome do Rep]`
   - **Painel Dia (medida)** ← `[Painel Dia]`
3. Formatar: Título, Medidores, Fundo do visual, Filtros, Exportação.

## Card e medidores com filtro (decisão da v1.2)
Na v1.1 os totais do card e dos medidores usavam `REMOVEFILTERS ( d_Representantes )` (visão geral da empresa) e a
linha que leva o cabeçalho era o 1º representante do modelo inteiro. Com filtro de Supervisão/UF/Representante isso
dava dois problemas: os indicadores não mudavam e, se esse 1º representante saísse do filtro, o cabeçalho sumia.

Na v1.2:
- Os 11 números do cabeçalho (vendido e clientes no dia, vendido e clientes no mês, Reps Dia, Reps Dia por família e
  **Reps Painel**, o máximo dos medidores) usam `ALLSELECTED ( d_Representantes )`: seguem os filtros da página, das segmentações e do botão
  Filtros, como uma segmentação faria. Ex.: UF = ES → card e medidores só dos representantes do ES, máximo = reps do ES.
- O cabeçalho vai no 1º representante **entre os selecionados** (`ALLSELECTED`), então nunca some.
- Família e Material (colunas das fatos) e o período (`[Data Ref]`) já entravam pelo contexto e continuam entrando.
- Regras de negócio sem mudança: universo `Ativo SAP = TRUE`, `Código do Vendedor <> "#"`, nome sem "VENDA" (`[Reps Painel]`);
  `[CLI Mês (Cartão)]` e `[Vendido Mês]` continuam contando VENDA DIRETA (regra do BW), agora dentro do filtro.
- Continua saindo só representante com movimento (CLI DIA > 0 ou CLI MÊS), mais a linha que leva o cabeçalho.
- **Sem nenhum filtro os números são idênticos à v1.1** (conferido no modelo: 172 linhas, cabeçalho igual).

## Dia × filtros Dia/Mês/Ano
- "Dia" (VENDIDO NO DIA, CLI DIA, medidores) = a `[Data Ref]`; "Mês" (CLI MÊS, mix) = 1º dia do mês da `[Data Ref]` até ela.
- A `[Data Ref]` só muda quando há **um** Dia, **um** Mês e **um** Ano escolhidos (no botão Filtros ou em segmentações).
  Ex.: Dia 12 + novembro + 2026 → dia 12/11/2026 e mês 01/11 a 12/11/2026. Só Dia 12 (sem Mês/Ano), dois dias ou só o
  Mês → a data continua sendo hoje (regra da `[Data Ref]`, não mudou).
- O painel de filtros mostra no rodapé "Dia: … · Mês: … a …" e avisa quando a seleção de datas não forma uma data.

## Contrato da medida
Uma linha por representante com movimento: `nome|uf|sup|cliDia|cliMes|FB|FC|CT|PT|AP|vendidoDia`.
Na 1ª linha (1º representante em ordem alfabética entre os selecionados) vem, depois de `~`:
`vendidoDia|cliDia|vendidoMes|cliMesCartao|repsDia|repsFB|repsFC|repsCT|repsPT|repsAP|repsPainel|dataRef|anos|meses|dias|supervisões|representantes|ufs|famílias|materiais`
— `dataRef` em `yyyy-mm-dd`; as 8 listas com valores separados por `^` (alimentam o botão Filtros e ignoram o filtro do
próprio campo; Representante segue Supervisão/UF, Material segue Família). A v1.1 do visual lê só os 11 números, então
funciona com a medida nova; a v1.2 com a medida antiga funciona, mas as listas do botão Filtros ficam vazias.

## Botão Filtros (filtra a página toda)
8 campos (Ano, Mês, Dia, Supervisão, Representante, Família, Material, UF), busca, "Marcar visíveis", "Limpar",
"Limpar tudo", "Aplicar", Esc fecha, contagem de campos filtrados no botão.
`host.applyJsonFilter([...BasicFilter], "general", "filter", merge)` filtra os outros visuais e a mesma lista vai para
`"general", "selfFilter"` (Formatar > Filtros > "Filtrar também este visual"). Os filtros voltam ao reabrir o relatório.

| Campo | Coluna padrão (Formatar > Filtros) |
|---|---|
| Ano | `d_Calendario[Ano]` |
| Mês | `d_Calendario[Mês]` |
| Dia | `d_Calendario[Dia]` |
| Supervisão | `d_Representantes[Supervisão]` |
| Representante | `d_Representantes[Nome do Rep]` |
| Família | `f_Faturamento[Família]; f_Carteira[Família]` |
| Material | `f_Faturamento[Material]; f_Carteira[Material]` |
| UF | `d_Representantes[UF]` |

Limitações: as mesmas do Reps Sem Pedidos (sem poços para os 8 campos; se `selfFilter` não funcionar no seu Power BI,
os outros visuais filtram mas este não). Família/Material não filtram `d_Representantes`; como a tabela só mostra quem
teve movimento, quem não vendeu na família escolhida sai da tabela.

## Exportar
Botão **Exportar ▾**: Cards, Medidores (imagem), Tabela e/ou Aba com dados brutos. O visual manda os dados para
`download-page/` (v2.1, tipo `painelDia`), que monta o `.xlsx`. Novidade: `periodo` e `filtros` vão junto e saem no
rodapé da planilha (links da v1.1 continuam funcionando, sem rodapé). Sem a página: exportação do Power BI
(`downloadService`) ou download direto.

## Build
```bash
npm i   # ou use node_modules de outro visual
npx --yes powerbi-visuals-tools@latest package
```
API 5.11.1, sem `innerHTML`, `fetch`, CDN ou fontes externas (Anton embutida em `style/anton.less`).
O botão Filtros fica em `src/filtros.ts` (mesmo arquivo do Painel Mês). A pasta `ponte/` é a página antiga (v1.6);
a página oficial é `pagina/` na raiz do repositório.
