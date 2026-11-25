# novaforma-exportar-bi

Visual personalizado do Power BI com botão **Exportar**: o painel inteiro (cards, gráficos, matriz) vai para o Excel.

## Como funciona
1. O visual envia só os dados (texto pequeno, comprimido) no link.
2. A página `download-page/` redesenha os gráficos, monta o `.xlsx` no navegador e baixa. O link fica com poucos milhares de caracteres.
3. Para gerar a página depois de mexer no código: `visual/ponte/build.sh` (copie o resultado para `download-page/index.html`).

## Publicar a página
Settings > Pages > Branch `main`, pasta `/ (root)`. Endereço:
`https://gabrielpms2001.github.io/novaforma-exportar-bi/download-page/`

Mude em Formatar > Exportação > "Endereço da página de download" se for outro.

## Pastas
- `visual/` código-fonte do visual (`npm i && npx pbiviz package`)
- `download-page/` página que entrega o arquivo
- `dist/` visual empacotado (.pbiviz)

Não coloque dados reais da empresa neste repositório.

## Painel Dia
`painel-dia/` tem o visual "Painel Dia (NovaForma)" (botão Exportar com menu) e a medida `Painel_Dia_medida.dax`. A página `download-page/` atende os dois visuais. Para regerar a página: `painel-dia/ponte/build.sh`.

## Pedido Diário
`pedido-diario/` tem o visual "Pedido Diário (NovaForma)": card VENDIDO NO MÊS + 6 medidores (igual ao Painel Mês) e a matriz POSITIVAÇÃO DIÁRIA - MÊS (clientes positivados por representante em cada dia do mês com venda). Medida: `pedido-diario/Pedido_Diario_medida.dax`. Pacote: `dist/PedidoDiario_v1.0.pbiviz`. A página `download-page/` (v1.8) atende os quatro tipos (painel original, Painel Dia, Painel Mês, Pedido Diário). Para regerar a página: `pagina/build.sh`.
