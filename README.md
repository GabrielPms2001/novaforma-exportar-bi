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
`painel-dia/` tem o visual "Painel Dia (NovaForma)" **v1.2**: cards, 6 medidores e tabela POSITIVAÇÃO DIÁRIA | MIX (MÊS), com os botões **Filtros** (novo, filtra a página toda; mesmo mecanismo do Pedido Diário) e **Exportar**. Card e medidores agora seguem os filtros (Supervisão, Representante, UF, Família, Material, data). Medida: `painel-dia/Painel_Dia_medida.dax`. Pacote: `dist/PainelDia_v1.2.0.pbiviz` (mesmo GUID: substitui o visual). Instruções: `painel-dia/README.md`.

## Painel Mês
`painel-mes/` tem o visual "Painel Mês (NovaForma)" **v1.1**: card, 6 medidores e tabela POSITIVAÇÃO | MIX (MÊS), com os botões **Filtros** (novo, filtra a página toda) e **Exportar**. Card e medidores agora seguem os filtros. Medida: `painel-mes/Painel_Mes_medida.dax`. Pacote: `dist/PainelMes_v1.1.0.pbiviz` (mesmo GUID: substitui o visual). Instruções: `painel-mes/README.md`. O botão Filtros dos dois painéis fica em `src/filtros.ts`.

## Pedido Diário
`pedido-diario/` tem o visual "Pedido Diário (NovaForma)" **v2.0**: só a tabela POSITIVAÇÃO DIÁRIA - MÊS (faixa azul-marinho com o título + matriz REPRESENTANTES | UF | SUP | dias, clientes positivados por representante em cada dia do mês com venda) e o botão **Filtros**, igual ao do Reps Sem Pedidos (filtra a página toda). Sem card e sem medidores. Medida: `pedido-diario/Pedido_Diario_medida.dax`. Pacote: `dist/PedidoDiario_v2.0.pbiviz` (mesmo GUID da v1.0: substitui o visual). Instruções: `pedido-diario/README.md`.

## Reps Sem Pedidos
`reps-sem-pedidos/` tem o visual "Reps Sem Pedidos (NovaForma)": só a tabela REPS SEM PEDIDOS - MÊS (representantes ativos sem cliente positivado no mês, "NÃO VENDEU") e o botão **Filtros**, que filtra a página toda (Ano, Mês, Dia, Supervisão, Representante, Família, Material, UF). Medida: `reps-sem-pedidos/Reps_Sem_Pedidos_medida.dax`. Pacote: `dist/RepsSemPedidos_v1.0.pbiviz`. Instruções e limitações do filtro: `reps-sem-pedidos/README.md`. A página `download-page/` (v2.1) atende os cinco visuais (painel original, Painel Dia, Painel Mês, Pedido Diário v1/v2, Reps Sem Pedidos); Painel Dia v1.2 e Painel Mês v1.1 mandam também período e filtros, que saem no rodapé do Excel. Para regerar a página: `pagina/build.sh`.
