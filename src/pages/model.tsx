import {Inter} from 'next/font/google'
import Head from 'next/head'

const inter = Inter({subsets: ['latin']})

export default function ModelTest() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Head>
        <title>Garden Shrine - Nifty Island Bloom Rewards | Nifty Island</title>
        <meta
          name="description"
          content="View Garden Shrine and other assets from Nifty Island Bloom Rewards on NiftyIsland.com, an NFT marketplace for custom, user-generated content for the Nifty Island game."
        />
        <link
          rel="canonical"
          href="https://niftyisland.com/item/ethereum/0xfd72ba1944dd7b7e5829e33aa92dd7a149919f65/7"
        />
        <meta
          property="og:title"
          content="Garden Shrine - Nifty Island Bloom Rewards"
        />
        <meta
          property="og:description"
          content="View Garden Shrine and other assets from Nifty Island Bloom Rewards on NiftyIsland.com, an NFT marketplace for custom, user-generated content for the Nifty Island game."
        />
        <meta property="og:site_name" content="Nifty Island" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://niftyisland.com/item/ethereum/0xfd72ba1944dd7b7e5829e33aa92dd7a149919f65/7"
        />
        <meta
          property="og:image"
          content="https://niftyisland.com/assets/pub/img/ni-preview.png"
        />
        <meta
          name="twitter:description"
          content="View Garden Shrine and other assets from Nifty Island Bloom Rewards on NiftyIsland.com, an NFT marketplace for custom, user-generated content for the Nifty Island game."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="Nifty Island" />
        <meta property="twitter:domain" content="niftyisland.com" />
        <meta
          property="twitter:url"
          content="https://niftyisland.com/item/ethereum/0xfd72ba1944dd7b7e5829e33aa92dd7a149919f65/7"
        />
        <meta
          property="twitter:title"
          content="Garden Shrine - Nifty Island Bloom Rewards"
        />
        <meta
          name="twitter:image"
          content="https://niftyisland.com/assets/pub/img/ni-preview.png"
        />

        {/* og video */}
        <meta
          property="og:video"
          content="https://content.niftyisland.com/images/9ae010a3-d676-4c28-bdd9-46d881e4b3de.mp4"
        />
        <meta
          property="og:video:secure_url"
          content="https://content.niftyisland.com/images/9ae010a3-d676-4c28-bdd9-46d881e4b3de.mp4"
        />
        <meta property="og:type" content="video" />

        {/* twitter player */}
        {/* <meta
          name="twitter:player"
          content="https://gold-plam.vercel.app/twitter-player.html?src=https://content.niftyisland.com/nftables/ba0549aa-05d8-458b-9c91-d2167ea2820f/v/1/source.fbx&poster=https://niftyisland.com/assets/pub/img/ni-preview.png"
        />
        <meta name="twitter:player:width" content="480" />
        <meta name="twitter:player:height" content="480" /> */}
      </Head>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Model Test</h1>
      </div>
    </main>
  )
}
