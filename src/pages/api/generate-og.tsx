import {NextApiRequest, NextApiResponse} from 'next'
import puppeteer, {Browser} from 'puppeteer'
import {renderToStaticMarkup} from 'react-dom/server'
// import {config} from 'src/config'
// import {getIslandFallbackImageUrl} from 'src/utils/getUrl'
// import {getCssText} from '../../../stitches.config'

const isDevelopment = process.env.NODE_ENV !== 'production'
const baseUrl =
  isDevelopment 
    ? 'http://localhost:3001'
    : "https://golden-plam.vercel.app"

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
  try {
    browser = await puppeteer.launch({
      defaultViewport: {
        width: 500,
        height: 350,
      },
      headless: 'new',
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

    const screenshot = await page.screenshot()

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'private, max-age=3600')
    res.send(screenshot)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error occurred while generating screenshot')
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
