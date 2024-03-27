import './tailwind.css'

if (import.meta.env.DEV) {
  const el = document.createElement('link')
  el.setAttribute('rel', 'stylesheet')
  el.setAttribute('href', '//at.alicdn.com/t/c/font_4418931_s9qoayrc7an.css')
  document.head.appendChild(el)
}
