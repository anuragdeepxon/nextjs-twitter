'use client'

require('dotenv').config()
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '@/components/common/Header'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

const Tweet = () => {
  const router = useRouter()
  const [tweets, setTweets] = useState([])
  const [topic, setTopic] = useState([])
  const [uuid, setUuid] = useState('')

  useEffect(() => {
    const url = window.location.href
    const urlParts = url.split('/')
    const uuidFromUrl = urlParts[urlParts.length - 1]
    setUuid(uuidFromUrl)
  }, [])

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(`/api/tweet/${uuid}`)
        if (!response.ok) {
          throw new Error('Failed to fetch tweets')
        }
        const data = await response.json()
        const { topic } = data.data
        setTopic(topic)
        const { tweet_1, tweet_2, tweet_3, tweet_4, tweet_5 } = data.data
        setTweets([tweet_1, tweet_2, tweet_3, tweet_4, tweet_5])
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
      }
    }

    if (uuid) {
      fetchTweets()
    }
  }, [uuid])

  const copyTweetToClipboard = (tweet) => {
    navigator.clipboard.writeText(tweet)

    enqueueSnackbar('Tweet copied to clipboard', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    })
  }

  const postTweet = async (tweet) => {
    try {
      const response = await fetch('/api/post-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweet }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.message || 'Failed to post tweet'

        enqueueSnackbar(errorMessage, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
        return
      }

      const data = await response.json()
      if (data.status != 200) {
        enqueueSnackbar(data.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
      } else {
        enqueueSnackbar(data.message, {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
      }
    } catch (error) {
      enqueueSnackbar(data.message, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      })
    }
  }

  const withBlueHashtags = (tweet) =>
    tweet.replace(
      /#(\w+)/g,
      '<span style="color: #2563eb; font-weight: bold;">$&</span>',
    )

  const menuItems = [
    { label: 'All Tweets', link: '/tweets' },
    { label: 'Back to Home', link: '/' },
  ]

  return (
    <>
      <Head>
        <title>Generated Tweets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header menuItems={menuItems} />

      <main className="bg-gradient-to-r from-indigo-800 to-fuchsia-600 min-h-screen">
        <SnackbarProvider />

        <div className="max-w-5xl mx-auto mt-14 px-4 py-8">
          <br />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">{topic}</h1>
          </div>

          {tweets.map((tweet, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow"
            >
              <p
                className="text-gray-800 mb-4 text-md"
                dangerouslySetInnerHTML={{ __html: withBlueHashtags(tweet) }}
              ></p>

              <div className="flex justify-end">
                <button
                  onClick={() => copyTweetToClipboard(tweet)}
                  className="bg-indigo-800 text-white rounded-md px-4 py-2 mr-2 hover:bg-indigo-700 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => postTweet(tweet)}
                  className="bg-purple-700 text-white rounded-md px-4 py-2 hover:bg-purple-600 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const response = await fetch('/api/tweet/uuids')
  const data = await response.json()
  const uuids = data.uuids

  const paths = uuids.map((uuid) => ({
    params: { uuid },
  }))

  return {
    paths,
    fallback: false,
  }
}

export default Tweet
