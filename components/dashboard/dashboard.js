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

    entriesByYear (entries) {
      if (entries) {
        const grouped = _.groupBy(entries, (e) => {
          return e.date.split('-')[0]
        })
        return grouped
      }
      return {}
    },

    totalAccruedHoursByYear () {
      const firstDay = this.timeEntries.firstDay
      const lastDay = this.timeEntries.lastDay
      if (firstDay && lastDay) {
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
      }
      return {}
    },

    totalUsedHoursByYear () {
      const entries = this.entriesByYear(this.timeEntries.allTimeOff)
      const total = {}
      if (entries) {
        Object.keys(entries).forEach(k => {
          total[k] = entries[k].reduce((acc, e) => {
            return acc + parseFloat(e.hours)
          }, 0)
        })
      }
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
