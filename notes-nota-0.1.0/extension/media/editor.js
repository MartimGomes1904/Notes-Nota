(function () {
  const vscode = acquireVsCodeApi();
  const saved = vscode.getState() || {};

  // ---------- Idiomas ----------
  // O idioma inicial vem da extensão (preferência guardada ou idioma do VS Code).
  let lang = 'en';

  const I18N = {
    en: {
      title: 'Notes',
      viewGrid: 'Cards',
      viewList: 'List',
      tabNotes: (n) => `Notes (${n})`,
      tabArchive: (n) => `Archive (${n})`,
      composerHint: 'Write a note…',
      composerTitle: 'Title',
      composerBody: 'Write here. Markdown works: **bold**, - [ ] checklist, `code`',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      search: 'Search…',
      allLabels: 'All labels',
      sorts: { edited: 'Recently edited', created: 'Newest first', title: 'Title A–Z' },
      pinned: 'Pinned',
      others: 'Others',
      emptyAll: 'No notes yet. Write the first one above.',
      emptyArchive: 'The archive is empty.',
      emptyFilter: 'No notes match the search.',
      pin: 'Pin',
      unpin: 'Unpin',
      color: 'Color',
      archive: 'Archive',
      unarchive: 'Restore',
      del: 'Delete',
      deleteQ: 'Delete?',
      yes: 'Yes',
      no: 'No',
      untitled: '(untitled)',
      editNote: 'Edit note',
      fTitle: 'Title',
      fBody: 'Note',
      fColor: 'Color',
      fLabels: 'Labels',
      write: 'Write',
      preview: 'Preview',
      previewEmpty: 'Nothing to preview yet.',
      labelPlaceholder: 'Add label… (Enter)',
      removeLabel: 'Remove label',
      pinnedCheck: 'Pinned',
      created: 'Created',
      edited: 'Edited',
      words: (n) => (n === 1 ? '1 word' : `${n} words`),
      discardMsg: 'You have unsaved changes. Discard?',
      discard: 'Discard',
      keepEditing: 'Keep editing',
      emptyNote: 'Write something first.',
      colors: { '': 'No color', amarelo: 'Yellow', laranja: 'Orange', vermelho: 'Red', verde: 'Green', azul: 'Blue', roxo: 'Purple', cinza: 'Gray' },
      tools: { bold: 'Bold', italic: 'Italic', code: 'Code', heading: 'Heading', list: 'List', check: 'Checklist', quote: 'Quote', link: 'Link' },
      linkText: 'text',
      langTitle: 'Language',
      errTitle: 'This notebook cannot be shown',
      errNotObject: 'The file must contain a JSON object ({ … }).',
      errInvalid: 'The file contains invalid JSON.',
      openAsText: 'Open as text',
    },
    pt: {
      title: 'Notas',
      viewGrid: 'Cartões',
      viewList: 'Lista',
      tabNotes: (n) => `Notas (${n})`,
      tabArchive: (n) => `Arquivo (${n})`,
      composerHint: 'Escreve uma nota…',
      composerTitle: 'Título',
      composerBody: 'Escreve aqui. O Markdown funciona: **negrito**, - [ ] lista, `código`',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Fechar',
      search: 'Pesquisar…',
      allLabels: 'Todas as etiquetas',
      sorts: { edited: 'Editadas recentemente', created: 'Mais recentes', title: 'Título A–Z' },
      pinned: 'Fixadas',
      others: 'Outras',
      emptyAll: 'Ainda não há notas. Escreve a primeira em cima.',
      emptyArchive: 'O arquivo está vazio.',
      emptyFilter: 'Nenhuma nota corresponde à pesquisa.',
      pin: 'Fixar',
      unpin: 'Desafixar',
      color: 'Cor',
      archive: 'Arquivar',
      unarchive: 'Restaurar',
      del: 'Apagar',
      deleteQ: 'Apagar?',
      yes: 'Sim',
      no: 'Não',
      untitled: '(sem título)',
      editNote: 'Editar nota',
      fTitle: 'Título',
      fBody: 'Nota',
      fColor: 'Cor',
      fLabels: 'Etiquetas',
      write: 'Escrever',
      preview: 'Pré-visualizar',
      previewEmpty: 'Ainda não há nada para mostrar.',
      labelPlaceholder: 'Adicionar etiqueta… (Enter)',
      removeLabel: 'Remover etiqueta',
      pinnedCheck: 'Fixada',
      created: 'Criada',
      edited: 'Editada',
      words: (n) => (n === 1 ? '1 palavra' : `${n} palavras`),
      discardMsg: 'Tens alterações por guardar. Descartar?',
      discard: 'Descartar',
      keepEditing: 'Continuar a editar',
      emptyNote: 'Escreve alguma coisa primeiro.',
      colors: { '': 'Sem cor', amarelo: 'Amarelo', laranja: 'Laranja', vermelho: 'Vermelho', verde: 'Verde', azul: 'Azul', roxo: 'Roxo', cinza: 'Cinzento' },
      tools: { bold: 'Negrito', italic: 'Itálico', code: 'Código', heading: 'Título', list: 'Lista', check: 'Lista de verificação', quote: 'Citação', link: 'Ligação' },
      linkText: 'texto',
      langTitle: 'Idioma',
      errTitle: 'Não é possível mostrar este caderno',
      errNotObject: 'O ficheiro tem de conter um objeto JSON ({ … }).',
      errInvalid: 'O ficheiro contém JSON inválido.',
      openAsText: 'Abrir como texto',
    },
  };

  const T = () => I18N[lang];
  const t = (key, ...args) => {
    const v = T()[key];
    return typeof v === 'function' ? v(...args) : v;
  };

  const GB_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice">' +
    '<clipPath id="gb-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>' +
    '<clipPath id="gb-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>' +
    '<g clip-path="url(#gb-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/>' +
    '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>' +
    '<path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#gb-t)" stroke="#C8102E" stroke-width="4"/>' +
    '<path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>' +
    '<path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>';
  const PT_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">' +
    '<rect width="30" height="20" fill="#FF0000"/><rect width="12" height="20" fill="#006600"/>' +
    '<circle cx="12" cy="10" r="3.7" fill="#FFE000"/><circle cx="12" cy="10" r="3.7" fill="none" stroke="#FF0000" stroke-width="0.35"/>' +
    '<rect x="10.35" y="8.3" width="3.3" height="3.5" rx="0.9" fill="#FFF" stroke="#FF0000" stroke-width="0.5"/>' +
    '<rect x="11.35" y="9.3" width="1.3" height="1.5" fill="#039"/></svg>';

  const COLORS = ['', 'amarelo', 'laranja', 'vermelho', 'verde', 'azul', 'roxo', 'cinza'];

  // ---------- helpers ----------
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === undefined || v === null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (k === 'text') node.textContent = v;
        else if (k === 'value') node.value = v;
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
      }
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  const now = () => new Date().toISOString();
  const arr = (x) => (Array.isArray(x) ? x : []);
  const locale = () => (lang === 'pt' ? 'pt-PT' : 'en-GB');
  const pad = (n) => String(n).padStart(2, '0');

  function fmtShort(iso) {
    const d = new Date(iso);
    if (!iso || isNaN(d)) return '';
    const n = new Date();
    if (d.toDateString() === n.toDateString()) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const sameYear = d.getFullYear() === n.getFullYear();
    return d.toLocaleDateString(locale(), { day: '2-digit', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) });
  }
  function fmtLong(iso) {
    const d = new Date(iso);
    if (!iso || isNaN(d)) return '';
    return d.toLocaleString(locale(), { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function labelHue(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
  }

  function chip(name, onremove) {
    return el(
      'span',
      { class: 'chip', style: '--h:' + labelHue(name) },
      name,
      onremove
        ? el('button', { class: 'chip-x', title: t('removeLabel'), text: '×', onclick: (e) => { e.stopPropagation(); onremove(); } })
        : null
    );
  }

  function uniqLabels(list) {
    const out = [];
    for (const raw of list) {
      const s = String(raw).trim().replace(/^#/, '');
      if (s && !out.some((o) => o.toLowerCase() === s.toLowerCase())) out.push(s);
    }
    return out;
  }

  const wordCount = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);

  // ---------- Markdown (seguro: todo o texto é escapado antes de ser usado) ----------
  const escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function inline(raw) {
    const keep = []; // partes que não devem receber mais formatação (código, ligações)
    const hold = (html) => {
      keep.push(html);
      return '\u0000' + (keep.length - 1) + '\u0000';
    };
    let s = escHtml(raw)
      .replace(/`([^`\n]+)`/g, (m, c) => hold('<code>' + c + '</code>'))
      .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, text, url) => hold(`<a href="#" data-url="${url}">${text}</a>`))
      .replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, (m, pre, url) => pre + hold(`<a href="#" data-url="${url}">${url}</a>`));
    s = s
      .replace(/\*\*([^*\n]+)\*\*|__([^_\n]+)__/g, (m, a, b) => `<strong>${a || b}</strong>`)
      .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)|(^|[^_\w])_([^_\n]+)_(?!\w)/g, (m, p1, a, p2, b) => `${p1 || p2 || ''}<em>${a || b}</em>`)
      .replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
    for (let k = 0; k < 3 && /\u0000\d+\u0000/.test(s); k++) s = s.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[Number(i)]);
    return s;
  }

  // Converte o texto da nota em HTML. As caixas "- [ ]" ficam com data-line para poderem ser marcadas.
  function renderMarkdown(text) {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let para = [];
    let list = null; // { tag, items }
    let quote = [];
    let i = 0;

    const flushPara = () => { if (para.length) { out.push('<p>' + para.map(inline).join('<br>') + '</p>'); para = []; } };
    const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.join('')}</${list.tag}>`); list = null; } };
    const flushQuote = () => { if (quote.length) { out.push('<blockquote>' + quote.map(inline).join('<br>') + '</blockquote>'); quote = []; } };
    const flushAll = () => { flushPara(); flushList(); flushQuote(); };

    while (i < lines.length) {
      const line = lines[i];
      let m;
      if ((m = /^```/.exec(line))) {
        flushAll();
        const code = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
        out.push('<pre><code>' + escHtml(code.join('\n')) + '</code></pre>');
      } else if ((m = /^(#{1,3})\s+(.*)$/.exec(line))) {
        flushAll();
        out.push(`<h${m[1].length + 2}>${inline(m[2])}</h${m[1].length + 2}>`);
      } else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
        flushAll();
        out.push('<hr>');
      } else if ((m = /^(\s*)[-*+]\s+\[([ xX])\]\s+(.*)$/.exec(line))) {
        flushPara(); flushQuote();
        if (!list || list.tag !== 'ul') { flushList(); list = { tag: 'ul', items: [] }; }
        const done = m[2] !== ' ';
        list.items.push(`<li class="check${done ? ' is-done' : ''}" style="--lvl:${Math.min(3, Math.floor(m[1].length / 2))}"><label><input type="checkbox" data-line="${i}"${done ? ' checked' : ''}><span>${inline(m[3])}</span></label></li>`);
      } else if ((m = /^(\s*)[-*+]\s+(.*)$/.exec(line))) {
        flushPara(); flushQuote();
        if (!list || list.tag !== 'ul') { flushList(); list = { tag: 'ul', items: [] }; }
        list.items.push(`<li style="--lvl:${Math.min(3, Math.floor(m[1].length / 2))}">${inline(m[2])}</li>`);
      } else if ((m = /^(\s*)\d+[.)]\s+(.*)$/.exec(line))) {
        flushPara(); flushQuote();
        if (!list || list.tag !== 'ol') { flushList(); list = { tag: 'ol', items: [] }; }
        list.items.push(`<li style="--lvl:${Math.min(3, Math.floor(m[1].length / 2))}">${inline(m[2])}</li>`);
      } else if ((m = /^>\s?(.*)$/.exec(line))) {
        flushPara(); flushList();
        quote.push(m[1]);
      } else if (line.trim() === '') {
        flushAll();
      } else {
        flushList(); flushQuote();
        para.push(line);
      }
      i++;
    }
    flushAll();
    return out.join('');
  }

  // Marca ou desmarca a caixa da linha n do texto
  function toggleCheckLine(body, lineNo) {
    const lines = body.split('\n');
    const m = /^(\s*[-*+]\s+\[)([ xX])(\]\s.*)$/.exec(lines[lineNo] || '');
    if (!m) return body;
    lines[lineNo] = m[1] + (m[2] === ' ' ? 'x' : ' ') + m[3];
    return lines.join('\n');
  }

  // ---------- estado ----------
  let state = { version: 1, nextId: 1, notes: [] };
  let view = saved.view === 'list' ? 'list' : 'grid';
  let tab = 'notes';
  const filters = { q: '', label: '', sort: 'edited' };
  let loadError = null;
  let modal = null; // { id, draft, original, dirtyAsk, tab, ... }
  let confirmId = null; // nota com "Apagar?" visível
  let colorMenuId = null; // nota com a lista de cores aberta
  let composer = null; // { open, title, body, color, labels }

  let rootEl, mainEl, tabsEl, countEl, composerEl;

  const saveUi = () => vscode.setState({ view });

  function normalizeNote(raw) {
    const n = raw && typeof raw === 'object' ? raw : {};
    return {
      id: Number(n.id) || 0,
      title: typeof n.title === 'string' ? n.title : '',
      body: typeof n.body === 'string' ? n.body : '',
      color: COLORS.includes(n.color) ? n.color : '',
      pinned: n.pinned === true,
      archived: n.archived === true,
      labels: uniqLabels(arr(n.labels)),
      createdAt: typeof n.createdAt === 'string' ? n.createdAt : now(),
      updatedAt: typeof n.updatedAt === 'string' ? n.updatedAt : now(),
    };
  }

  const findNote = (id) => state.notes.find((x) => x.id === id);
  const commit = () => vscode.postMessage({ type: 'update', data: state });

  function addNote(fields) {
    const ts = now();
    const note = normalizeNote({ ...fields, id: state.nextId, createdAt: ts, updatedAt: ts });
    note.id = state.nextId;
    state.nextId += 1;
    state.notes.push(note);
    commit();
    return note;
  }

  function updateNote(id, fields) {
    const note = findNote(id);
    if (!note) return;
    Object.assign(note, fields);
    note.updatedAt = now();
    commit();
  }

  function removeNote(id) {
    state.notes = state.notes.filter((x) => x.id !== id);
    commit();
  }

  // ---------- filtros e ordenação ----------
  const noteTitle = (n) => n.title.trim() || n.body.trim().split('\n')[0].replace(/[#>*`\-\[\]_]/g, '').trim().slice(0, 60);

  function matches(n) {
    const q = filters.q.trim().toLowerCase();
    if (q && !(n.title + ' ' + n.body + ' ' + n.labels.join(' ')).toLowerCase().includes(q)) return false;
    if (filters.label && !n.labels.some((l) => l.toLowerCase() === filters.label.toLowerCase())) return false;
    return true;
  }

  function sorted(list) {
    const out = list.slice();
    if (filters.sort === 'created') out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (filters.sort === 'title') out.sort((a, b) => noteTitle(a).localeCompare(noteTitle(b), locale(), { sensitivity: 'base' }));
    else out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return out;
  }

  const allLabels = () => uniqLabels(state.notes.flatMap((x) => x.labels)).sort((a, b) => a.localeCompare(b));
  const countActive = () => state.notes.filter((x) => !x.archived).length;
  const countArchived = () => state.notes.filter((x) => x.archived).length;

  // ---------- idioma ----------
  function applyLang(next, persist) {
    const l = next === 'pt' ? 'pt' : 'en';
    if (l === lang && !persist) return;
    lang = l;
    document.documentElement.lang = lang;
    if (persist) vscode.postMessage({ type: 'setLang', lang });
    if (mainEl) {
      buildShell();
      renderAll();
      if (modal) renderModal(true);
    }
  }

  function buildLangToggle() {
    const wrap = el('div', { class: 'lang-toggle', role: 'group', 'aria-label': t('langTitle') });
    for (const [code, svg, name] of [['en', GB_SVG, 'English'], ['pt', PT_SVG, 'Português']]) {
      const btn = el('button', {
        class: 'lang-btn' + (lang === code ? ' active' : ''),
        title: name,
        'aria-label': name,
        'aria-pressed': lang === code ? 'true' : 'false',
        'data-lang': code,
        onclick: () => { if (lang !== code) applyLang(code, true); },
      });
      const flag = el('span', { class: 'flag' });
      flag.innerHTML = svg;
      btn.appendChild(flag);
      wrap.appendChild(btn);
    }
    return wrap;
  }

  // ---------- estrutura da página ----------
  function setView(v) {
    view = v;
    saveUi();
    for (const b of document.querySelectorAll('.seg')) b.classList.toggle('active', b.dataset.view === view);
    renderMain();
  }

  function newComposer() {
    return { open: false, title: '', body: '', color: '', labels: [] };
  }

  function buildShell() {
    rootEl = document.getElementById('app');
    rootEl.textContent = '';
    if (!composer) composer = newComposer();

    const segmented = el(
      'div',
      { class: 'segmented' },
      el('button', { class: 'seg' + (view === 'grid' ? ' active' : ''), 'data-view': 'grid', text: t('viewGrid'), onclick: () => setView('grid') }),
      el('button', { class: 'seg' + (view === 'list' ? ' active' : ''), 'data-view': 'list', text: t('viewList'), onclick: () => setView('list') })
    );
    const header = el(
      'div',
      { class: 'header' },
      el('div', { class: 'header-left' }, el('h1', { text: t('title') }), segmented),
      el('div', { class: 'header-right' }, buildLangToggle())
    );

    composerEl = el('div', { class: 'composer' });
    tabsEl = el('div', { class: 'tabs' });

    const search = el('input', {
      type: 'search',
      class: 'search',
      placeholder: t('search'),
      value: filters.q,
      oninput: (e) => { filters.q = e.target.value; renderMain(); },
    });
    const labelSel = el('select', { class: 'f-label', onchange: (e) => { filters.label = e.target.value; renderMain(); } });
    labelSel.dataset.role = 'labels';
    const sortSel = el(
      'select',
      { class: 'f-sort', onchange: (e) => { filters.sort = e.target.value; renderMain(); } },
      Object.keys(T().sorts).map((k) => el('option', { value: k, text: T().sorts[k], selected: filters.sort === k }))
    );
    const toolbar = el('div', { class: 'toolbar' }, tabsEl, el('span', { class: 'grow' }), search, labelSel, sortSel);

    mainEl = el('div', { class: 'main' });
    rootEl.append(header, composerEl, toolbar, mainEl);
    buildComposer();
  }

  function renderAll() {
    if (!mainEl) return;
    renderTabs();
    renderLabelFilter();
    renderComposerVisibility();
    renderMain();
  }

  function renderTabs() {
    tabsEl.textContent = '';
    for (const [id, text] of [['notes', t('tabNotes', countActive())], ['archive', t('tabArchive', countArchived())]]) {
      tabsEl.append(
        el('button', {
          class: 'tab' + (tab === id ? ' active' : ''),
          'data-tab': id,
          text,
          onclick: () => { tab = id; colorMenuId = null; confirmId = null; renderAll(); },
        })
      );
    }
  }

  function renderLabelFilter() {
    const sel = document.querySelector('select[data-role="labels"]');
    if (!sel) return;
    const labels = allLabels();
    if (filters.label && !labels.some((l) => l.toLowerCase() === filters.label.toLowerCase())) filters.label = '';
    sel.textContent = '';
    sel.append(el('option', { value: '', text: t('allLabels') }), ...labels.map((l) => el('option', { value: l, text: l, selected: filters.label.toLowerCase() === l.toLowerCase() })));
    sel.value = filters.label;
    sel.classList.toggle('hidden', labels.length === 0);
  }

  // ---------- caixa de nota rápida ----------
  function buildComposer() {
    composerEl.textContent = '';
    const c = composer;

    const collapsed = el('div', {
      class: 'composer-collapsed',
      tabindex: '0',
      role: 'button',
      text: t('composerHint'),
      onclick: () => openComposer(),
      onfocus: () => openComposer(),
    });

    const titleInput = el('input', {
      type: 'text',
      class: 'c-title',
      placeholder: t('composerTitle'),
      value: c.title,
      oninput: (e) => { c.title = e.target.value; },
    });
    const bodyInput = el('textarea', {
      class: 'c-body',
      rows: '4',
      placeholder: t('composerBody'),
      oninput: (e) => { c.body = e.target.value; e.target.classList.remove('invalid'); autoGrow(e.target); },
    });
    bodyInput.value = c.body;

    const swatches = buildSwatches(() => c.color, (v) => { c.color = v; buildComposer(); focusBody(); });
    const chipsBox = el('div', { class: 'chips c-chips' }, c.labels.map((l) => chip(l, () => { c.labels = c.labels.filter((x) => x !== l); buildComposer(); })));
    const labelInput = el('input', {
      type: 'text',
      class: 'c-label',
      list: 'label-list',
      placeholder: t('labelPlaceholder'),
      onkeydown: (e) => {
        if ((e.key === 'Enter' || e.key === ',') && !e.isComposing) {
          e.preventDefault();
          e.stopPropagation();
          c.labels = uniqLabels([...c.labels, ...e.target.value.split(',')]);
          buildComposer();
          const again = composerEl.querySelector('.c-label');
          if (again) again.focus();
        }
      },
    });
    const dl = el('datalist', { id: 'label-list' }, allLabels().map((l) => el('option', { value: l })));

    const expanded = el(
      'div',
      { class: 'composer-open' },
      titleInput,
      bodyInput,
      el('div', { class: 'composer-row' }, swatches, el('div', { class: 'composer-labels' }, chipsBox, labelInput, dl)),
      el('div', { class: 'composer-actions' },
        el('span', { class: 'hint', text: 'Ctrl+Enter' }),
        el('button', { class: 'btn-secondary', text: t('cancel'), onclick: cancelComposer }),
        el('button', { class: 'btn-primary', text: t('save'), onclick: saveComposer }))
    );

    expanded.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveComposer(); }
      else if (e.key === 'Escape') { e.preventDefault(); c.open = false; renderComposerVisibility(); }
    });

    composerEl.append(collapsed, expanded);
    renderComposerVisibility();
    if (c.open) autoGrow(bodyInput);
  }

  function focusBody() {
    const b = composerEl.querySelector('.c-body');
    if (b) b.focus();
  }

  function autoGrow(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight + 2, 360) + 'px';
  }

  function openComposer() {
    if (composer.open) return;
    composer.open = true;
    renderComposerVisibility();
    const target = composerEl.querySelector('.c-body');
    if (target) target.focus();
  }

  function renderComposerVisibility() {
    if (!composerEl) return;
    const show = tab === 'notes';
    composerEl.classList.toggle('hidden', !show);
    const collapsed = composerEl.querySelector('.composer-collapsed');
    const open = composerEl.querySelector('.composer-open');
    if (collapsed) collapsed.classList.toggle('hidden', composer.open);
    if (open) open.classList.toggle('hidden', !composer.open);
  }

  function cancelComposer() {
    composer = newComposer();
    buildComposer();
  }

  function saveComposer() {
    const c = composer;
    if (!c.title.trim() && !c.body.trim()) {
      const b = composerEl.querySelector('.c-body');
      if (b) { b.classList.add('invalid'); b.focus(); }
      return;
    }
    const pendingLabel = composerEl.querySelector('.c-label');
    const labels = uniqLabels([...c.labels, ...(pendingLabel ? pendingLabel.value.split(',') : [])]);
    addNote({ title: c.title.trim(), body: c.body, color: c.color, labels });
    composer = newComposer();
    buildComposer();
    renderAll();
  }

  function buildSwatches(get, set) {
    return el(
      'div',
      { class: 'swatches', role: 'radiogroup', 'aria-label': t('fColor') },
      COLORS.map((c) =>
        el('button', {
          class: 'swatch' + (c === '' ? ' none' : '') + (get() === c ? ' on' : ''),
          style: c ? `--nc:var(--c-${c})` : null,
          title: T().colors[c],
          'aria-label': T().colors[c],
          'aria-checked': get() === c ? 'true' : 'false',
          onclick: (e) => { e.stopPropagation(); set(c); },
        })
      )
    );
  }

  // ---------- lista de notas ----------
  function renderMain() {
    if (!mainEl) return;
    const y = window.scrollY;
    mainEl.textContent = '';
    mainEl.classList.toggle('list-mode', view === 'list');

    const pool = state.notes.filter((n) => (tab === 'archive' ? n.archived : !n.archived));
    if (pool.length === 0) {
      mainEl.append(el('div', { class: 'empty', text: tab === 'archive' ? t('emptyArchive') : t('emptyAll') }));
      return;
    }
    const visible = sorted(pool.filter(matches));
    if (visible.length === 0) {
      mainEl.append(el('div', { class: 'empty small', text: t('emptyFilter') }));
      return;
    }

    const group = (notes, heading) => {
      const wrap = el('section', { class: 'group' });
      if (heading) wrap.append(el('h3', { class: 'group-title', text: heading }));
      const grid = el('div', { class: 'notes' }, notes.map(buildCard));
      wrap.append(grid);
      return wrap;
    };

    if (tab === 'notes') {
      const pinned = visible.filter((n) => n.pinned);
      const others = visible.filter((n) => !n.pinned);
      if (pinned.length) mainEl.append(group(pinned, t('pinned')));
      if (others.length) mainEl.append(group(others, pinned.length ? t('others') : ''));
    } else {
      mainEl.append(group(visible, ''));
    }
    window.scrollTo(0, y);
  }

  let downTarget = null;
  document.addEventListener('mousedown', (e) => { downTarget = e.target; }, true);
  document.addEventListener('click', (e) => {
    // fecha a lista de cores ao clicar fora dela
    if (colorMenuId !== null && !e.target.closest('.card-colors, .act-color')) {
      colorMenuId = null;
      renderMain();
    }
  });

  function buildCard(note) {
    const title = note.title.trim();
    const bodyEl = el('div', { class: 'card-body md' });
    bodyEl.innerHTML = renderMarkdown(note.body);

    // caixas de verificação marcadas diretamente no cartão
    bodyEl.addEventListener('change', (e) => {
      const box = e.target;
      if (!box.matches || !box.matches('input[type="checkbox"][data-line]')) return;
      updateNote(note.id, { body: toggleCheckLine(note.body, Number(box.dataset.line)) });
      renderMain();
    });

    const actions = el(
      'div',
      { class: 'card-actions' },
      el('button', { class: 'icon-btn' + (note.pinned ? ' on' : ''), title: note.pinned ? t('unpin') : t('pin'), 'aria-label': note.pinned ? t('unpin') : t('pin'), text: note.pinned ? '★' : '☆', onclick: () => { updateNote(note.id, { pinned: !note.pinned }); renderAll(); } }),
      el('button', { class: 'icon-btn act-color', title: t('color'), 'aria-label': t('color'), text: '◐', onclick: (e) => { e.stopPropagation(); colorMenuId = colorMenuId === note.id ? null : note.id; renderMain(); } }),
      el('button', { class: 'icon-btn', title: note.archived ? t('unarchive') : t('archive'), 'aria-label': note.archived ? t('unarchive') : t('archive'), text: note.archived ? '↩' : '▤', onclick: () => { updateNote(note.id, { archived: !note.archived, pinned: false }); renderAll(); } }),
      confirmId === note.id
        ? el('span', { class: 'confirm' },
            t('deleteQ'),
            el('button', { class: 'btn-danger', text: t('yes'), onclick: () => { confirmId = null; removeNote(note.id); renderAll(); } }),
            el('button', { class: 'btn-secondary', text: t('no'), onclick: () => { confirmId = null; renderMain(); } }))
        : el('button', { class: 'icon-btn', title: t('del'), 'aria-label': t('del'), text: '✕', onclick: () => { confirmId = note.id; renderMain(); } })
    );

    const card = el(
      'article',
      { class: 'note' + (note.color ? ' c-' + note.color : '') + (note.pinned ? ' is-pinned' : ''), 'data-id': note.id, tabindex: '0' },
      title ? el('h4', { class: 'card-title', text: title }) : null,
      note.body.trim() ? bodyEl : null,
      !title && !note.body.trim() ? el('div', { class: 'card-title muted', text: t('untitled') }) : null,
      note.labels.length ? el('div', { class: 'chips' }, note.labels.map((l) => chip(l))) : null,
      colorMenuId === note.id
        ? el('div', { class: 'card-colors' }, buildSwatches(() => note.color, (c) => { colorMenuId = null; updateNote(note.id, { color: c }); renderMain(); }))
        : null,
      el('div', { class: 'card-foot' }, el('span', { class: 'date', title: fmtLong(note.updatedAt), text: fmtShort(note.updatedAt) }), actions)
    );

    // Só abre o editor quando o clique começou e acabou dentro do cartão (e não num controlo ou ligação)
    card.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-url]');
      if (link) {
        e.preventDefault();
        vscode.postMessage({ type: 'openLink', url: link.dataset.url });
        return;
      }
      if (e.target.closest('button, input, select, label, textarea, .card-colors')) return;
      if (!downTarget || !card.contains(downTarget)) return;
      downTarget = null;
      if (window.getSelection && String(window.getSelection()).length > 0) return; // estava a selecionar texto
      openModal(note.id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target === card) openModal(note.id);
    });
    return card;
  }

  // ---------- diálogo de edição ----------
  const draftOf = (n) => ({ title: n.title, body: n.body, color: n.color, pinned: n.pinned, labels: n.labels.slice() });

  function openModal(id) {
    const note = findNote(id);
    if (!note) return;
    const draft = draftOf(note);
    modal = { id, draft, original: JSON.stringify(draft), dirtyAsk: false, tab: 'write', confirmDelete: false, error: false };
    renderModal(false);
  }

  function closeModal() {
    modal = null;
    const o = document.querySelector('.overlay');
    if (o) o.remove();
  }

  const isDirty = () => !!modal && JSON.stringify(modal.draft) !== modal.original;

  function requestClose() {
    if (!modal) return;
    if (isDirty() && !modal.dirtyAsk) {
      modal.dirtyAsk = true;
      renderModal(true);
      return;
    }
    closeModal();
  }

  function saveModal() {
    if (!modal) return;
    const d = modal.draft;
    const pendingLabel = document.querySelector('.m-label');
    if (pendingLabel && pendingLabel.value.trim()) {
      d.labels = uniqLabels([...d.labels, ...pendingLabel.value.split(',')]);
      pendingLabel.value = '';
    }
    if (!d.title.trim() && !d.body.trim()) {
      modal.error = true;
      renderModal(true);
      return;
    }
    updateNote(modal.id, { title: d.title.trim(), body: d.body, color: d.color, pinned: d.pinned, labels: uniqLabels(d.labels) });
    closeModal();
    renderAll();
  }

  // ---- ferramentas de formatação sobre o texto selecionado
  function applyTool(ta, d, kind) {
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const value = ta.value;
    const sel = value.slice(start, end);
    let next = value;
    let from = start;
    let to = end;

    const wrap = (pre, post, placeholder) => {
      const inner = sel || placeholder;
      next = value.slice(0, start) + pre + inner + post + value.slice(end);
      from = start + pre.length;
      to = from + inner.length;
    };
    const prefixLines = (prefixFn) => {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      let lineEnd = value.indexOf('\n', end);
      if (lineEnd < 0) lineEnd = value.length;
      const block = value.slice(lineStart, lineEnd).split('\n').map((l, i) => prefixFn(l, i)).join('\n');
      next = value.slice(0, lineStart) + block + value.slice(lineEnd);
      from = lineStart;
      to = lineStart + block.length;
    };

    if (kind === 'bold') wrap('**', '**', t('tools').bold.toLowerCase());
    else if (kind === 'italic') wrap('*', '*', t('tools').italic.toLowerCase());
    else if (kind === 'code') wrap('`', '`', 'code');
    else if (kind === 'link') {
      const text = sel || t('linkText');
      next = value.slice(0, start) + '[' + text + '](https://)' + value.slice(end);
      from = start + text.length + 3;
      to = from + 8;
    } else if (kind === 'heading') prefixLines((l) => (/^#{1,3} /.test(l) ? l.replace(/^#{1,3} /, '') : '## ' + l));
    else if (kind === 'list') prefixLines((l) => (/^- /.test(l) ? l.replace(/^- /, '') : '- ' + l));
    else if (kind === 'check') prefixLines((l) => (/^- \[[ xX]\] /.test(l) ? l.replace(/^- \[[ xX]\] /, '') : '- [ ] ' + l));
    else if (kind === 'quote') prefixLines((l) => (/^> /.test(l) ? l.replace(/^> /, '') : '> ' + l));

    ta.value = next;
    d.body = next;
    ta.focus();
    ta.setSelectionRange(from, to);
  }

  function renderModal(keepScroll) {
    const prev = document.querySelector('.modal-body');
    const scroll = keepScroll && prev ? prev.scrollTop : 0;
    const old = document.querySelector('.overlay');
    if (old) old.remove();
    if (!modal) return;
    const d = modal.draft;
    const note = findNote(modal.id);
    if (!note) { modal = null; return; }

    const titleInput = el('input', {
      type: 'text',
      class: 'm-title',
      value: d.title,
      placeholder: t('fTitle'),
      oninput: (e) => { d.title = e.target.value; },
    });

    // escrever / pré-visualizar
    const bodyArea = el('textarea', {
      class: 'm-body' + (modal.error ? ' invalid' : ''),
      rows: '12',
      placeholder: t('composerBody'),
      oninput: (e) => {
        d.body = e.target.value;
        e.target.classList.remove('invalid');
        modal.error = false;
        const m = document.querySelector('.m-error');
        if (m) m.remove();
        const wc = document.querySelector('.m-words');
        if (wc) wc.textContent = t('words', wordCount(d.body));
      },
    });
    bodyArea.value = d.body;

    const toolbar = el(
      'div',
      { class: 'md-tools' },
      [['bold', 'B'], ['italic', 'I'], ['code', '</>'], ['heading', 'H'], ['list', '•'], ['check', '☑'], ['quote', '❝'], ['link', '🔗']].map(([k, label]) =>
        el('button', {
          class: 'tool tool-' + k,
          type: 'button',
          title: T().tools[k],
          'aria-label': T().tools[k],
          text: label,
          // mousedown não tira o foco (e a seleção) da caixa de texto
          onmousedown: (e) => e.preventDefault(),
          onclick: () => applyTool(bodyArea, d, k),
        })
      )
    );

    const previewBox = el('div', { class: 'md preview' });
    if (d.body.trim()) previewBox.innerHTML = renderMarkdown(d.body);
    else previewBox.append(el('div', { class: 'muted', text: t('previewEmpty') }));
    previewBox.addEventListener('change', (e) => {
      const box = e.target;
      if (!box.matches || !box.matches('input[type="checkbox"][data-line]')) return;
      d.body = toggleCheckLine(d.body, Number(box.dataset.line));
      renderModal(true);
    });
    previewBox.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-url]');
      if (link) { e.preventDefault(); vscode.postMessage({ type: 'openLink', url: link.dataset.url }); }
    });

    const tabs = el(
      'div',
      { class: 'md-tabs' },
      el('button', { class: 'md-tab' + (modal.tab === 'write' ? ' active' : ''), 'data-mtab': 'write', text: t('write'), onclick: () => { modal.tab = 'write'; renderModal(true); } }),
      el('button', { class: 'md-tab' + (modal.tab === 'preview' ? ' active' : ''), 'data-mtab': 'preview', text: t('preview'), onclick: () => { modal.tab = 'preview'; renderModal(true); } }),
      el('span', { class: 'm-words', text: t('words', wordCount(d.body)) })
    );

    const chipsBox = el('div', { class: 'chips' }, d.labels.map((l) => chip(l, () => { d.labels = d.labels.filter((x) => x !== l); renderModal(true); })));
    const labelInput = el('input', {
      type: 'text',
      class: 'm-label',
      list: 'label-list-m',
      placeholder: t('labelPlaceholder'),
      onkeydown: (e) => {
        if ((e.key === 'Enter' || e.key === ',') && !e.isComposing) {
          e.preventDefault();
          e.stopPropagation();
          if (e.target.value.trim()) {
            d.labels = uniqLabels([...d.labels, ...e.target.value.split(',')]);
            renderModal(true);
            const again = document.querySelector('.m-label');
            if (again) again.focus();
          }
        }
      },
    });
    const dl = el('datalist', { id: 'label-list-m' }, allLabels().map((l) => el('option', { value: l })));

    const body = el(
      'div',
      { class: 'modal-body' },
      el('div', { class: 'field' }, titleInput),
      el('div', { class: 'field' }, tabs, modal.tab === 'write' ? [toolbar, bodyArea] : previewBox),
      modal.error ? el('div', { class: 'm-error', text: t('emptyNote') }) : null,
      el('div', { class: 'field' }, el('label', { text: t('fColor') }), buildSwatches(() => d.color, (c) => { d.color = c; renderModal(true); })),
      el('div', { class: 'field' }, el('label', { text: t('fLabels') }), chipsBox, labelInput, dl),
      el('label', { class: 'check-row' }, el('input', { type: 'checkbox', checked: d.pinned, onchange: (e) => { d.pinned = e.target.checked; } }), t('pinnedCheck')),
      el('div', { class: 'dates', text: `${t('created')}: ${fmtLong(note.createdAt)} · ${t('edited')}: ${fmtLong(note.updatedAt)}` })
    );
    const pinBox = body.querySelector('.check-row input');
    if (pinBox) pinBox.checked = d.pinned;

    const banner = modal.dirtyAsk
      ? el('div', { class: 'banner' },
          el('span', { text: t('discardMsg') }),
          el('button', { class: 'btn-danger', text: t('discard'), onclick: closeModal }),
          el('button', { class: 'btn-secondary', text: t('keepEditing'), onclick: () => { modal.dirtyAsk = false; renderModal(true); } }))
      : null;

    const actions = el(
      'div',
      { class: 'modal-actions' },
      modal.confirmDelete
        ? el('span', { class: 'confirm left' },
            t('deleteQ'),
            el('button', { class: 'btn-danger', text: t('yes'), onclick: () => { const id = modal.id; closeModal(); removeNote(id); renderAll(); } }),
            el('button', { class: 'btn-secondary', text: t('no'), onclick: () => { modal.confirmDelete = false; renderModal(true); } }))
        : el('button', { class: 'btn-secondary left', text: t('del'), onclick: () => { modal.confirmDelete = true; renderModal(true); } }),
      el('button', { class: 'btn-secondary', text: t('cancel'), onclick: requestClose }),
      el('button', { class: 'btn-primary', text: t('save'), onclick: saveModal })
    );

    const overlay = el(
      'div',
      {
        class: 'overlay',
        onmousedown: (e) => { if (e.target === overlay) overlay.dataset.down = '1'; else delete overlay.dataset.down; },
        onclick: (e) => { if (e.target === overlay && overlay.dataset.down === '1') requestClose(); },
      },
      el('div', { class: 'modal' + (d.color ? ' c-' + d.color : ''), role: 'dialog', 'aria-modal': 'true' },
        el('div', { class: 'modal-head' },
          el('h2', { text: t('editNote') }),
          el('button', { class: 'icon-btn', title: t('close'), 'aria-label': t('close'), text: '✕', onclick: requestClose })),
        banner,
        body,
        actions)
    );
    document.body.appendChild(overlay);
    const nb = overlay.querySelector('.modal-body');
    if (nb) nb.scrollTop = scroll;
    if (!keepScroll) {
      const target = modal.tab === 'write' && d.body === '' ? bodyArea : titleInput;
      target.focus();
    } else if (modal.error) {
      bodyArea.focus();
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!modal) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      requestClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveModal();
    } else if (e.key === 'Enter' && e.target && e.target.classList && e.target.classList.contains('m-title')) {
      e.preventDefault();
      const b = document.querySelector('.m-body');
      if (b) b.focus();
    }
  });

  // ---------- erro ----------
  function renderError(code, detail) {
    const root = document.getElementById('app');
    root.textContent = '';
    const msg = code === 'nota-not-object' ? t('errNotObject') : t('errInvalid');
    root.append(
      el('div', { class: 'error-box' },
        el('h2', { text: t('errTitle') }),
        el('p', { text: msg }),
        detail ? el('pre', { text: detail }) : null,
        el('button', { class: 'btn-primary', text: t('openAsText'), onclick: () => vscode.postMessage({ type: 'openText' }) }))
    );
  }

  // ---------- mensagens da extensão ----------
  window.addEventListener('message', (event) => {
    const msg = event.data;

    if (msg.type === 'lang') {
      applyLang(msg.lang, false);
      return;
    }
    if (msg.type !== 'load') return;

    const langChanged = !!msg.lang && msg.lang !== lang;
    if (msg.lang) {
      lang = msg.lang === 'pt' ? 'pt' : 'en';
      document.documentElement.lang = lang;
    }

    if (msg.error) {
      loadError = { code: msg.error, detail: msg.detail };
      mainEl = composerEl = tabsEl = null;
      closeModal();
      renderError(msg.error, msg.detail);
      return;
    }

    const wasError = loadError !== null || !mainEl;
    loadError = null;
    state = {
      version: 1,
      nextId: msg.data.nextId,
      notes: msg.data.notes.map(normalizeNote),
    };

    if (wasError || langChanged) buildShell();
    renderAll();
    // atualiza as sugestões de etiquetas do rascunho
    if (langChanged && modal) renderModal(true);
    if (modal && !findNote(modal.id)) closeModal();
  });

  vscode.postMessage({ type: 'ready' });
})();
