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
