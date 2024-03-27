const d = import.meta.glob('./*.svg', {
  eager: true
})

export default Object.entries(d).reduce<{ [props: string]: string }>(
  (totol, [k, v]) => {
    const name = k?.split('/')?.pop()
    if (name) {
      totol[name] = (v as any)?.default
    }
    return totol
  },
  {}
)
