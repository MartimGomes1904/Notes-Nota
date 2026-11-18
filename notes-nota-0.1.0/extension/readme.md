# Gomes Notes

**English** below · **Português** mais abaixo

---

## English

A VS Code extension that opens notebook files (`.nota`) in a visual editor: your notes as colored cards, with Markdown, labels, pinning and an archive.

### Getting started

1. Create a file with the `.nota` extension (for example `notes.nota`), or run **Notes: New notebook** (Ctrl+Shift+P), or use the **+** button in the Notes side panel.
2. Click the box at the top, write your note and press **Ctrl+Enter** (or the Save button).
3. Click a note to edit it.

Everything is saved in the notebook file itself (JSON), so Ctrl+Z, Save and Git work like with any other file. To see the raw JSON: **Notes: Open as text (JSON)**.

### Features

- **Cards or list:** switch at the top. Cards flow into columns that adapt to the window width, with no horizontal scroll bar.
- **Markdown with preview:** headings, **bold**, *italic*, `code`, code blocks, quotes, numbered and bullet lists, and links (opened in your browser). A toolbar inserts the formatting for you.
- **Checklists inside notes:** write `- [ ] item` and tick the items straight on the card.
- **Colors and labels:** eight colors, free-form labels, and a label filter.
- **Pinned notes:** pinned notes stay together at the top.
- **Archive:** put notes away without deleting them, and restore them any time.
- **Search and sorting:** search titles, text and labels; sort by last edit, creation date or title.
- **Side bar:** a note icon in the Activity Bar lists every notebook in the workspace. Hover one to see how many notes it has, click to open it. With no notebook yet, a small panel offers a button to create one (the name is asked in VS Code's top input box).
- **Release notes:** a page opens after each update. Turn it off with the `gomesNotes.showReleaseNotes` setting (or its checkbox); reopen it with "Notes: Show release notes".
- **English / Português:** the flags at the top right of the editor switch the language. By default the editor uses the language of VS Code. Your choice is remembered.

---

## Português

Uma extensão para o VS Code que abre ficheiros de caderno (`.nota`) num editor visual: as tuas notas como cartões coloridos, com Markdown, etiquetas, fixar e arquivo.

### Como começar

1. Cria um ficheiro com a extensão `.nota` (por exemplo `notas.nota`), ou executa **Notas: Novo caderno** (Ctrl+Shift+P), ou usa o botão **+** do painel lateral Notas.
2. Clica na caixa de cima, escreve a nota e carrega **Ctrl+Enter** (ou no botão Guardar).
3. Clica numa nota para a editar.

Tudo fica guardado no próprio ficheiro do caderno (JSON), por isso Ctrl+Z, Guardar e Git funcionam como em qualquer outro ficheiro. Para ver o JSON em bruto: **Notas: Abrir como texto (JSON)**.

### Funcionalidades

- **Cartões ou lista:** alterna em cima. Os cartões distribuem-se em colunas que se adaptam à largura da janela, sem barra de scroll horizontal.
- **Markdown com pré-visualização:** títulos, **negrito**, *itálico*, `código`, blocos de código, citações, listas numeradas e com marcas, e ligações (abertas no navegador). Uma barra de ferramentas insere a formatação por ti.
- **Listas de verificação dentro das notas:** escreve `- [ ] item` e marca os itens diretamente no cartão.
- **Cores e etiquetas:** oito cores, etiquetas livres e um filtro por etiqueta.
- **Notas fixadas:** as notas fixadas ficam juntas no topo.
- **Arquivo:** guarda notas de lado sem as apagar, e restaura-as quando quiseres.
- **Pesquisa e ordenação:** pesquisa títulos, texto e etiquetas; ordena pela última edição, data de criação ou título.
- **Barra lateral:** um ícone de nota na Barra de Atividade mostra todos os cadernos do workspace. Passa o rato por cima para ver quantas notas tem e clica para abrir. Sem nenhum caderno, aparece um pequeno painel com um botão para criar um (o nome é pedido na caixa de texto do VS Code, no topo).
- **Notas de versão:** abre uma página após cada atualização. Desliga-a na definição `gomesNotes.showReleaseNotes` (ou na caixa da própria página); reabre-a com "Notas: Mostrar notas de versão".
- **English / Português:** as bandeiras no canto superior direito do editor mudam o idioma. Por omissão, o editor usa o idioma do VS Code. A tua escolha fica guardada.
