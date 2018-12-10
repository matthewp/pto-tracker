import { Component } from 'can'
import APIInfo from '~/models/api-info'
import view from './authenticate.stache'

const TOKEN_VALIDATE = /\b[0-9a-f]{5,40}\b/

Component.extend({
  tag: 'pto-authenticate',
  view,
  ViewModel: {
    apiInfo: {
      Type: APIInfo
    },

    validToken: {
      default: true,
      type: 'boolean'
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

    authenticate (ev) {
      ev.preventDefault()
      if (TOKEN_VALIDATE.test(this.token)) {
        this.validToken = true

        this.apiInfo.token = this.token
        this.apiInfo.url = this.url
      } else {
        this.validToken = false
        document.querySelector('input#token').select()
      }
    }
  }
})
