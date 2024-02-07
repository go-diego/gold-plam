import React from 'react'
import {GetServerSideProps} from 'next'
import {Inter} from 'next/font/google'
import Head from 'next/head'

const inter = Inter({subsets: ['latin']})

export default function DynamicOG({ogImage}: {ogImage?: string}) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Head>
        <meta property="og:title" content="Testing Dynamic OG Previews" />
        <meta property="og:description" content="Is this thing on???" />

        {/* og image */}
        <meta property="og:image" content={ogImage} />

        {/* twitter image */}
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Dynamic OG Test</h1>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  ogImage?: string
}> = async (context) => {
  const {id} = context.query
  const islandData = await fetch(
    `https://api.niftyisland.com/api/islands/${id}/preview`,
  ).then((res) => res.json())

  if (!islandData) {
    return {notFound: true}
  }
  const ogImage = id
    ? `https://gold-plam.vercel.app/api/og?islandImg=${id}&ownerImg=${id}`
    : undefined

  return {props: {ogImage}}
}
