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
      Type: TimeEntries,
      get (__, resolve) {
        const { url, token } = this.apiInfo
        new TimeEntries({ url, token }).requestEntries().then(entries => {
          resolve(entries)
        })
      }
    }
  }
})
