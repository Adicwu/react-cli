const isDev = import.meta.env.DEV

function jump(url: string, { open = false } = {}) {
  if (open) {
    window.open(url)
  } else {
    location.href = url
  }
}

export function jumpLogin() {
  location.href = `${
    isDev ? '/login.html' : '/login'
  }?redirect=${encodeURIComponent(location.href)}`
}
