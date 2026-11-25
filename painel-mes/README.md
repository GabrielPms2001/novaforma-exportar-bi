# Painel Mês (NovaForma) — v1.1

Visual personalizado da página "PAINEL DE VENDAS - MÊS": card VENDIDO NO MÊS, 6 medidores por família,
título e tabela POSITIVAÇÃO | MIX (MÊS). Botões **Filtros** (novo, filtra a página toda) e **Exportar ▾**
no canto superior direito.

Pacote: `dist/PainelMes_v1.1.0.pbiviz` · GUID `painelMesNovaForma8D2E3F4A5B6C70819203A4B5C6D7E8FA1`
(o mesmo da v1.0: ao importar, o Power BI troca o visual da página pela v1.1).

## v1.1 — o que mudou
- Entrou o botão **Filtros** ao lado do Exportar (mesmo mecanismo do Pedido Diário v2.0 / Reps Sem Pedidos).
  Card, medidores, tabela, faixas, Exportar e estilos continuam iguais.
- Formatar ganhou o cartão **Filtros** (mostrar botão, "Filtrar também este visual", colunas-alvo).
- Exportar: o Excel traz no rodapé o período e os filtros aplicados (como nos outros visuais).
- Medida: **substitua** `Painel Mês (visual)` pelo conteúdo de `Painel_Mes_medida.dax`.

## Como montar no Power BI
1. Atualize a medida `Painel Mês (visual)` na tabela `@Medida` com o conteúdo de `Painel_Mes_medida.dax`.
2. Importe o `.pbiviz`. Campos (não mudaram):
   - **Representante** ← `d_Representantes[Nome do Rep]`
   - **Painel Mês (medida)** ← `[Painel Mês (visual)]`
3. Formatar: Título, Medidores, Fundo do visual, Filtros, Exportação.

## Card e medidores com filtro (decisão da v1.1)
Na v1.0 os totais do card e dos medidores usavam `REMOVEFILTERS ( d_Representantes )` (visão geral da empresa) e a
linha que leva o cabeçalho era o 1º representante do modelo inteiro. Com filtro de Supervisão/UF/Representante isso
dava dois problemas: os indicadores não mudavam e, se esse 1º representante saísse do filtro, o cabeçalho sumia.

Na v1.1:
- Os 9 números do cabeçalho (vendido no mês, clientes do card, Reps Mês, Reps Mês por família e **Reps Painel**, o máximo
  dos medidores) usam `ALLSELECTED ( d_Representantes )`: seguem os filtros da página, das segmentações e do botão
  Filtros, como uma segmentação faria. Ex.: UF = ES → card e medidores só dos representantes do ES, máximo = reps do ES.
- O cabeçalho vai no 1º representante **entre os selecionados** (`ALLSELECTED`), então nunca some.
- Família e Material (colunas das fatos) e o período (`[Data Ref]`) já entravam pelo contexto e continuam entrando.
- Regras de negócio sem mudança: universo `Ativo SAP = TRUE`, `Código do Vendedor <> "#"`, nome sem "VENDA" (`[Reps Painel]`);
  `[CLI Mês (Cartão)]` e `[Vendido Mês]` continuam contando VENDA DIRETA (regra do BW), agora dentro do filtro.
- **Sem nenhum filtro os números são idênticos à v1.0** (conferido no modelo: 676 linhas, cabeçalho igual).

## Período
1º dia do mês da `[Data Ref]` até a `[Data Ref]`. A `[Data Ref]` só muda quando há **um** Dia, **um** Mês e **um** Ano
escolhidos (no botão Filtros ou em segmentações); com só Mês/Ano o período continua sendo o mês de hoje. O painel de
filtros mostra o período no rodapé e avisa quando a seleção de datas não forma uma data.

## Contrato da medida
Uma linha por representante: `nome|uf|sup|cliMes|FB|FC|CT|PT|AP|vendidoMes`.
Na 1ª linha (1º representante em ordem alfabética entre os selecionados) vem, depois de `~`:
`vendidoMes|cliMesCartao|repsMes|repsFB|repsFC|repsCT|repsPT|repsAP|repsPainel|dataRef|anos|meses|dias|supervisões|representantes|ufs|famílias|materiais`
— `dataRef` em `yyyy-mm-dd`; as 8 listas com valores separados por `^` (alimentam o botão Filtros e ignoram o filtro do
próprio campo; Representante segue Supervisão/UF, Material segue Família). A v1.0 do visual lê só os 9 números, então
funciona com a medida nova; a v1.1 com a medida antiga funciona, mas as listas do botão Filtros ficam vazias.

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
os outros visuais filtram mas este não). Família/Material não tiram representantes da tabela (as fatos não filtram
`d_Representantes`): quem não vendeu na família aparece com CLI MÊS "X", como já acontecia.

## Exportar
Botão **Exportar ▾**: Card, Medidores (imagem), Tabela e/ou Aba com dados brutos. O visual manda os dados para
`download-page/` (v2.1, tipo `painelMes`), que monta o `.xlsx`. Novidade: `periodo` e `filtros` vão junto e saem no
rodapé da planilha (links da v1.0 continuam funcionando, sem rodapé). Sem a página: exportação do Power BI
(`downloadService`) ou download direto.

## Build
```bash
npm i   # ou use node_modules de outro visual
npx --yes powerbi-visuals-tools@latest package
```
API 5.11.1, sem `innerHTML`, `fetch`, CDN ou fontes externas (Anton embutida em `style/anton.less`).
O botão Filtros fica em `src/filtros.ts` (mesmo arquivo no Painel Dia).
