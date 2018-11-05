import { Component } from 'can'
import APIInfo from '~/models/api-info'
import view from './authenticate.stache'

Component.extend({
  tag: 'pto-authenticate',
  view,
  ViewModel: {
    apiInfo: {
      Type: APIInfo
    },
    token: {
      get (lastSetValue) {
        if (lastSetValue) return lastSetValue
        return this.apiInfo.token
      }
    },
    url: {
      default: 'https://bitovi.freshbooks.com/api/2.1/xml-in',
      get (lastSetValue) {
        if (lastSetValue) return lastSetValue
        return this.apiInfo.url
      }
    },
    authenticate () {
      this.apiInfo.token = this.token
      this.apiInfo.url = this.url
    }
  }
})
