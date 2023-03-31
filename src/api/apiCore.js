import axios from 'axios'
import * as types from '@/store/types'
import {serialize} from '@/lib/util'
import config from 'SrcConfig'
import Qs from 'qs'

export default class ApiCore {
  constructor(store, path) {
    this._path = path || ''
    this._baseUrl = config.apiServerUrl + '/api'
    this._store = store
  }

  _urlencode(str) {
    if (str && str.length) {
      return encodeURIComponent(str)
    } else {
      return str
    }
  }

  _setUploadProgress(progress) {
    this._store.commit(types.SET_UPLOAD_PROGRESS, progress)
  }
  _setDownloadProgress(progress) {
    this._store.commit(types.SET_DOWNLOAD_PROGRESS, progress)
  }

  _setOfflineFlag(value) {
    this._store.commit(types.SET_OFFLINE, value)
  }

  _logout() {
    this._store.commit(types.LOGOUT)
  }

  _refresh() {
    return this._sendRequest({
      accessToken: this._store.state.$account.refreshToken,
      path: 'account',
      action: 'refresh',
      method: 'PUT'
    }).then(res => {
      this._store.commit(types.SET_REFRESHED_TOKEN, res)
      return res.accessToken
    })
  }

  _sendRequest(o) {
    const req = {
      url: `${this._baseUrl}${o.path.length ? '/' : ''}${o.path}${o.action ? '/' : ''}${o.action || ''}`,
      method: o.method,
      params: o.params,
      paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'repeat'}),
      onUploadProgress: e => {
        if (o.showProgress) {
          const progress = parseInt((e.loaded * 100) / e.total)
          this._setUploadProgress(progress)
        }
        if (o.onUploadProgress) o.onUploadProgress(e)
      },
      onDownloadProgress: e => {
        if (o.showProgress) {
          const progress = parseInt((e.loaded * 100) / e.total)
          this._setDownloadProgress(progress)
        }
        if (o.onDownloadProgress) o.onDownloadProgress(e)
      }
    }

    if (o.body) req.data = o.body
    else if (o.form) {
      if (o.form instanceof FormData) {
        req.data = o.form
      } else {
        Object.keys(o.form).forEach(key => {
          if (!o.form[key] && o.form[key] !== 0) delete o.form[key]
        })
        req.data = serialize(o.form)
      }
    }

    if (o.accessToken) {
      req.headers = {Authorization: `Bearer ${o.accessToken}`}
    }

    return axios(req)
      .then(res => {
        if (o.showProgress) {
          this._setUploadProgress(0)
          this._setDownloadProgress(0)
        }
        return res.data
      })
      .catch(err => {
        if (o.showProgress) {
          this._setUploadProgress(0)
          this._setDownloadProgress(0)
        }

        if (err.message === 'Network Error') {
          this._setOfflineFlag(true)
        } else if (err.response) {
          delete err.response.request
          if (err.response.status === 401) {
            const accessTokenExpired =
              err.response.headers['www-authenticate'] &&
              err.response.headers['www-authenticate'].includes('The access token is expired')
            if (!accessTokenExpired || (o.path === 'account' && o.action === 'refresh')) {
              this._logout()
            } else
              return this._refresh().then(newToken => {
                o.accessToken = newToken
                return this._sendRequest(o)
              })
          }
          if (
            err.response.status === 401 ||
            err.response.status === 403 ||
            err.response.status === 406 ||
            err.response.status === 407 ||
            err.response.status === 425
          ) {
            this._logout()
          }
          throw err.response
        } else {
          throw err
        }
      })
  }

  _request(o) {
    o.path = this._path

    const account = this._store.state.$account
    if (account) o.accessToken = account.accessToken

    return this._sendRequest(o)
  }
}
