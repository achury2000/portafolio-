import { useEffect, useRef } from 'react'

interface NameParticlesProps {
  text: string
  className?: string
}

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  size: number
}

export function NameParticles({ text, className = '' }: NameParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const source = document.createElement('canvas')
    const sourceContext = source.getContext('2d')
    if (!sourceContext) return
    const sourceWidth = 1200
    const sourceHeight = 180
    source.width = sourceWidth
    source.height = sourceHeight
    sourceContext.fillStyle = '#fff'
    sourceContext.font = '600 72px Georgia, serif'
    sourceContext.textAlign = 'center'
    sourceContext.textBaseline = 'middle'
    sourceContext.fillText(text, sourceWidth / 2, sourceHeight / 2)

    const pixels = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data
    const particles: Particle[] = []
    for (let y = 0; y < sourceHeight; y += 4) {
      for (let x = 0; x < sourceWidth; x += 4) {
        if (pixels[(y * sourceWidth + x) * 4 + 3] > 120) {
          particles.push({ x, y, targetX: x, targetY: y, vx: 0, vy: 0, size: 1 + Math.random() * 1.5 })
        }
      }
    }

    const pointer = { x: -1000, y: -1000 }
    let width = 1
    let height = 1
    let scale = 1
    let animationFrame = 0

    const resize = () => {
      const bounds = container.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      scale = Math.min(width / sourceWidth, height / sourceHeight)
      const pixelRatio = Math.min(window.devicePixelRatio, 2)
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
    }
    const onPointerLeave = () => { pointer.x = -1000; pointer.y = -1000 }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    resize()

    const render = () => {
      context.clearRect(0, 0, width, height)
      const offsetX = (width - sourceWidth * scale) / 2
      const offsetY = (height - sourceHeight * scale) / 2
      context.globalCompositeOperation = 'lighter'
      for (const particle of particles) {
        const targetX = offsetX + particle.targetX * scale
        const targetY = offsetY + particle.targetY * scale
        const currentX = offsetX + particle.x * scale
        const currentY = offsetY + particle.y * scale
        const dx = currentX - pointer.x
        const dy = currentY - pointer.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 115) {
          const force = (1 - distance / 115) * 1.8
          particle.vx += (dx / (distance || 1)) * force
          particle.vy += (dy / (distance || 1)) * force
        }
        particle.vx += (targetX - currentX) * 0.012
        particle.vy += (targetY - currentY) * 0.012
        particle.vx *= 0.86
        particle.vy *= 0.86
        particle.x += particle.vx / scale
        particle.y += particle.vy / scale
        context.fillStyle = `rgba(255, ${75 + Math.round((particle.targetX / sourceWidth) * 100)}, ${180 + Math.round((particle.targetY / sourceHeight) * 60)}, .78)`
        context.beginPath()
        context.arc(offsetX + particle.x * scale, offsetY + particle.y * scale, particle.size * scale, 0, Math.PI * 2)
        context.fill()
      }
      context.globalCompositeOperation = 'source-over'
      animationFrame = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [text])

  return <div ref={containerRef} className={`name-particles ${className}`} aria-label={text} role="img"><canvas ref={canvasRef} /></div>
}
