import ApiBase from './apiBase'
export default class Files extends ApiBase {
  constructor(store) {
    const path = 'pub/files'
    super(store, path)
  }

  upload(files, onUploadProgress, showProgress) {
    const formData = new FormData()
    for (let file of files) {
      formData.append('files', file, file.name)
    }

    return this._request({
      action: 'temp',
      method: 'POST',
      form: formData,
      onUploadProgress,
      showProgress
    })
  }

  delete(fileName, showProgress) {
    return this._request({
      action: `temp/${this._urlencode(fileName)}/`,
      method: 'DELETE',
      showProgress
    })
  }
}
