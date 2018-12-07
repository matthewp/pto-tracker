import _ from 'lodash'
import { Component } from 'can'

import APIInfo from '~/models/api-info'
import TimeEntries from '~/models/time-entries'

import view from './dashboard.stache'

const HOURS_PER_MONTH_PER_YEAR = [13.333, 13.333, 15.333, 15.333, 15.333, 17.333]

Component.extend({
  tag: 'pto-dashboard',
  view,
  ViewModel: {
    apiInfo: {
      Type: APIInfo
    },

    timeEntries: {
      get (lastSet) {
        if (lastSet) return lastSet
        return new TimeEntries(this.apiInfo)
      }
    },

    remainingHours: {
      get () {
        // const accrued = this.totalAccruedByYear
        // const used = this.totalUsedByYear
        return 59.6
      }
    },

    remainingDays: {
      get () {
        return this.remainingHours / 8
      }
    },

    stopAccruingBy: {
      default: 'Aug 2019'
    },

    totalAccruedByYear: {
      get () {
        const firstDay = this.timeEntries.firstDay
        const lastDay = this.timeEntries.lastDay
        return this.totalAccruedHoursByYear(firstDay, lastDay)
      }
    },

    totalUsedByYear: {
      get () {
        return this.totalUsedHoursByYear(this.timeEntries.allTimeOff)
      }
    },

    totalAccruedHoursByYear (firstDay, lastDay) {
      if (!firstDay || !lastDay) return {}

      const firstMonth = parseInt(firstDay.split('-')[1])
      const firstYear = parseInt(firstDay.split('-')[0])

      const today = new Date()
      const lastMonth = today.getMonth()
      const lastYear = today.getFullYear()

      const accruedByYear = {}

      let anniversary = 0
      accruedByYear['' + firstYear] = 0
      for (let m = firstMonth, y = firstYear; m <= 12; m++) {
        accruedByYear['' + y] += HOURS_PER_MONTH_PER_YEAR[anniversary]
      }

      for (let y = firstYear + 1; y <= lastYear - 1; y++) {
        anniversary += 1
        accruedByYear['' + y] = 0
        for (let m = 1; m <= 12; m++) {
          accruedByYear['' + y] += HOURS_PER_MONTH_PER_YEAR[anniversary]
        }
      }

      anniversary += 1
      accruedByYear['' + lastYear] = 0
      for (let m = 1, y = lastYear; m <= lastMonth; m++) {
        accruedByYear['' + y] += HOURS_PER_MONTH_PER_YEAR[anniversary]
      }
      return accruedByYear
    },

    totalUsedHoursByYear (used) {
      if (!used) return {}

      const total = {}
      const entries = _.groupBy(used, (e) => {
        return e.date.split('-')[0]
      })
      Object.keys(entries).forEach(k => {
        total[k] = entries[k].reduce((acc, e) => {
          return acc + parseFloat(e.hours)
        }, 0)
      })
      return total
    },

    developerMode: {
      default: false
    },

    toggleDevMode () {
      this.developerMode = !this.developerMode
    }
  }
})
