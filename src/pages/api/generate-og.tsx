import {NextApiRequest, NextApiResponse} from 'next'
import puppeteer, {Browser} from 'puppeteer-core'
import {renderToStaticMarkup} from 'react-dom/server'
import chromium from 'chrome-aws-lambda'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let browser: Browser | null = null
  const {islandId, userProfileImgUrl} = req.query

  if (!islandId) {
    res.status(400).send('Missing islandId')
    return
  }
  if (!userProfileImgUrl) {
    res.status(400).send('Missing userProfileImgUrl')
    return
  }

  console.log("CHROMIUM", await chromium.executablePath)
  try {
    browser = await puppeteer.launch({
      defaultViewport: {
        width: 500,
        height: 350,
      },
      headless: chromium.headless,
      executablePath: await chromium.executablePath ?? undefined,
      args: chromium.args,
    })

    const page = await browser.newPage()

    const html = renderToStaticMarkup(
      /* eslint-disable react/react-in-jsx-scope */
      <main
        style={{
          backgroundColor: 'hsl(204 96% 54%)',
          width: '100%',
          height: '100vh',
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}
      >
        {/* eslint-disable react/react-in-jsx-scope  */}
       
        {/* eslint-disable react/react-in-jsx-scope  */}
        <img
          alt=""
          style={{
            borderRadius: '50%',
            right: '0.5rem',
            top: '0.5rem',
            position: 'absolute',
          }}
          width={56}
          height={56}
          src={userProfileImgUrl as string}
        />
        {/* eslint-disable react/react-in-jsx-scope  */}
        <img alt="" width={350} height={350} src={"https://gold-plam.vercel.app/vercel.svg"} />
      </main>,
    )
    await page.setContent(html)

    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'binary',
    })

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'private, max-age=3600')
    res.write(screenshot)
    res.end()
  } catch (error) {
    console.error(error)
    res.status(500).send('Error occurred while generating screenshot')
  } 
}
