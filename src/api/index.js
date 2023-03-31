import {AccountIdn, AccountPub} from './account'
import Files from './files'
export default (store) => ({
  accountIdn: new AccountIdn(store),
  accountPub: new AccountPub(store),
  files: new Files(store),
})
