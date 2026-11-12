import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, MoveUpRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot" /> OBJETOS PARA EL DÍA A DÍA</span>
        <h1 id="hero-title">Mejor espacio.<br /><em>Mejor ritmo.</em></h1>
        <p>Pequeños detalles de tecnología que hacen que trabajar, crear y jugar se sienta más natural.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/products">Explorar la tienda <ArrowRight aria-hidden="true" size={16} /></Link>
          <a className="hero-secondary-link" href="#enfoque">Conoce NODO <MoveUpRight aria-hidden="true" size={15} /></a>
        </div>
        <div className="hero-caption"><span>01 / DISEÑO FUNCIONAL</span><span>Hecho para seguir tu ritmo <ArrowDown aria-hidden="true" size={13} /></span></div>
      </div>
      <div className="hero-image-wrap">
        <Image
          className="hero-image"
          src="/images/store-hero.png"
          alt="Teclado mecánico y ratón sobre una mesa de trabajo luminosa"
          width={1280}
          height={853}
          priority
          sizes="(max-width: 760px) 100vw, 54vw"
        />
        <div className="hero-image-outline"><span>01 / NODO</span><span>La tecnología también puede sentirse sencilla.</span></div>
      </div>
    </section>
  )
}
