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
      get () {
        return new TimeEntries(this.apiInfo)
      }
    },

    remainingHours: {
      default: 59.6,
    },

    get remainingDays() {
      return this.remainingHours / 8;
    },

    stopAccruingBy: {
      default: 'Aug 2019'
    },

    developerMode: {
      default: false
    },

    toggleDevMode () {
      this.developerMode = !this.developerMode
    }
  }
})
