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

  const executablePath = IS_LOCAL
    ? devPuppeteer.executablePath()
    : await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar',
      )

  console.log('executablePath', executablePath)

  try {
    const islandData = await fetch(
      `https://api.niftyisland.com/api/islands/${islandId}/preview`,
    ).then((res) => res.json())

    browser = await puppeteer.launch({
      args: IS_LOCAL ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: {
        width: 500,
        height: 350,
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
          src={islandData?.owner?.imageProfile?.sourceUrl}
        />
        {/* eslint-disable react/react-in-jsx-scope  */}
        <img
          alt=""
          width={350}
          height={350}
          src={islandData?.selectedLoadout?.imagePreview?.sourceUrl}
        />
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
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// import {withOGImage} from 'next-api-og-image'

// export default withOGImage<
//   'query',
//   {
//     islandId: string
//     userProfileImgUrl: string
//   }
// >({
//   template: {
//     react: async ({islandId, userProfileImgUrl}) => {
//       return (
//         <main
//           style={{
//             backgroundColor: 'hsl(204 96% 54%)',
//             width: '100%',
//             height: '100vh',
//             flexDirection: 'column',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             position: 'absolute',
//           }}
//         >
//           {/* eslint-disable react/react-in-jsx-scope  */}

//           {/* eslint-disable react/react-in-jsx-scope  */}
//           <img
//             alt=""
//             style={{
//               borderRadius: '50%',
//               right: '0.5rem',
//               top: '0.5rem',
//               position: 'absolute',
//             }}
//             width={56}
//             height={56}
//             src={userProfileImgUrl as string}
//           />
//           {/* eslint-disable react/react-in-jsx-scope  */}
//           <img
//             alt=""
//             width={350}
//             height={350}
//             src={'https://gold-plam.vercel.app/vercel.svg'}
//           />
//         </main>
//       )
//     },
//   },
//   dev: {
//     inspectHtml: false,
//   },
// })
