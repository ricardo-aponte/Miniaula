// Menús de los navbars públicos. Las secciones sin vista propia apuntan al inicio
// mientras se completan las páginas pendientes (ver deuda técnica en AGENTS.md).
export const SITE_TITLE = 'MiniAula';

export const HOME_MENU_ITEMS = [
  { name: 'Conociendo la página', href: '/' },
  {
    name: 'Investigación',
    children: [
      { name: 'Centro de Investigación', href: '/' },
      { name: 'Investigación Estudiantil', href: '/' },
    ],
  },
  {
    name: 'Más',
    align: 'right', // submenu se despliega hacia la izquierda para no salir del borde
    children: [
      { name: 'Apoyo Docente', href: '/' },
      { name: 'Plataforma Virtual', href: '/login' },
    ],
  },
];

export const AUTH_MENU_ITEMS = [
  { name: 'Presencial', href: '/' },
  { name: 'Semipresencial', href: '/' },
  {
    name: 'Acceso',
    align: 'right', // submenu se despliega hacia la izquierda para no salir del borde
    children: [
      { name: 'Apoyo Docente', href: '/' },
      { name: 'Unirse', href: '/register' },
    ],
  },
];
