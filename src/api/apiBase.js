import ApiCore from './apiCore'

export default class apiBase extends ApiCore {
  getAll(filter, showProgress) {
    return this._request({
      method: 'GET',
      params: filter,
      showProgress
    })
  }

  create(model, showProgress) {
    return this._request({
      method: 'POST',
      body: model,
      showProgress
    })
  }

  update(id, model, showProgress) {
    return this._request({
      action: this._urlencode(id),
      method: 'PUT',
      body: model,
      showProgress
    })
  }

  getById(id, filter, showProgress) {
    return this._request({
      action: this._urlencode(id),
      method: 'GET',
      params: filter,
      showProgress
    })
  }

  delete(id, showProgress) {
    return this._request({
      action: this._urlencode(id),
      method: 'DELETE',
      showProgress
    })
  }

  count(filter, showProgress) {
    return this._request({
      action: 'count',
      method: 'GET',
      params: filter,
      showProgress
    })
  }
}
