import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolioConfig as content } from './config'
import { NameParticles } from './NameParticles'
import './App.css'

const navItems = [['Inicio', '#inicio'], ['Sobre mí', '#sobre-mi'], ['Proyectos', '#proyectos'], ['Habilidades', '#habilidades'], ['Redes', '#redes'], ['Contacto', '#contacto']] as const
const glitchChars = '.,-~+:;=*!?&#$@0123456789'
gsap.registerPlugin(ScrollTrigger)

function AsciiGlitchText({ children, className = '' }: { children: string; className?: string }) {
  const [display, setDisplay] = useState(children)
  const frameRef = useRef<number | null>(null)

  const animate = () => {
    const startedAt = performance.now()
    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / 620, 1)
      const revealAt = Math.floor(progress * children.length)
      setDisplay(children.split('').map((character, index) => {
        if (character === ' ' || index < revealAt) return character
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
      }).join(''))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
      else setDisplay(children)
    }
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }, [])

  return <span className={`glitch-text ${className}`} onMouseEnter={animate} onFocus={animate}>{display}</span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const statsRef = useRef<HTMLElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.to('.hero-content', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.45 } })
    })
    return () => context.revert()
  }, [])

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video?.pause()
      return
    }
    let pauseTimer: number | undefined
    let reverseFrame = 0
    let lastReverseTime = 0
    let previousScrollY = window.scrollY
    let direction: 'up' | 'down' = 'down'
    const reversePlayback = (time: number) => {
      if (direction !== 'up') {
        reverseFrame = 0
        lastReverseTime = 0
        return
      }
      const elapsed = lastReverseTime ? Math.min((time - lastReverseTime) / 1000, 0.05) : 0
      lastReverseTime = time
      video.currentTime = Math.max(0, video.currentTime - elapsed)
      reverseFrame = requestAnimationFrame(reversePlayback)
    }
    const respondToMovement = (scrollDelta: number) => {
      if (scrollDelta === 0) return
      previousScrollY = window.scrollY
      if (scrollDelta < 0) {
        direction = 'up'
        video.pause()
        if (!reverseFrame) reverseFrame = requestAnimationFrame(reversePlayback)
      } else {
        direction = 'down'
        if (reverseFrame) cancelAnimationFrame(reverseFrame)
        reverseFrame = 0
        lastReverseTime = 0
        void video.play().catch(() => undefined)
      }
      window.clearTimeout(pauseTimer)
      pauseTimer = window.setTimeout(() => {
        video.pause()
        if (reverseFrame) cancelAnimationFrame(reverseFrame)
        reverseFrame = 0
        lastReverseTime = 0
      }, 32)
    }
    const playWhileScrolling = () => {
      respondToMovement(window.scrollY - previousScrollY)
    }
    const respondToWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 0) respondToMovement(event.deltaY)
    }
    window.addEventListener('scroll', playWhileScrolling, { passive: true })
    window.addEventListener('wheel', respondToWheel, { passive: true })
    return () => {
      window.removeEventListener('scroll', playWhileScrolling)
      window.removeEventListener('wheel', respondToWheel)
      window.clearTimeout(pauseTimer)
      if (reverseFrame) cancelAnimationFrame(reverseFrame)
      video.pause()
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.16 })
    const sections = document.querySelectorAll<HTMLElement>('[data-reveal]')
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const statSection = statsRef.current
    if (!statSection) return
    const counters = statSection.querySelectorAll<HTMLElement>('[data-count]')
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      counters.forEach((counter) => {
        const target = Number(counter.dataset.count)
        const start = performance.now()
        const tick = (time: number) => {
          const progress = Math.min((time - start) / 1300, 1)
          counter.textContent = String(Math.round((1 - Math.pow(1 - progress, 3)) * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
      observer.disconnect()
    }, { threshold: 0.7 })
    observer.observe(statSection)
    return () => observer.disconnect()
  }, [])

    return <div className="site-shell">
      <div className="cosmic-background" aria-hidden="true"><video ref={heroVideoRef} className="cosmic-video" muted loop playsInline preload="metadata" poster={`${import.meta.env.BASE_URL}favicon.svg`}><source src={`${import.meta.env.BASE_URL}portfolio-video.mp4`} type="video/mp4" /><source src={`${import.meta.env.BASE_URL}cosmic.mp4`} type="video/mp4" /></video><div className="cosmic-vignette" /></div>
      <div className="nebula" aria-hidden="true" /><div className="film-grain" aria-hidden="true" />
      <header className={`nav-wrap ${scrolled ? 'nav-wrap--scrolled' : ''}`}><a className="brand" href="#inicio" aria-label="Volver al inicio">CMA<span>.</span></a><button className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button><nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Navegación principal">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}><AsciiGlitchText>{label}</AsciiGlitchText></a>)}</nav></header>
      <main>
        <section className="hero" id="inicio"><div className="hero-visual" aria-hidden="true"><div className="planet" /><div className="orbit orbit--one" /><div className="orbit orbit--two" /><div className="starfield" /></div><div className="hero-content"><p className="eyebrow"><span className="pulse-dot" /> {content.availability}</p><p className="hero-kicker">Portafolio / 2026</p><h1><AsciiGlitchText>Desarrollador</AsciiGlitchText></h1><p className="hero-intro">{content.intro}</p><a className="circle-link" href="#proyectos" aria-label="Ver proyectos"><span>↘</span></a></div><div className="scroll-cue"><span>Scroll para explorar</span><i /></div><div className="hero-index">01 <span>/</span> 07</div></section>
        <section className="stats-bar" ref={statsRef} aria-label="Resultados">{content.stats.map((stat) => <div className="stat" key={stat.label}><strong><span data-count={stat.value}>0</span>{stat.suffix}</strong><span>{stat.label}</span></div>)}</section>
        <section className="section about-section" id="sobre-mi" data-reveal><div className="section-marker">02 <span>/</span> Sobre mí</div><div className="about-grid"><div className="portrait-wrap"><div className="portrait-placeholder"><span className="portrait-fallback">CMA</span><img src={`${import.meta.env.BASE_URL}${content.profileImage}`} alt={content.name} loading="lazy" /><small>CRISTIAN ACHURY</small></div><div className="portrait-orbit" /></div><div className="about-copy"><p className="eyebrow">La persona detrás del píxel</p><h2><AsciiGlitchText>Creo interfaces claras con obsesión por el detalle.</AsciiGlitchText></h2><NameParticles text={content.name} />{content.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a className="text-link" href="#contacto">Conozcámonos <span>↗</span></a></div></div></section>
        <section className="section projects-section" id="proyectos" data-reveal><div className="section-heading"><div className="section-marker">03 <span>/</span> Proyectos</div><h2><AsciiGlitchText>Trabajo</AsciiGlitchText><br /><em><AsciiGlitchText>destacado</AsciiGlitchText></em></h2><p>Soluciones pensadas para rendimiento, claridad visual y experiencia de usuario.</p></div><div className="project-list">{content.projects.map((project) => <article className={`project project--${project.accent}`} key={project.title}><div className="project-art"><div className="art-window"><div className="window-bar"><i /><i /><i /></div><div className="art-content"><span className="art-label">{project.type}</span><b>{project.number}</b><div className="art-lines"><i /><i /><i /></div></div></div></div><div className="project-copy"><span className="project-number">{project.number}</span><h3><AsciiGlitchText>{project.title}</AsciiGlitchText></h3><p>{project.description}</p><div className="tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links"><a href="#contacto"><AsciiGlitchText>Ver proyecto</AsciiGlitchText> <span>↗</span></a><span className="placeholder">[LINK DEMO] · [LINK CÓDIGO]</span></div></div></article>)}</div></section>
        <section className="section skills-section" id="habilidades" data-reveal><div className="section-marker">04 <span>/</span> Habilidades</div><div className="skills-intro"><h2><AsciiGlitchText>Herramientas</AsciiGlitchText><br /><em><AsciiGlitchText>para dar forma</AsciiGlitchText></em></h2><p>Una mezcla de sensibilidad visual y precisión técnica para que cada interfaz tenga intención.</p></div><div className="skills-grid">{content.skills.map((skill, index) => <div className="skill" key={skill}><span>0{index + 1}</span><strong>{skill}</strong><i>↗</i></div>)}</div></section>
        <section className="section process-section" id="proceso" data-reveal><div className="section-marker">05 <span>/</span> Proceso</div><div className="process-heading"><h2><AsciiGlitchText>Cómo</AsciiGlitchText><br /><em><AsciiGlitchText>trabajo</AsciiGlitchText></em></h2><p>Las buenas experiencias no aparecen por accidente. Se construyen con preguntas, criterio y código.</p></div><div className="process-list">{[['01', 'Descubrimiento', 'Entiendo el objetivo, el público y las acciones clave del sitio.'], ['02', 'Diseño funcional', 'Organizo contenido, jerarquía visual y flujos fáciles de recorrer.'], ['03', 'Desarrollo', 'Implemento una interfaz rápida, mantenible y adaptable a todas las pantallas.']].map(([number, title, description]) => <div className="process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
        <section className="section socials-section" id="redes" data-reveal><div className="section-marker">06 <span>/</span> Mis redes</div><div className="socials-heading"><h2><AsciiGlitchText>Conectemos</AsciiGlitchText><br /><em><AsciiGlitchText>en órbita.</AsciiGlitchText></em></h2><p>Encuéntrame, mira lo que estoy construyendo y hablemos de la próxima idea.</p></div><div className="social-grid">{content.socials.map((social, index) => <a className={`social-card ${social.className}`} href={social.href} target="_blank" rel="noreferrer" key={social.label}><span className="social-index">0{index + 1}</span><div className="social-mark">{social.mark}</div><div className="social-card-copy"><span>{social.eyebrow}</span><strong><AsciiGlitchText>{social.label}</AsciiGlitchText> <i>↗</i></strong></div></a>)}</div></section>
        <section className="contact-section" id="contacto" data-reveal><div className="contact-star" aria-hidden="true">✦</div><div className="section-marker">07 <span>/</span> Contacto</div><h2><AsciiGlitchText>Hablemos de tu</AsciiGlitchText><br /><em><AsciiGlitchText>próximo proyecto.</AsciiGlitchText></em></h2><p>Una buena idea merece una interfaz a su altura.</p><div className="contact-links"><a className="contact-primary" href={`mailto:${content.email}`}><AsciiGlitchText>{content.email}</AsciiGlitchText> <span>↗</span></a><a href={content.github} target="_blank" rel="noreferrer"><AsciiGlitchText>GitHub</AsciiGlitchText> <span>↗</span></a><a href={content.linkedin} target="_blank" rel="noreferrer"><AsciiGlitchText>LinkedIn</AsciiGlitchText> <span>↗</span></a></div></section>
      </main><footer><span>© 2026 {content.name} — Hecho con café y código.</span><a href="#inicio">Volver arriba ↑</a></footer>
    </div>
  }

export default App
