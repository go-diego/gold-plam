// import {NextApiRequest, NextApiResponse} from 'next'
// import puppeteer, {Browser} from 'puppeteer-core'
// import {renderToStaticMarkup} from 'react-dom/server'
// import os from 'os'
// import chromium from 'chrome-aws-lambda'

// const isDevelopment = process.env.NODE_ENV !== 'production'

// let DEFAULT_EXECUTABLE_PATH: string | null = null
// if (process.platform === 'win32') {
//   if (['arm64', 'ppc64', 'x64', 's390x'].includes(os.arch())) {
//     DEFAULT_EXECUTABLE_PATH =
//       'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
//   } else {
//     DEFAULT_EXECUTABLE_PATH =
//       'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
//   }
// } else if (process.platform === 'linux') {
//   DEFAULT_EXECUTABLE_PATH = '/usr/bin/google-chrome'
// } else {
//   DEFAULT_EXECUTABLE_PATH =
//     '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   let browser: Browser | null = null
//   const {islandId, userProfileImgUrl} = req.query

//   if (!islandId) {
//     res.status(400).send('Missing islandId')
//     return
//   }
//   if (!userProfileImgUrl) {
//     res.status(400).send('Missing userProfileImgUrl')
//     return
//   }

//   console.log('CHROMIUM', await chromium.executablePath)
//   console.log('DEFAULT_EXECUTABLE_PATH', DEFAULT_EXECUTABLE_PATH)
//   try {
//     const executablePath =
//       (await chromium.executablePath) ?? DEFAULT_EXECUTABLE_PATH
//     browser = await chromium.puppeteer.launch({
//       defaultViewport: {
//         width: 500,
//         height: 350,
//       },
//       headless: chromium.headless,
//       executablePath,
//       args: chromium.args,
//     })

//     const page = await browser.newPage()

//     const html = renderToStaticMarkup(
//       /* eslint-disable react/react-in-jsx-scope */
//       <main
//         style={{
//           backgroundColor: 'hsl(204 96% 54%)',
//           width: '100%',
//           height: '100vh',
//           flexDirection: 'column',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           position: 'absolute',
//         }}
//       >
//         {/* eslint-disable react/react-in-jsx-scope  */}

//         {/* eslint-disable react/react-in-jsx-scope  */}
//         <img
//           alt=""
//           style={{
//             borderRadius: '50%',
//             right: '0.5rem',
//             top: '0.5rem',
//             position: 'absolute',
//           }}
//           width={56}
//           height={56}
//           src={userProfileImgUrl as string}
//         />
//         {/* eslint-disable react/react-in-jsx-scope  */}
//         <img
//           alt=""
//           width={350}
//           height={350}
//           src={'https://gold-plam.vercel.app/vercel.svg'}
//         />
//       </main>,
//     )
//     await page.setContent(html)

//     const screenshot = await page.screenshot({
//       type: 'png',
//       encoding: 'binary',
//     })

//     res.setHeader('Content-Type', 'image/png')
//     res.setHeader('Cache-Control', 'private, max-age=3600')
//     res.write(screenshot)
//     res.end()
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('Error occurred while generating screenshot')
//   }
// }

import {withOGImage} from 'next-api-og-image'

export default withOGImage<
  'query',
  {
    islandId: string
    userProfileImgUrl: string
  }
>({
  template: {
    react: async ({islandId, userProfileImgUrl}) => {
      return (
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
          <img
            alt=""
            width={350}
            height={350}
            src={'https://gold-plam.vercel.app/vercel.svg'}
          />
        </main>
      )
    },
  },
  dev: {
    inspectHtml: false,
  },
})
