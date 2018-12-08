import _ from 'lodash'
import { Component } from 'can'

import APIInfo from '~/models/api-info'
import TimeEntries from '~/models/time-entries'

import view from './dashboard.stache'

const HOURS_PER_MONTH = [13.333, 13.333, 15.333, 15.333, 15.333, 17.333]

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
        const accrued = this.totalAccruedByYear
        const used = this.totalUsedByYear
        if (accrued && used) {
          const result = Object.values(_.mergeWith(accrued, used, (a, u) => a - u))
            .reduce((acc, v) => acc + v)
          return result.toFixed(1)
        }
        return 0.0
      }
    },

    remainingDays: {
      get () {
        return (this.remainingHours / 8).toFixed(1)
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
      if (!firstDay || !lastDay) return undefined

      const firstMonth = parseInt(firstDay.split('-')[1])
      const firstYear = parseInt(firstDay.split('-')[0])

      const today = new Date()
      const lastMonth = today.getMonth()
      const lastYear = today.getFullYear()

      const accruedByYear = {}

      let anniversary = 0
      accruedByYear['' + firstYear] = 0
      for (let m = firstMonth, y = firstYear; m <= 12; m++) {
        accruedByYear['' + y] += HOURS_PER_MONTH[anniversary]
      }

      for (let y = firstYear + 1; y <= lastYear - 1; y++) {
        anniversary += 1
        accruedByYear['' + y] = 0
        for (let m = 1; m <= 12; m++) {
          const increaseBy = (anniversary >= HOURS_PER_MONTH.length)
            ? HOURS_PER_MONTH[HOURS_PER_MONTH.length - 1]
            : HOURS_PER_MONTH[anniversary]
          accruedByYear['' + y] += increaseBy
        }
      }

      anniversary += 1
      accruedByYear['' + lastYear] = 0
      for (let m = 1, y = lastYear; m <= lastMonth; m++) {
        const increaseBy = (anniversary >= HOURS_PER_MONTH.length)
          ? HOURS_PER_MONTH[HOURS_PER_MONTH.length - 1]
          : HOURS_PER_MONTH[anniversary]
        accruedByYear['' + y] += increaseBy
      }
      return accruedByYear
    },

    totalUsedHoursByYear (used) {
      if (!used) return undefined

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
    }
  }
})
