// ============ FORM ĐẶT LỊCH ============
const BOOKING_WEBHOOK_URL = 'https://n8n.beostudio.top/webhook/web-dat-lich'

document.querySelectorAll('.booking-form').forEach((form) => {
  const statusEl = form.querySelector('.form-status')
  const submitBtn = form.querySelector('button[type="submit"]')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (statusEl) {
      statusEl.textContent = ''
      statusEl.classList.remove('is-success', 'is-error')
    }

    const data = Object.fromEntries(new FormData(form).entries())
    if (!data.ten || !data.sdt) {
      if (statusEl) {
        statusEl.textContent = 'Anh/chị điền giúp họ tên và số điện thoại nhé.'
        statusEl.classList.add('is-error')
      }
      return
    }

    if (submitBtn) submitBtn.disabled = true

    try {
      const res = await fetch(BOOKING_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('request failed')
      if (statusEl) {
        statusEl.textContent = 'Đã nhận thông tin — BEO sẽ liên hệ lại sớm nhất. Cảm ơn anh/chị!'
        statusEl.classList.add('is-success')
      }
      form.reset()
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = 'Gửi chưa thành công, anh/chị gọi trực tiếp 0792 792 679 giúp mình nhé.'
        statusEl.classList.add('is-error')
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false
    }
  })
})

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

// ============ NỘI DUNG QUẢN LÝ QUA CMS (gallery / bảng giá / cảm nhận) ============
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    return null
  }
}

function renderGallery(container, items) {
  container.innerHTML = items.map((it) => `
    <figure class="arch" data-cat="${escapeHtml(it.category)}">
      <img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.alt)}" width="600" height="800" loading="lazy" />
      <figcaption>${escapeHtml(it.caption)}</figcaption>
    </figure>
  `).join('')
}

function renderPricing(container, items) {
  container.innerHTML = items.map((p) => {
    const badgeClass = p.badge === 'Cao cấp' ? ' price-badge--soft' : ''
    const cardClass = p.badge === 'Bán chạy nhất' ? ' is-featured' : ''
    const badge = p.badge ? `<span class="price-badge${badgeClass}">${escapeHtml(p.badge)}</span>` : ''
    const included = (p.included || []).map((i) => `<li>${escapeHtml(i)}</li>`).join('')
    const products = (p.products || []).map((i) => `<li>${escapeHtml(i)}</li>`).join('')
    return `
      <article class="price-card${cardClass}">
        ${badge}
        <h3>${escapeHtml(p.name)}</h3>
        <p class="price">${escapeHtml(p.price)}</p>
        <div class="price-block"><span class="price-label">Gói chụp gồm</span><ul>${included}</ul></div>
        <div class="price-block"><span class="price-label">Sản phẩm nhận được</span><ul>${products}</ul></div>
        <a class="btn btn-primary" href="tel:0792792679">Đặt lịch ngay</a>
      </article>
    `
  }).join('')
}

function renderTestimonials(container, items, chiNhanh) {
  const filtered = chiNhanh ? items.filter((t) => t.chi_nhanh === chiNhanh) : items
  container.innerHTML = filtered.map((t) => `
    <blockquote>
      <p>${escapeHtml(t.quote)}</p>
      <footer>${escapeHtml(t.author)}</footer>
    </blockquote>
  `).join('')
}

async function initCmsContent() {
  const galleryEl = document.querySelector('[data-cms="gallery"]')
  const pricingEl = document.querySelector('[data-cms="pricing"]')
  const testimonialsEl = document.querySelector('[data-cms="testimonials"]')

  const tasks = []
  if (galleryEl) tasks.push(loadJSON('/content/gallery.json').then((d) => d && renderGallery(galleryEl, d.items || [])))
  if (pricingEl) tasks.push(loadJSON('/content/pricing.json').then((d) => d && renderPricing(pricingEl, d.items || [])))
  if (testimonialsEl) {
    tasks.push(
      loadJSON('/content/testimonials.json').then(
        (d) => d && renderTestimonials(testimonialsEl, d.items || [], testimonialsEl.dataset.chiNhanh || null)
      )
    )
  }
  await Promise.all(tasks)
}

// ============ LỌC BỘ SƯU TẬP THEO TAB (query động vì ảnh render sau) ============
function setupGalleryTabs() {
  const tabs = Array.from(document.querySelectorAll('.gtab'))
  if (!tabs.length) return
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab))
      const figures = Array.from(document.querySelectorAll('.gallery figure'))
      figures.forEach((fig) => {
        const show = filter === 'all' || fig.dataset.cat === filter
        fig.classList.toggle('is-hidden', !show)
      })
    })
  })
}

// ============ SCROLL REVEAL ============
function setupScrollReveal() {
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
}

initCmsContent().then(() => {
  setupGalleryTabs()
  setupScrollReveal()
})
