import { DefineMap } from 'can'

/**
 * On the initial request we will get a response that includes an
 * XML element like:
 *
 * <time_entries page="1" per_page="100" pages="10" total="982">
 *
 * Therefore, we need to make a second request the includes the number
 * of `pages`. The last entry of that response should be the first day
 * of billing. From there we can calculate the accural of PTO.
 */

export default DefineMap.extend('TimeEntries', {
  init (url, token) {
    this.requestTimes(url, token)
  },

  requestBody (page = 0) {
    return `
      <?xml version="1.0" encoding="utf-8"?>
      <request method="time_entry.list">
        ${(page > 0) ? `<page>${page}</page>` : ''}
        <per_page>10</per_page>
      </request>
    `
  },

  requestTimes (url, token, page = 0) {
    const headers = new window.Headers()
    headers.append('Authorization', `Basic ${window.btoa(token + ':' + 'X')}`)
    headers.append('Content-Type', 'application/xml')

    const body = this.requestBody(page)
    return window.fetch(url, {
      method: 'POST',
      headers,
      body
    }).then(response => {
      response.json().then(data => {
        console.log(data)
      })
    }).catch(e => {
      // debugger
    })
  }
})
