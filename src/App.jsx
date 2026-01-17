import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import './App.css'

const placeholderSvg = (label) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
    <rect width="900" height="1200" fill="#f4f1eb"/>
    <rect x="40" y="40" width="820" height="1120" fill="none" stroke="#1b1b1d" stroke-width="3"/>
    <text x="50%" y="50%" text-anchor="middle" font-size="42" font-family="Space Grotesk, sans-serif" fill="#1b1b1d">${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const galleryItems = [
  { title: 'Fullmetal Alchemist', year: '2020', src: '/art/FMA.jpg' },
  { title: 'Golden Experience Requiem', year: '2019', src: '/art/Giorno.jpg' },
  { title: 'Himiko Toga', year: '2020', src: '/art/TOGA.jpg' },
  { title: 'Super Saiyan 3', year: '2019', src: '/art/SSJ3.jpg' },
  { title: 'Frankenstein', year: '2019', src: '/art/FRANK.jpg' },
  { title: 'Edward Elric', year: '2020', src: '/art/ED.jpg' },
  { title: 'Josuke Higashikata', year: '2019', src: '/art/JOSUKE.jpg' },
  { title: 'Goku', year: '2019', src: '/art/GOKU.jpg' },
  { title: 'Jotaro', year: '2019', src: '/art/JOTARO.jpg' },
].map((item) => ({
  ...item,
  fallback: placeholderSvg(item.title),
}))

function HeroSpotlight({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (items.length === 0) return null

  return (
    <>
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={600}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {items.map((item) => (
          <SwiperSlide key={item.title}>
            <div className="hero-spotlight">
              <img
                className="hero-spotlight-image"
                src={item.src}
                alt={`${item.title} (${item.year})`}
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = item.fallback
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-spotlight-label">
        <span>{items[activeIndex]?.title}</span>
        <span>{items[activeIndex]?.year}</span>
      </div>
    </>
  )
}

function App() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const Reveal = ({ children, className, style, ...rest }) => {
    const ref = useRef(null)
    const controls = useAnimation()
    const isInView = useInView(ref, { amount: 0.2 })

    useEffect(() => {
      controls.start(isInView ? 'visible' : 'hidden')
    }, [controls, isInView])

    return (
      <motion.div
        ref={ref}
        className={className}
        style={style}
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        {...rest}
      >
        {children}
      </motion.div>
    )
  }

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
        return
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % galleryItems.length)
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex])

  const openLightbox = (index) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const showPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
  }

  const showNext = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length)
  }

  return (
    <div className="page">
      <header className="hero">
        <nav className="nav">
          <div className="logo-mark">My Sketchbook</div>
          <div className="nav-links">
            <a href="#gallery">Gallery</a>
            <a href="#about">Studio</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hero-grid">
          <Reveal className="hero-copy">
            <p className="eyebrow">Black + white notes</p>
            <h1>Pages from my sketchbook.</h1>
            <p className="lede">
              A personal stack of drawings, snapshots, and half-finished ideas. These are phone
              photos of ink and graphite studies, kept raw and honest. 
            </p>
            <div className="hero-actions">
              <a className="cta" href="#gallery">
                View the gallery
              </a>
              <a className="ghost" href="#contact">
                Say hi
              </a>
            </div>
            <div className="meta">
              <div>
                <span className="meta-label">Format</span>
                <span>JPG / PNG</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="hero-3d" aria-hidden="true">
            <HeroSpotlight items={galleryItems} />
          </Reveal>
        </div>
      </header>

      <main>
        <section id="gallery" className="section gallery">
          <Reveal className="section-head">
            <h2>Recent Pages</h2>
            <p>
              Here are some of my favorites.
            </p>
          </Reveal>
          <Reveal className="gallery-grid">
            {galleryItems.map((item, index) => (
              <figure
                className="gallery-card"
                key={item.title}
                onClick={() => openLightbox(index)}
              >
                <div className="gallery-media">
                  <img
                    src={item.src}
                    alt={`${item.title} (${item.year})`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = item.fallback
                    }}
                  />
                </div>
                <figcaption>
                  <span>{item.title}</span>
                  <span>{item.year}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        <section id="about" className="section about">
          <Reveal>
            <h2>About the Sketches</h2>
            <p>
              Whenever I see a frame from a show that stands out to me I want to draw it. That is my inspiration for all of this. 
            </p>
          </Reveal>
          <Reveal className="about-card">
            <h3>Tools I grab most</h3>
            <p>Mechanical pencil, cheap ink pens, and my trusty sketchbook.</p>
          </Reveal>
        </section>

        <section id="contact" className="section contact">
          <Reveal>
            <h2>Want to chat?</h2>
            <p>Feel free to reach out with ideas, feedback, or just a quick hello.</p>
            <a className="cta" href="mailto:alphakouanda@gmail.com">
              alphakouanda@gmail.com
            </a>
          </Reveal>
        </section>
      </main>

      <Reveal className="footer">
        <span>© 2026 My Sketchbook</span>
        <span>Handmade and a little messy</span>
      </Reveal>

      {lightboxIndex !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            ×
          </button>
          <button className="lightbox-nav prev" onClick={showPrev} aria-label="Previous">
            ←
          </button>
          <div className="lightbox-body" onClick={closeLightbox} role="presentation">
            <img
              src={galleryItems[lightboxIndex].src}
              alt={`${galleryItems[lightboxIndex].title} (${galleryItems[lightboxIndex].year})`}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = galleryItems[lightboxIndex].fallback
              }}
              onClick={(event) => event.stopPropagation()}
            />
            <div className="lightbox-caption">
              <span>{galleryItems[lightboxIndex].title}</span>
              <span>{galleryItems[lightboxIndex].year}</span>
            </div>
          </div>
          <button className="lightbox-nav next" onClick={showNext} aria-label="Next">
            →
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
