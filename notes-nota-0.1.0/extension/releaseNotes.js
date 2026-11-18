'use strict';

// Notas de versão, da mais recente para a mais antiga. Ao publicar uma versão nova,
// acrescenta uma entrada no topo (e atualiza "version" no package.json).
module.exports = [
  {
    version: '0.1.0',
    date: '2026-11-18',
    en: {
      title: 'First release',
      sections: [
        { heading: 'What\'s new', items: [
          'Visual notebook: notes as cards in a grid or as a list.',
          'Quick note box at the top: write and press Ctrl+Enter to save.',
          'Markdown with live preview: headings, bold, italic, code, quotes, links and checklists you can tick right on the card.',
          'Colors, labels, pinned notes and an archive.',
          'Search, label filter and sorting.',
          'Activity Bar panel listing every notebook, with note counts on hover.',
          'English / Portuguese interface (defaults to the VS Code language).',
          'This release notes page, shown after each update (can be turned off).',
        ] },
      ],
    },
    pt: {
      title: 'Primeira versão',
      sections: [
        { heading: 'Novidades', items: [
          'Caderno visual: notas em cartões numa grelha ou em lista.',
          'Caixa de nota rápida no topo: escreve e carrega Ctrl+Enter para guardar.',
          'Markdown com pré-visualização: títulos, negrito, itálico, código, citações, ligações e listas de verificação que marcas diretamente no cartão.',
          'Cores, etiquetas, notas fixadas e um arquivo.',
          'Pesquisa, filtro por etiqueta e ordenação.',
          'Painel na Barra de Atividade com todos os cadernos, e o número de notas ao passar o rato.',
          'Interface em inglês / português (por omissão, o idioma do VS Code).',
          'Esta página de notas de versão, mostrada após cada atualização (pode ser desligada).',
        ] },
      ],
    },
  },
];
