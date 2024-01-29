import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function DynamicOG() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Head>
        <meta property="og:title" content="Testing Dynamic OG Previews" />
        <meta property="og:description" content="Is this thing on???" />

          {/* og image */}
        <meta property="og:image" content="https://gold-plam.vercel.app/api/generate-og?islandId=9041a927-ecfe-4b46-9775-5d664e6a252e&userProfileImgUrl=https://content.niftyisland.com/images/49b1f6a2-30b2-4610-b4d1-32402ee197e9.png"/>

        {/* twitter image */}
        <meta name="twitter:image" content="https://gold-plam.vercel.app/api/generate-og?islandId=9041a927-ecfe-4b46-9775-5d664e6a252e&userProfileImgUrl=https://content.niftyisland.com/images/49b1f6a2-30b2-4610-b4d1-32402ee197e9.png"/>
       
      </Head>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Dynamic OG Test</h1>
      </div>
    </main>
  );
}
