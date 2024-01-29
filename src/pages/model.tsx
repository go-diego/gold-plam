import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function ModelTest() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Head>
        <meta property="og:title" content="Testing Video OG Previews" />
        <meta property="og:description" content="Is this thing on???" />

        {/* og image */}
        {/* <meta property="og:image" content="https://niftyisland.com/assets/pub/img/ni-preview.png"/> */}

        {/* twitter image */}
        {/* <meta name="twitter:image" content="https://niftyisland.com/assets/pub/img/ni-preview.png"/> */}

        {/* og video */}
        <meta property="og:video" content="https://content.niftyisland.com/images/6678b109-397e-40d6-9591-325a21addec8.mp4"/>
        <meta property="og:video:secure_url" content="https://content.niftyisland.com/images/6678b109-397e-40d6-9591-325a21addec8.mp4"/>
        <meta property="og:type" content="video"/>

        {/* twitter player */}
        {/* <meta name="twitter:player" content="https://drops.niftyisland.com/palm/gold_model.fbx&amp;poster=https://niftyisland.com/assets/pub/img/ni-preview.png"/> */}
      </Head>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Model Test</h1>
      </div>
    </main>
  );
}