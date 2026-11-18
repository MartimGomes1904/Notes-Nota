const vscode = require('vscode');

const VIEW_TYPE = 'gomesNotes.editor';
const LANG_KEY = 'gomesNotes.lang';
const VERSION_KEY = 'gomesNotes.lastVersion';

// ---------- Idiomas ----------
// Sem preferência guardada, usa o idioma do VS Code (pt* -> português, resto -> inglês).

const STR = {
  en: {
    openFolderFirst: 'Open a folder in VS Code first.',
    newFilePrompt: 'Name of the new notebook',
    newFileInvalid: 'The name cannot contain / \\ : * ? " < > |',
    openFile: 'Open notebook',
    notesCount: (n) => (n === 1 ? '1 note' : `${n} notes`),
    pinnedCount: (n) => `${n} pinned`,
    archivedCount: (n) => `${n} archived`,
    lastEdit: (d) => `Last edited: ${d}`,
    rnTitle: 'Release notes',
    rnShow: 'Show this page after each update',
  },
  pt: {
    openFolderFirst: 'Abre primeiro uma pasta no VS Code.',
    newFilePrompt: 'Nome do novo caderno',
    newFileInvalid: 'O nome não pode conter / \\ : * ? " < > |',
    openFile: 'Abrir caderno',
    notesCount: (n) => (n === 1 ? '1 nota' : `${n} notas`),
    pinnedCount: (n) => (n === 1 ? '1 fixada' : `${n} fixadas`),
    archivedCount: (n) => (n === 1 ? '1 arquivada' : `${n} arquivadas`),
    lastEdit: (d) => `Última edição: ${d}`,
    rnTitle: 'Notas de versão',
    rnShow: 'Mostrar esta página após cada atualização',
  },
};

let extContext = null;
const panels = new Set(); // webviews abertos, para propagar a mudança de idioma

function getLang() {
  const stored = extContext && extContext.globalState.get(LANG_KEY);
  if (stored === 'en' || stored === 'pt') return stored;
  return /^pt/i.test(vscode.env.language || '') ? 'pt' : 'en';
}

const S = () => STR[getLang()];

async function setLang(lang) {
  if (lang !== 'en' && lang !== 'pt') return;
  await extContext.globalState.update(LANG_KEY, lang);
  for (const w of panels) w.postMessage({ type: 'lang', lang });
  scheduleRefresh();
}

// ---------- Documento ----------

function emptyData() {
  return { version: 1, nextId: 1, notes: [] };
}

// Lê o texto do ficheiro .nota e devolve { data } ou { error }
function parseDocument(text) {
  if (!text || !text.trim()) return { data: emptyData() };
  try {
    const raw = JSON.parse(text);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { error: 'nota-not-object' };
    const notes = Array.isArray(raw.notes) ? raw.notes : [];
    let maxId = 0;
    for (const n of notes) {
      if (n && typeof n.id === 'number' && n.id > maxId) maxId = n.id;
    }
    const nextId = Math.max(Number(raw.nextId) || 1, maxId + 1);
    return { data: { version: 1, nextId, notes: notes.filter((n) => n && typeof n === 'object') } };
  } catch (e) {
    return { error: 'nota-invalid-json', detail: e.message };
  }
}

function baseName(uri) {
  const p = uri.path;
  return p.slice(p.lastIndexOf('/') + 1);
}

class NotesEditorProvider {
  constructor(context) {
    this.context = context;
  }

  static register(context) {
    return vscode.window.registerCustomEditorProvider(VIEW_TYPE, new NotesEditorProvider(context), {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false,
    });
  }

  async resolveCustomTextEditor(document, webviewPanel) {
    const webview = webviewPanel.webview;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')],
    };
    webview.html = this.getHtml(webview);
    panels.add(webview);

    let lastWritten = null;

    const sendDocument = () => {
      webview.postMessage({ type: 'load', lang: getLang(), ...parseDocument(document.getText()) });
    };

    const changeSub = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() !== document.uri.toString()) return;
      // Ignora as alterações que nós próprios acabámos de escrever
      if (lastWritten !== null && document.getText() === lastWritten) return;
      sendDocument();
    });

    // Quando o separador volta a ficar visível, volta a ler o ficheiro
    const viewSub = webviewPanel.onDidChangeViewState((e) => {
      if (e.webviewPanel.visible) sendDocument();
    });

    webviewPanel.onDidDispose(() => {
      changeSub.dispose();
      viewSub.dispose();
      panels.delete(webview);
    });

    webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case 'ready':
          sendDocument();
          break;
        case 'setLang':
          await setLang(msg.lang);
          break;
        case 'update': {
          const text = JSON.stringify(msg.data, null, 2) + '\n';
          if (text === document.getText()) return;
          lastWritten = text;
          const edit = new vscode.WorkspaceEdit();
          edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
          await vscode.workspace.applyEdit(edit);
          break;
        }
        case 'openLink': {
          // só endereços http(s): nunca executa comandos nem abre ficheiros locais
          if (typeof msg.url === 'string' && /^https?:\/\//i.test(msg.url)) {
            await vscode.env.openExternal(vscode.Uri.parse(msg.url));
          }
          break;
        }
        case 'openText':
          await vscode.commands.executeCommand('vscode.openWith', document.uri, 'default');
          break;
      }
    });
  }

  getHtml(webview) {
    const mediaUri = (file) => webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', file));
    const nonce = getNonce();
    const csp = [
      "default-src 'none'",
      `style-src ${webview.cspSource}`,
      `img-src ${webview.cspSource}`,
      `script-src 'nonce-${nonce}'`,
    ].join('; ');

    return /* html */ `<!DOCTYPE html>
<html lang="${getLang()}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${mediaUri('editor.css')}">
  <title>Notes</title>
</head>
<body>
  <div id="app"></div>
  <script nonce="${nonce}" src="${mediaUri('editor.js')}"></script>
</body>
</html>`;
  }
}

function getNonce() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 32; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

// ---------- Painel lateral ----------

let refreshTimer = null;
let treeView = null;
const treeChanged = new vscode.EventEmitter();
let lastFiles = []; // [{ uri, total, pinned, archived, updated }]

const setContext = (key, value) => vscode.commands.executeCommand('setContext', key, value);

async function collectFiles() {
  const uris = await vscode.workspace.findFiles('**/*.nota', '**/node_modules/**', 50);
  const out = [];
  for (const uri of uris) {
    const open = vscode.workspace.textDocuments.find((d) => d.uri.toString() === uri.toString());
    let text;
    if (open) {
      text = open.getText();
    } else {
      try {
        text = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString('utf8');
      } catch {
        continue;
      }
    }
    const parsed = parseDocument(text);
    if (parsed.error) continue;
    out.push({ uri, notes: parsed.data.notes });
  }
  return out;
}

// Lê todos os .nota do workspace e atualiza a lista do painel lateral
// e os contextos usados pelo ecrã de boas-vindas.
async function refresh() {
  const files = await collectFiles();
  lastFiles = files.map((f) => {
    const active = f.notes.filter((n) => !n.archived);
    const updated = f.notes.reduce((m, n) => (typeof n.updatedAt === 'string' && n.updatedAt > m ? n.updatedAt : m), '');
    return {
      uri: f.uri,
      total: active.length,
      pinned: active.filter((n) => n.pinned).length,
      archived: f.notes.length - active.length,
      updated,
    };
  });
  lastFiles.sort((a, b) => vscode.workspace.asRelativePath(a.uri).localeCompare(vscode.workspace.asRelativePath(b.uri)));

  await setContext('gomesNotes.lang', getLang());
  await setContext('gomesNotes.noFiles', files.length === 0);
  treeChanged.fire();
}

function scheduleRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refresh().catch(() => {});
  }, 400);
}

// Lista do painel lateral: um item por ficheiro .nota; ao passar o rato mostra quantas notas tem.
class NotesFilesProvider {
  constructor(context) {
    this.context = context;
    this.onDidChangeTreeData = treeChanged.event;
  }

  getTreeItem(f) {
    const s = S();
    const rel = vscode.workspace.asRelativePath(f.uri);
    const name = baseName(f.uri);
    const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '';

    const item = new vscode.TreeItem(name, vscode.TreeItemCollapsibleState.None);
    item.id = f.uri.toString();
    item.description = dir ? `${dir} · ${f.total}` : String(f.total);
    item.iconPath = vscode.Uri.joinPath(this.context.extensionUri, 'icons', 'nota.svg');
    item.contextValue = 'notebook';
    item.command = { command: 'gomesNotes.openFile', title: s.openFile, arguments: [f.uri] };

    const md = new vscode.MarkdownString();
    md.appendMarkdown('**');
    md.appendText(name);
    md.appendMarkdown('**\n\n');
    md.appendText(s.notesCount(f.total));
    const lines = [];
    if (f.pinned) lines.push(`- ${s.pinnedCount(f.pinned)}`);
    if (f.archived) lines.push(`- ${s.archivedCount(f.archived)}`);
    if (lines.length) md.appendMarkdown('\n\n' + lines.join('\n'));
    if (f.updated) {
      const d = new Date(f.updated);
      if (!isNaN(d)) md.appendMarkdown('\n\n' + s.lastEdit(d.toLocaleString(getLang() === 'pt' ? 'pt-PT' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })));
    }
    item.tooltip = md;
    return item;
  }

  getChildren(element) {
    return element ? [] : lastFiles;
  }
}

async function openFile(uri) {
  if (uri) await vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE);
}

// ---------- Notas de versão ----------

const NOTES = require('./releaseNotes');
let notesPanel = null;

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function notesHtml(nonce, webview) {
  const cspSource = webview.cspSource;
  const flag = (code) =>
    webview.asWebviewUri(vscode.Uri.joinPath(extContext.extensionUri, 'icons', `flag-${code}.png`));
  const lang = getLang();
  const s = S();
  const enabled = vscode.workspace.getConfiguration('gomesNotes').get('showReleaseNotes', true);
  const releases = NOTES.map((r) => {
    const t = r[lang];
    const secs = t.sections
      .map((sec) => `<h3>${esc(sec.heading)}</h3><ul>${sec.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`)
      .join('');
    return `<section><h2><span class="v">v${esc(r.version)}</span> <span class="d">- (${esc(r.date)})</span></h2><h4>${esc(t.title)}</h4>${secs}</section>`;
  }).join('');
  const other = lang === 'pt' ? 'en' : 'pt';
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource}; style-src ${cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
body{font-family:var(--vscode-font-family);color:var(--vscode-foreground);padding:8px 28px 40px;max-width:860px;line-height:1.55}
h1{font-weight:600;border-bottom:1px solid var(--vscode-panel-border);padding-bottom:8px;display:flex;align-items:center;gap:12px}
h1 .sp{flex:1}
h2{border-bottom:1px solid var(--vscode-panel-border);padding-bottom:6px;margin-top:32px;font-weight:600}
h2 .v{color:var(--vscode-textLink-foreground)} h2 .d{opacity:.85}
h3{margin:18px 0 4px;font-size:1.05em} h4{margin:4px 0 0;font-weight:500;opacity:.85}
ul{margin:4px 0;padding-left:22px} li{margin:3px 0}
.lang{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid var(--vscode-panel-border);color:var(--vscode-foreground);border-radius:6px;padding:2px 10px;cursor:pointer;font-size:.8em}
.lang img{width:20px;height:auto;border-radius:2px}
.lang:hover{background:var(--vscode-toolbar-hoverBackground)}
.opt{margin-top:36px;padding-top:14px;border-top:1px solid var(--vscode-panel-border);display:flex;align-items:center;gap:8px}
</style></head><body>
<h1>${esc(s.rnTitle)}<span class="sp"></span><button class="lang" id="lang"><img src="${flag(lang === 'pt' ? 'gb' : 'pt')}" alt=""> ${lang === 'pt' ? 'English' : 'Português'}</button></h1>
${releases}
<label class="opt"><input type="checkbox" id="show" ${enabled ? 'checked' : ''}> ${esc(s.rnShow)}</label>
<script nonce="${nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('show').addEventListener('change', (e) => vscode.postMessage({ type: 'show', value: e.target.checked }));
document.getElementById('lang').addEventListener('click', () => vscode.postMessage({ type: 'lang', lang: '${other}' }));
</script></body></html>`;
}

function showReleaseNotes() {
  const render = () => {
    notesPanel.title = S().rnTitle;
    notesPanel.webview.html = notesHtml(getNonce(), notesPanel.webview);
  };
  if (notesPanel) {
    render();
    notesPanel.reveal();
    return;
  }
  notesPanel = vscode.window.createWebviewPanel('gomesNotes.notes', S().rnTitle, vscode.ViewColumn.Active, {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(extContext.extensionUri, 'icons')],
  });
  notesPanel.iconPath = vscode.Uri.joinPath(extContext.extensionUri, 'icons', 'icon.png');
  notesPanel.onDidDispose(() => {
    notesPanel = null;
  });
  notesPanel.webview.onDidReceiveMessage(async (m) => {
    if (m.type === 'show') {
      await vscode.workspace
        .getConfiguration('gomesNotes')
        .update('showReleaseNotes', !!m.value, vscode.ConfigurationTarget.Global);
    } else if (m.type === 'lang') {
      await setLang(m.lang);
      render();
    }
  });
  render();
}

// Mostra as notas quando a versão instalada mudou desde a última vez (e a opção está ligada).
function maybeShowReleaseNotes(context) {
  const current = context.extension && context.extension.packageJSON.version;
  if (!current) return;
  const previous = context.globalState.get(VERSION_KEY);
  if (previous === current) return;
  context.globalState.update(VERSION_KEY, current);
  if (vscode.workspace.getConfiguration('gomesNotes').get('showReleaseNotes', true)) showReleaseNotes();
}

// ---------- Comandos ----------

async function newFile() {
  const folder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
  if (!folder) {
    vscode.window.showWarningMessage(S().openFolderFirst);
    return;
  }
  let name = await vscode.window.showInputBox({
    prompt: S().newFilePrompt,
    value: 'notas.nota',
    valueSelection: [0, 5], // seleciona só "notas" e mantém a extensão
    validateInput: (v) => (/[\\\/:*?"<>|]/.test(v) ? S().newFileInvalid : undefined),
  });
  name = name && name.trim();
  if (!name) return;
  if (!name.endsWith('.nota')) name += '.nota';
  const uri = vscode.Uri.joinPath(folder.uri, name);
  try {
    await vscode.workspace.fs.stat(uri);
  } catch {
    const content = Buffer.from(JSON.stringify(emptyData(), null, 2) + '\n', 'utf8');
    await vscode.workspace.fs.writeFile(uri, content);
  }
  await vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE);
}

async function openAsText() {
  const tab = vscode.window.tabGroups.activeTabGroup.activeTab;
  const input = tab && tab.input;
  if (input && input.uri) {
    await vscode.commands.executeCommand('vscode.openWith', input.uri, 'default');
  }
}

function activate(context) {
  extContext = context;

  treeView = vscode.window.createTreeView('gomesNotes.files', {
    treeDataProvider: new NotesFilesProvider(context),
  });
  setContext('gomesNotes.lang', getLang());

  const watcher = vscode.workspace.createFileSystemWatcher('**/*.nota');

  context.subscriptions.push(
    treeView,
    treeChanged,
    watcher,
    watcher.onDidCreate(scheduleRefresh),
    watcher.onDidChange(scheduleRefresh),
    watcher.onDidDelete(scheduleRefresh),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.path.toLowerCase().endsWith('.nota')) scheduleRefresh();
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(scheduleRefresh),
    NotesEditorProvider.register(context),
    vscode.commands.registerCommand('gomesNotes.newFile', newFile),
    vscode.commands.registerCommand('gomesNotes.openAsText', openAsText),
    vscode.commands.registerCommand('gomesNotes.openFile', openFile),
    vscode.commands.registerCommand('gomesNotes.showReleaseNotes', showReleaseNotes)
  );

  maybeShowReleaseNotes(context);

  // primeira leitura imediata, para o painel lateral não aparecer vazio
  refresh().catch(() => {});
}

function deactivate() {
  clearTimeout(refreshTimer);
}

module.exports = { activate, deactivate };
