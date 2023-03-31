export function permissionsHaveNamespaces(namespaces, permissions) {
  let nss = namespaces
  if (!Array.isArray(namespaces)) {
    nss = [namespaces]
  }
  return nss.find(ns => permissions.find(p => p === ns || p.startsWith(ns + '.')))
}
