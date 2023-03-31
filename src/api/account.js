import ApiBase from './apiBase'
import 'clientjs'

const client = new ClientJS()
const fingerprint = client.getFingerprint()

export class AccountIdn extends ApiBase {
  constructor(store) {
    const path = 'idn/account'
    super(store, path)
  }

  changePassword(model, showProgress) {
    return this._request({
      action: 'change-password',
      method: 'PATCH',
      body: model,
      showProgress
    })
  }

  havePassword(showProgress = true) {
    return this._request({
      action: 'profile/have-pass',
      method: 'GET',
      showProgress
    })
  }

  logout(showProgress) {
    return this._request({
      action: 'logout',
      method: 'POST',
      showProgress
    }).catch((err) => {
      if (err.status === 412) {
        this._logout()
      } else {
        throw err
      }
    })
  }

  getProfile(showProgress) {
    return this._request({
      action: 'profile',
      method: 'GET',
      showProgress
    })
  }

  setProfile(model, showProgress) {
    return this._request({
      action: 'profile',
      method: 'PUT',
      body: model,
      showProgress
    })
  }
  changeMobile(model, showProgress) {
    return this._request({
      action: 'change-mobile',
      method: 'PATCH',
      body: model,
      showProgress
    })
  }

  changeEmail(newEmail, showProgress) {
    return this._request({
      action: 'change-email',
      method: 'PATCH',
      body: newEmail,
      showProgress
    })
  }

  mobileConfirm(model, showProgress) {
    return this._request({
      action: 'confirm-mobile',
      method: 'POST',
      body: model,
      showProgress
    })
  }
  emailConfirm(model, showProgress) {
    return this._request({
      action: 'confirm-email',
      method: 'POST',
      body: model,
      showProgress
    })
  }
}

export class AccountPub extends ApiBase {
  constructor(store) {
    const path = 'pub/account'
    super(store, path)
  }

  login(model, showProgress) {
    // model.uniqueId = fingerprint
    model.medium = 'WEB'
    // model.panelType = 'ADMIN'
    return this._request({
      action: 'login',
      method: 'POST',
      body: model,
      showProgress
    })
  }

  register(model, showProgress) {
    model.uniqueId = fingerprint
    model.clientType = 'WEB'
    return this._request({
      action: 'register',
      method: 'POST',
      body: model,
      showProgress
    })
  }

  forgotPassword(model, showProgress) {
    return this._request({
      action: 'forget-password',
      method: 'POST',
      body: model,
      showProgress
    })
  }

  resetPassword(model, showProgress) {
    return this._request({
      action: 'reset-password',
      method: 'POST',
      body: model,
      showProgress
    })
  }

  sendOtp(model, showProgress) {
    return this._request({
      action: 'send-otp',
      method: 'POST',
      body: model,
      showProgress
    })
  }

  verifyOtp(model, showProgress) {
    model.uniqueId = fingerprint
    model.clientType = 'WEB'
    model.panelType = 'ADMIN'
    return this._request({
      action: 'verify-otp',
      method: 'POST',
      body: model,
      showProgress
    })
  }
}
