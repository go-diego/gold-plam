import {NextApiRequest, NextApiResponse} from 'next'
import puppeteer, {Browser} from 'puppeteer-core'
import devPuppeteer from 'puppeteer'
import {renderToStaticMarkup} from 'react-dom/server'
import chromium from '@sparticuz/chromium-min'

const IS_LOCAL = process.env.NODE_ENV === 'development'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let browser: Browser | null = null
  const {islandId} = req.query

  if (!islandId) {
    res.status(400).send('Missing islandId')
    return
  }

  try {
    const islandData = await fetch(
      `https://api.niftyisland.com/api/islands/${islandId}/preview`,
    ).then((res) => res.json())

    if (!islandData) {
      res.status(404).send('Island not found')
      return
    }

    const executablePath = IS_LOCAL
      ? devPuppeteer.executablePath()
      : await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar',
        )

    const args = IS_LOCAL ? puppeteer.defaultArgs() : chromium.args

    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    console.log('executablePath', executablePath)

    chromium.setGraphicsMode = false

    browser = await puppeteer.launch({
      args,
      defaultViewport: {
        width: 1200,
        height: 630,
      },
      headless: chromium.headless,
      executablePath,
      ignoreHTTPSErrors: IS_LOCAL ? false : true,
    })

    const page = await browser.newPage()

    const html = renderToStaticMarkup(
      /* eslint-disable react/react-in-jsx-scope */
      <main
        style={{
          backgroundColor: 'hsl(204 96% 54%)',
          boxSizing: 'border-box',
          width: '100%',
          height: '100vh',
          position: 'relative',
          margin: 0,
          padding: 0,
        }}
      >
        <style>{`body { margin: 0; padding: 0; }`}</style>
        {/* eslint-disable react/react-in-jsx-scope  */}
        <img
          alt=""
          style={{
            borderRadius: '50%',
            right: '1rem',
            top: '1rem',
            position: 'absolute',
            zIndex: 5,
          }}
          width={100}
          height={100}
          src={islandData?.owner?.imageProfile?.sourceUrl}
        />
        {/* eslint-disable react/react-in-jsx-scope  */}
        <img
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          src={islandData?.selectedLoadout?.imagePreview?.sourceUrl}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5rem',
            zIndex: 5,
            position: 'absolute',
            width: '100%',
            bottom: '1rem',
            fontSize: '2rem',
            fontWeight: 'bolder',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                backgroundColor:
                  islandData.playerCount > 0 ? 'hsl(135, 80%, 60%)' : 'gray',
                height: '1rem',
                width: '1rem',
                borderRadius: '50%',
              }}
            ></span>
            <span>{islandData.playerCount} online</span>
          </div>
          <span>{islandData.favoritedCount} favorites</span>
        </div>
      </main>,
    )
    await page.setContent(html)

    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'binary',
    })

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=60, no-transform')
    res.status(200).write(screenshot)
    res.end()
  } catch (error) {
    console.error(error)
    res.status(500).send('Error occurred while generating screenshot')
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
