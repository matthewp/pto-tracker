import { DefineMap } from 'can'
import convert from 'xml-js'

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
  token: 'string',
  url: 'string',

  requestBodyFor (page = 0) {
    return `
      <?xml version="1.0" encoding="utf-8"?>
      <request method="time_entry.list">
        ${(page > 0) ? `<page>${page}</page>` : ''}
        <per_page>100</per_page>
      </request>
    `
  },

  requestEntries (page = 0) {
    const headers = new window.Headers()
    headers.append('Authorization', `Basic ${window.btoa(this.token + ':' + 'X')}`)
    headers.append('Content-Type', 'application/xml')

    const body = this.requestBodyFor(page)
    return window.fetch(this.url, {
      method: 'POST',
      headers,
      body
    }).then(response => convert.xml2json(response.text()))
  }
})
