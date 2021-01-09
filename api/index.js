import { launch } from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'

const isDev = !process.env.AWS_REGION
const exe = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function getOptions() {
  return {
    args: isDev ? [] : chrome.args,
    executablePath: isDev ? exe : await chrome.executablePath,
    headless: isDev || chrome.headless,
  }
}

async function getScreenshot() {
  const options = await getOptions()
  const browser = await launch(options)
  const page = await browser.newPage()

  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('https://google.com', {
    waitUntil: 'networkidle2',
  })

  return page.screenshot({ type: 'png' })
}

export default async function handler(req, res) {
  const file = await getScreenshot()

  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  res.end(file)
}
