// Chuyển chế độ sáng / tối
const themeToggle = document.querySelector('.theme-toggle')
const root = document.documentElement

function currentTheme() {
  const set = root.getAttribute('data-theme')
  if (set) return set
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark'
  root.setAttribute('data-theme', next)
  try {
    localStorage.setItem('beo-theme', next)
  } catch (e) {}
})

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle')
const menu = document.querySelector('.nav-menu')

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open')
  toggle.setAttribute('aria-expanded', String(open))
})

// Đóng menu khi chọn một mục (mobile)
menu.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    menu.classList.remove('open')
    toggle.setAttribute('aria-expanded', 'false')
  }
})

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.section-head, .service-card, .gallery figure, .steps li, .testimonials blockquote, .strip-item'
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
