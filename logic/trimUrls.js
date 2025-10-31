export default function trimUrls (urls) {
  urls = urls.split(',')
  return urls.map(url => url.trim().replace(/^https?:\/\//, ''))
}
