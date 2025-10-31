/**
 * Removes http:// or https:// from the URLs and trims spaces
 * conserving only the domain
 * @param {Array<string>} websites Array of websites
 * @returns {Array<string>} Trimmed websites
 */
export default function trimWebsites (websites) {
  websites = websites.split(',')
  return websites.map(url => url.trim().replace(/^https?:\/\//, ''))
}
