// Chuyển chế độ sáng / tối
const themeToggle = document.querySelector('.theme-toggle')
const root = document.documentElement

function currentTheme() {
  const set = root.getAttribute('data-theme')
  if (set) return set
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('beo-theme', next)
    } catch (e) {}
  })
}

// Header trong suốt trên hero, đặc nền khi cuộn qua
const header = document.querySelector('.site-header')
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle')
const menu = document.querySelector('.nav-menu')

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open')
    toggle.setAttribute('aria-expanded', String(open))
  })

  // Đóng menu khi chọn một mục (mobile) — trừ khi bấm vào nút dropdown
  menu.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
      menu.classList.remove('open')
      toggle.setAttribute('aria-expanded', 'false')
    }
  })
}

// Dropdown "Dịch vụ" — bấm để mở trên mobile
const dropParent = document.querySelector('.has-dropdown')
const dropTrigger = document.querySelector('.dropdown-trigger')
if (dropParent && dropTrigger) {
  dropTrigger.addEventListener('click', () => {
    const open = dropParent.classList.toggle('open')
    dropTrigger.setAttribute('aria-expanded', String(open))
  })
}

// ============ HERO SLIDESHOW ============
const slides = Array.from(document.querySelectorAll('.hero-slide'))
const dots = Array.from(document.querySelectorAll('.hero-dot'))
if (slides.length > 1) {
  let current = 0
  let timer

  function show(i) {
    current = (i + slides.length) % slides.length
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === current))
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === current))
  }

  function next() {
    show(current + 1)
  }

  function start() {
    stop()
    timer = setInterval(next, 5500)
  }

  function stop() {
    if (timer) clearInterval(timer)
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      show(idx)
      start()
    })
  })

  const slider = document.querySelector('.hero-slider')
  if (slider) {
    slider.addEventListener('mouseenter', stop)
    slider.addEventListener('mouseleave', start)
  }

  start()
}

// ============ LỌC BỘ SƯU TẬP THEO TAB ============
const tabs = Array.from(document.querySelectorAll('.gtab'))
const figures = Array.from(document.querySelectorAll('.gallery figure'))
if (tabs.length) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab))
      figures.forEach((fig) => {
        const show = filter === 'all' || fig.dataset.cat === filter
        fig.classList.toggle('is-hidden', !show)
      })
    })
  })
}

// ============ SCROLL REVEAL ============
const revealTargets = document.querySelectorAll(
  '.section-head, .featured-card, .other-grid a, .gallery figure, .price-card, .stat, .value, .exp-card, .steps li, .testimonials blockquote, .branch-card, .blog-card'
)

revealTargets.forEach((el) => el.classList.add('reveal'))

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in')
        io.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15 }
)

revealTargets.forEach((el) => io.observe(el))
