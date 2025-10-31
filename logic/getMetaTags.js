import axios from 'axios'
import * as cheerio from 'cheerio'

const META_PROPERTIES = [
  'og:title', 'og:description', 'og:image', 'og:url', 'og:type'
]

const META_NAME = [
  'twitter:card', 'twitter:site', 'twitter:creator', 'twitter:title',
  'twitter:description', 'twitter:image',
  'description'
]

const META_SEO = [
  'name', 'description', 'image'
]

/**
 * Gets the favicon URL from the website.
 * @param {cheerio.CheerioAPI} $ Cheerio instance
 * @param {string} url Website URL
 * @returns {string} Favicon URL
 */
function getFaviconUrl ($, url) {
  let favicon = $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    '/favicon.ico' // fallback

  // Convert favicon relative URL to absolute
  if (favicon && !favicon.startsWith('http')) {
    favicon = new URL(favicon, url).href
  }

  return favicon
}

/**
 * Extracts meta tags from a given website.
 * @param {string} website Website domain
 */
export default async function getMetaTagsFromWebsite (website) {
  const url = `https://${website}`
  const metadata = { url }

  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)

    const metaTitle = $('title').text()
    if (metaTitle) metadata.title = metaTitle.trim()

    metadata.favicon = getFaviconUrl($, url)

    META_PROPERTIES.forEach(prop => {
      const value = $(`meta[property="${prop}"]`).attr('content')
      if (value) metadata[prop.replace(':', '_')] = value.trim()
    })

    META_NAME.forEach(prop => {
      const value = $(`meta[name="${prop}"]`).attr('content')
      if (value) metadata[prop.replace(':', '_')] = value.trim()
    })

    META_SEO.forEach(prop => {
      const value = $(`meta[itemprop="${prop}"]`).attr('content')
      if (value) metadata[prop.replace(':', '_')] = value.trim()
    })
  } catch (error) {
    console.error(`Error al procesar ${url}: ${error.message}`)
    metadata.error = 'No se pudieron obtener los metadatos o la URL no es válida.'
  }

  return metadata
}
