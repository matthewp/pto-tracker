import { Component } from 'can'
import APIInfo from '~/models/api-info'
import TimeEntries from '~/models/time-entries'
import view from './dashboard.stache'

Component.extend({
  tag: 'pto-dashboard',
  view,
  ViewModel: {
    apiInfo: {
      Type: APIInfo
    },
    timeEntries: {
      default () {
        const { url, token } = this.apiInfo
        return new TimeEntries(url, token)
      },
      Type: TimeEntries
    }
  }
})
