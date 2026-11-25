# Pedido Diário (NovaForma) — v2.0

Visual personalizado separado (3ª página). Mostra **só a tabela** da aba "PEDIDO DIÁRIO":
faixa azul-marinho com o título `POSITIVAÇÃO DIÁRIA - MÊS` (editável) e a matriz
REPRESENTANTES | UF | SUP | um dia por coluna (clientes positivados no dia; dia sem cliente em rosa).
Botões **Filtros** (filtra a página toda) e **Exportar ▾** na faixa, à direita.

Pacote: `dist/PedidoDiario_v2.0.pbiviz` · GUID `pedidoDiarioNovaForma9F411DBD7B4C4C528782B486968DD46E`
(o mesmo da v1.0: ao importar, o Power BI troca o visual da página pela v2.0).

## O que mudou da v1.0
- Saíram o card VENDIDO NO MÊS e os 6 medidores (e o cartão Formatar > Medidores).
- Título agora numa faixa azul-marinho (texto branco), editável em Formatar > Título.
- Entrou o botão **Filtros** (mesmo mecanismo do Reps Sem Pedidos).
- Exportar: só "Tabela" e "Aba com dados brutos" (Excel sem imagens), com período e filtros no rodapé.
- Medida: saíram os totais do cabeçalho (vendido, clientes, reps por família); entraram a Data Ref e as
  listas dos filtros. **Substitua a medida** `Pedido Diário (visual)` pelo conteúdo de `Pedido_Diario_medida.dax`.

## Como montar no Power BI
1. Atualize a medida `Pedido Diário (visual)` na tabela `@Medida` com o conteúdo de `Pedido_Diario_medida.dax`.
2. Importe o `.pbiviz` e arraste:
   - **Representante** ← `d_Representantes[Nome do Rep]`
   - **Pedido Diário (medida)** ← `[Pedido Diário (visual)]`
3. Formatar: Título (mostrar, texto), Fundo do visual, Filtros, Exportação.

## Regras (as mesmas da v1.0)
- Universo: `d_Representantes` com `Ativo SAP = TRUE`, `Código do Vendedor <> "#"` e nome sem "VENDA".
  Sem filtro de OPER.INTERNA nem de `Bloq central compras` na medida (use filtro de página, se quiser).
- Célula do dia = clientes distintos positivados no dia (faturamento + carteira, mesma regra de `[CLI Mês]`).
- Colunas = dias do mês com algum cliente positivado pelos representantes selecionados, até a `[Data Ref]`.
- Ordem: CLI MÊS (desc), depois vendido no mês (desc), depois nome.
- Período: 1º dia do mês da `[Data Ref]` até a `[Data Ref]`. A `[Data Ref]` só muda quando há **um** Dia,
  **um** Mês e **um** Ano escolhidos; com só Mês/Ano o período continua sendo o mês de hoje (regra da `[Data Ref]`).
- Supervisão, Representante, UF, Família e Material filtram pelo contexto normal.

## Contrato da medida
Uma linha por representante: `nome|uf|sup|cliMes|vendidoMes|dias` (`dias` = `dia:clientes` separados por vírgula).
Na 1ª linha (1º representante em ordem alfabética entre os selecionados) vem, depois de `~`:
`dataRef|anos|meses|dias|supervisões|representantes|ufs|famílias|materiais|diasDoMes` — `dataRef` em `yyyy-mm-dd`,
as 8 listas com valores separados por `^` (alimentam o botão Filtros e ignoram o filtro do próprio campo;
Representante segue Supervisão/UF, Material segue Família) e `diasDoMes` separados por vírgula.

## Botão Filtros (filtra a página toda)
Igual ao Reps Sem Pedidos (ver `reps-sem-pedidos/README.md`): 8 campos (Ano, Mês, Dia, Supervisão, Representante,
Família, Material, UF), busca, "Marcar visíveis", "Limpar", "Limpar tudo", "Aplicar", Esc fecha, contagem no botão.
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

Limitações: as mesmas do Reps Sem Pedidos (sem poços para os 8 campos; se `selfFilter` não funcionar no seu
Power BI, os outros visuais filtram mas a tabela não).

## Exportar
Botão **Exportar ▾**: Tabela (células editáveis) e/ou Aba Dados (CLI MÊS, um dia por coluna e vendido no mês).
O visual manda só os dados (JSON deflate-raw em base64url no `#`) para `download-page/` (v2.0, tipo `pedidoDiario`),
que monta o `.xlsx` sem imagens. Links da v1.0 continuam funcionando (card/medidores são ignorados).
Sem a página: exportação do Power BI (`downloadService`) ou download direto.

## Build
```bash
npm i   # ou use node_modules de outro visual
npx --yes powerbi-visuals-tools@latest package
```
API 5.11.1, sem `innerHTML`, `fetch`, CDN ou fontes externas (Anton embutida em `style/anton.less`).
