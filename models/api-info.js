import { DefineMap } from 'can'

export default DefineMap.extend('APIInfo', {
  get isValid () {
    if (this.token && this.url) {
      return this.url.includes('freshbooks') ||
        this.url.includes('billingarm')
    }
    return false
  },
  token: 'string',
  url: 'string'
})
