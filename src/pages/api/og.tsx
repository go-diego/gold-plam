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

  // await chromium.font(
  //   'https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf',
  // )
  const executablePath = IS_LOCAL
    ? devPuppeteer.executablePath()
    : await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar',
      )

  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  console.log('executablePath', executablePath)

  try {
    const islandData = await fetch(
      `https://api.niftyisland.com/api/islands/${islandId}/preview`,
    ).then((res) => res.json())

    if (!islandData) {
      res.status(404).send('Island not found')
      return
    }

    chromium.setGraphicsMode = false

    browser = await puppeteer.launch({
      args: IS_LOCAL ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: {
        width: 500,
        height: 350,
      },
      headless: true,
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
            right: '0.5rem',
            top: '0.5rem',
            position: 'absolute',
            zIndex: 5,
          }}
          width={56}
          height={56}
          src={islandData?.owner?.imageProfile?.sourceUrl}
        />
        {/* eslint-disable react/react-in-jsx-scope  */}
        <img
          alt=""
          // width={350}
          // height={350}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block', // Ensure there's no extra space under the image
            position: 'absolute', // Assuming you want it positioned absolutely
            top: 0, // Adjust accordingly
            left: 0, // Adjust accordingly
          }}
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
