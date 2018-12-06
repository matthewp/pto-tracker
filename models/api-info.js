import { DefineMap } from 'can'

export default DefineMap.extend('APIInfo', {
  get isValid () {
    return (this.token && this.url)
      ? this.url.includes('freshbooks') || this.url.includes('billingarm')
      : false
  },

  token: 'string',
  url: 'string'
})
