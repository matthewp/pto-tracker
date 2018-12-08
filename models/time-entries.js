import { DefineMap } from 'can'
import convert from 'xml-js'
import moment from 'moment'

import APIInfo from '~/models/api-info'

export default DefineMap.extend('TimeEntries', {
  init (apiInfo) {
    this.apiInfo = apiInfo
    this.setFirstAndLastDays()
  },

  allTimeOff: {
    get (lastSet, resolve) {
      if (lastSet) return lastSet

      const promised = []
      const today = moment()
      this.requestEntries(1, true).then(entries => {
        promised.push(Promise.resolve(entries))

        let current = 2
        const howMany = this.howManyPages(entries)
        while (current <= howMany) {
          promised.push(this.requestEntries(current, true))
          current += 1
        }
        Promise.all(promised).then(results => {
          const collected = results.map(r => {
            const entries = []
            r.response.time_entries.time_entry.forEach(e => {
              const date = moment(e.date._text, 'YYYY-MM-DD')
              if (date.isBefore(today) || date.isSame(today)) {
                entries.push({ date: e.date._text, hours: e.hours._text })
              }
            })
            return entries
          })
          resolve([].concat.apply([], collected))
        })
      })
    }
  },

  apiInfo: {
    Type: APIInfo
  },

  firstDay: 'string',

  lastDay: 'string',

  setFirstAndLastDays () {
    return this.requestEntries().then(entries => {
      return this.requestEntries(this.howManyPages(entries)).then(earliest => {
        this.lastDay =
          this.selectEntryAt(entries, 0).date._text

        const selected = earliest.response.time_entries.time_entry.length - 1
        this.firstDay =
          this.selectEntryAt(earliest, selected).date._text
      })
    })
  },

  howManyPages (entries) {
    return parseInt(entries.response.time_entries._attributes.pages)
  },

  requestBodyFor (page = 1, filterByTask = false) {
    return `
      <?xml version="1.0" encoding="utf-8"?>
      <request method="time_entry.list">
        ${(filterByTask) ? '<task_id>48</task_id>' : ''}
        <page>${page}</page>
        <per_page>100</per_page>
      </request>
    `
  },

  requestEntries (page = 1, filter = false) {
    const headers = new window.Headers()
    headers.append('Authorization', `Basic ${window.btoa(this.apiInfo.token + ':' + 'X')}`)
    headers.append('Content-Type', 'application/xml')
    const body = this.requestBodyFor(page, filter)

    return window.fetch(this.apiInfo.url, {
      method: 'POST',
      headers,
      body
    }).then(response => {
      return response.text().then(result => {
        const xmlText = convert.xml2json(result, { compact: true })
        return JSON.parse(xmlText)
      })
    })
  },

  selectEntryAt (entries, where) {
    return entries.response.time_entries.time_entry[where]
  }
})
