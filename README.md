# novaforma-exportar-bi

Visual personalizado do Power BI com botão **Exportar**: o painel inteiro (cards, gráficos, matriz) vai para o Excel.

## Como funciona
1. O visual monta o `.xlsx` (cards, gráficos como imagem, matriz editável, aba de dados opcional).
2. Comprime o arquivo e abre o link da página de download com o arquivo no fragmento (`#`), que não é enviado ao servidor.
3. A página `download-page/` reconstrói o arquivo no navegador e baixa.

## Publicar a página
Settings > Pages > Branch `main`, pasta `/ (root)`. Endereço:
`https://gabrielpms2001.github.io/novaforma-exportar-bi/download-page/`

Mude em Formatar > Exportação > "Endereço da página de download" se for outro.

## Pastas
- `visual/` código-fonte do visual (`npm i && npx pbiviz package`)
- `download-page/` página que entrega o arquivo
- `dist/` visual empacotado (.pbiviz)

Não coloque dados reais da empresa neste repositório.
