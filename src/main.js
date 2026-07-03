import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Sync GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// ===========================
// MOBILE HAMBURGER MENU
// ===========================
const navLinks = document.querySelector('.nav-links')

// Inject hamburger button into navbar
const hamburger = document.createElement('button')
hamburger.className = 'hamburger'
hamburger.setAttribute('aria-label', 'Toggle Menu')
hamburger.innerHTML = '<span></span><span></span><span></span>'

const navContainer = document.querySelector('.nav-container')
if (navContainer) {
  navContainer.insertBefore(hamburger, navContainer.firstChild)
}

// Inject overlay
const overlay = document.createElement('div')
overlay.className = 'nav-overlay'
document.body.appendChild(overlay)

function openMenu() {
  hamburger.classList.add('open')
  navLinks?.classList.add('open')
  overlay.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closeMenu() {
  hamburger.classList.remove('open')
  navLinks?.classList.remove('open')
  overlay.classList.remove('open')
  document.body.style.overflow = ''
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu()
})

overlay.addEventListener('click', closeMenu)

// Close on nav link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu)
})



// Sync GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// Navbar Scroll Effect
const navbar = document.getElementById('navbar')
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  })
}

// Premium Animations

// 1. Text Split Reveal (Simulated without SplitText plugin)
const textReveals = document.querySelectorAll('.text-reveal')
textReveals.forEach(el => {
  const text = el.innerText
  el.innerHTML = ''
  // Split by words
  const words = text.split(' ')
  words.forEach(word => {
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.style.overflow = 'hidden'
    span.style.verticalAlign = 'top'
    
    const innerSpan = document.createElement('span')
    innerSpan.style.display = 'inline-block'
    innerSpan.innerText = word + '\u00A0'
    innerSpan.classList.add('word-inner')
    
    span.appendChild(innerSpan)
    el.appendChild(span)
  })

  gsap.fromTo(el.querySelectorAll('.word-inner'), 
    { y: '100%' },
    {
      y: '0%',
      duration: 1,
      stagger: 0.05,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  )
})

// 2. Standard Fade Up
gsap.utils.toArray('.fade-up').forEach(element => {
  gsap.fromTo(element, 
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  )
})

// 3. Clip Path Image Reveal
gsap.utils.toArray('.img-reveal').forEach(element => {
  gsap.fromTo(element,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.5,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  )
})

// 4. Parallax Image Effect
gsap.utils.toArray('.parallax-img').forEach(img => {
  gsap.to(img, {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
})

// Subtle 3D Tilt Effect for Product Cards
const cards = document.querySelectorAll('.product-card')

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  })
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    card.style.transition = 'transform 0.5s ease'
  })
  
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none'
  })
})

// ===========================
// CATEGORY FILTERING
// ===========================
const filterBtns = document.querySelectorAll('.filter-btn')
const productCards = document.querySelectorAll('.product-card[data-category]')

if (filterBtns.length > 0 && productCards.length > 0) {
  
  // Read URL params for direct link filtering (e.g. ?category=sanitaryware)
  const urlParams = new URLSearchParams(window.location.search)
  const initialCategory = urlParams.get('category')
  
  function applyFilter(category) {
    // Update buttons
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active')
        btn.style.background = 'var(--primary-color)'
        btn.style.color = '#fff'
      } else {
        btn.classList.remove('active')
        btn.style.background = 'transparent'
        btn.style.color = 'var(--text-primary)'
      }
    })
    
    // Filter cards
    let visibleCount = 0;
    productCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block'
        gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 })
        visibleCount++;
      } else {
        card.style.display = 'none'
      }
    })
    
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  }

  // Bind click events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter')
      applyFilter(category)
      
      // Update URL without reload
      const newUrl = new URL(window.location)
      newUrl.searchParams.set('category', category)
      window.history.pushState({}, '', newUrl)
    })
  })
  
  // Apply initial filter if present in URL
  if (initialCategory) {
    applyFilter(initialCategory)
  }
}

