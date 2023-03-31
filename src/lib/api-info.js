export function $roles(filter) {
  return this.$api.roles.getAllInfo(filter)
}

export function $countries(filter) {
  filter['sort[0].column'] = 'sortOrder'
  filter['sort[0].type'] = 'ASCENDING'
  return this.$api.countries.getAllInfo(filter)
}

export function $provinces(filter) {
  filter['sort[0].column'] = 'sortOrder'
  filter['sort[0].type'] = 'ASCENDING'
  return this.$api.provinces.getAllInfo(filter)
}

export function $cities(filter) {
  filter['sort[0].column'] = 'sortOrder'
  filter['sort[0].type'] = 'ASCENDING'
  return this.$api.cities.getAllInfo(filter)
}

export function $users(filter) {
  return this.$api.users.getAllInfo(filter)
}
