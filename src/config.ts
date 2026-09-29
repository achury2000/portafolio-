export const portfolioConfig = {
  name: 'Cristian Mateo Achury Arboleda',
  role: 'Desarrollador frontend',
  profileImage: 'profile.jpg',
  email: '[TU EMAIL]',
  github: 'https://github.com/achury2000',
  linkedin: 'https://www.linkedin.com/in/cristian-mateo-achury-arboleda-39b4b9246',
  whatsapp: 'https://wa.me/qr/WSVOIKRLHGQJL1',
  availability: 'Disponible para proyectos',
  intro: 'Construyo experiencias web limpias, rápidas y difíciles de olvidar.',
  about: [
    'Soy Cristian, desarrollador frontend con curiosidad por convertir ideas complejas en interfaces claras, vivas y fáciles de recorrer.',
    'Me muevo entre el diseño, el código y la mejora continua: cuido la jerarquía visual, el rendimiento y cada detalle que hace que una experiencia se sienta natural.',
    'Ahora estoy profundizando en animación web, sistemas de diseño y nuevas formas de contar historias con tecnología.',
  ],
  stats: [
    { value: 12, suffix: '+', label: 'Proyectos terminados' },
    { value: 3, suffix: ' años', label: 'Creando interfaces web' },
    { value: 100, suffix: '%', label: 'Enfoque responsive' },
    { value: 8, suffix: '+', label: 'Tecnologías dominadas' },
  ],
  projects: [
    { number: '01', title: 'Panel de Analítica', description: 'Dashboard responsive para visualizar métricas, detectar patrones y filtrar datos sin fricción.', stack: ['React', 'TypeScript', 'CSS'], type: 'Sistema de datos', accent: 'violet' },
    { number: '02', title: 'Ecommerce Moderno', description: 'Tienda con catálogo, tarjetas de producto y un flujo de compra pensado para convertir.', stack: ['Vite', 'React', 'UX'], type: 'Experiencia de compra', accent: 'orange' },
    { number: '03', title: 'Landing SaaS', description: 'Página de conversión con secciones reutilizables, narrativa precisa y excelente rendimiento.', stack: ['HTML', 'CSS', 'SEO'], type: 'Producto digital', accent: 'pink' },
  ],
  skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Responsive Design', 'Git', 'APIs REST'],
  socials: [
    { label: 'GitHub', eyebrow: 'Código y experimentos', mark: 'GH', className: 'social-github', href: 'https://github.com/achury2000' },
    { label: 'LinkedIn', eyebrow: 'Trayectoria profesional', mark: 'in', className: 'social-linkedin', href: 'https://www.linkedin.com/in/cristian-mateo-achury-arboleda-39b4b9246' },
    { label: 'WhatsApp', eyebrow: 'Hablemos directo', mark: 'WA', className: 'social-whatsapp', href: 'https://wa.me/qr/WSVOIKRLHGQJL1' },
  ],
} as const