import { Component } from 'can'
import APIInfo from '~/models/api-info'
import view from './app.stache'

import 'styles.less'

Component.extend({
  tag: 'pto-tracker',
  view,
  ViewModel: {
    get isAuthenticated () {
      return this.apiInfo.isValid
    },
    apiInfo: {
      default () {
        return new APIInfo({})
      }
    }
  }
})
