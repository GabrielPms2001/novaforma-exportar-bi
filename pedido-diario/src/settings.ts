import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import Card = formattingSettings.SimpleCard;
import Model = formattingSettings.Model;

class TituloCard extends Card {
    name = "titulo";
    displayName = "Título";
    mostrar = new formattingSettings.ToggleSwitch({ name: "mostrar", displayName: "Mostrar", value: true });
    texto = new formattingSettings.TextInput({ name: "texto", displayName: "Texto", value: "POSITIVAÇÃO DIÁRIA - MÊS", placeholder: "Título" });
    slices = [this.mostrar, this.texto];
}

class MedidoresCard extends Card {
    name = "medidores";
    displayName = "Medidores";
    inicioAmarelo = new formattingSettings.NumUpDown({ name: "inicioAmarelo", displayName: "Início do amarelo (%)", value: 55 });
    inicioVerde = new formattingSettings.NumUpDown({ name: "inicioVerde", displayName: "Início do verde (%)", value: 72 });
    slices = [this.inicioAmarelo, this.inicioVerde];
}

class FundoCard extends Card {
    name = "fundo";
    displayName = "Fundo do visual";
    mostrar = new formattingSettings.ToggleSwitch({ name: "mostrar", displayName: "Mostrar", value: true });
    cor = new formattingSettings.ColorPicker({ name: "cor", displayName: "Cor", value: { value: "#FFFFFF" } });
    slices = [this.mostrar, this.cor];
}

class ExportacaoCard extends Card {
    name = "exportacao";
    displayName = "Exportação";
    mostrarBotao = new formattingSettings.ToggleSwitch({ name: "mostrarBotao", displayName: "Mostrar botão Exportar", value: true });
    nomeArquivo = new formattingSettings.TextInput({ name: "nomeArquivo", displayName: "Nome do arquivo Excel", value: "pedido_diario", placeholder: "nome do arquivo" });
    usarPagina = new formattingSettings.ToggleSwitch({ name: "usarPagina", displayName: "Baixar pela página de download (link)", value: true });
    urlPagina = new formattingSettings.TextInput({ name: "urlPagina", displayName: "Endereço da página de download", value: "https://gabrielpms2001.github.io/novaforma-exportar-bi/download-page/", placeholder: "https://.../download-page/" });
    slices = [this.mostrarBotao, this.nomeArquivo, this.usarPagina, this.urlPagina];
}

export class VisualSettings extends Model {
    titulo = new TituloCard();
    medidores = new MedidoresCard();
    fundo = new FundoCard();
    exportacao = new ExportacaoCard();
    cards = [this.titulo, this.medidores, this.fundo, this.exportacao];
}
