export function set(name, value) {
  const obj = { v: value }
  localStorage.setItem(name, JSON.stringify(obj))
}

export function get(name) {
  let value = localStorage.getItem(name)
  if (value === null) return null

  const obj = JSON.parse(value)
  return obj.v
}

export function remove(name) {
  localStorage.removeItem(name)
}

export function clear() {
  localStorage.clear()
}