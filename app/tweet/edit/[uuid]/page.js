'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/common/Header'

const Tweet = () => {
  const router = useRouter()
  const [uuid, setUuid] = useState('')
  const [tweets, setTweets] = useState([])
  const [topic, setTopic] = useState('')
  const [updatedTweets, setUpdatedTweets] = useState([])

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
        const { topic, tweet_1, tweet_2, tweet_3, tweet_4, tweet_5 } = data.data
        setTopic(topic)
        setTweets([tweet_1, tweet_2, tweet_3, tweet_4, tweet_5])
        setUpdatedTweets([tweet_1, tweet_2, tweet_3, tweet_4, tweet_5])
      } catch (error) {
        toast.error(error.message)
      }
    }

    if (uuid) {
      fetchTweets()
    }
  }, [uuid])

  const updateTweets = async () => {
    try {
      const response = await fetch(`/api/tweet/${uuid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweets: updatedTweets }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.message || 'Failed to update tweets'
        toast.error(errorMessage)
        return
      }

      const data = await response.json()
      if (data.status !== 200) {
        toast.error(data.message)
      } else {
        toast.success('Tweets updated successfully')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleChange = (index, value) => {
    const newTweets = [...updatedTweets]
    newTweets[index] = value
    setUpdatedTweets(newTweets)
  }

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

      <main className="bg-gradient-to-r from-indigo-800 to-purple-700 min-h-screen">
        <Toaster />
        <br />

        <div className="max-w-5xl mt-16 mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">{topic}</h1>
          </div>

          {tweets.map((tweet, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow"
            >
              <textarea
                name="tweet"
                value={updatedTweets[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                rows={8}
                className="w-full h-28 bg-white text-gray-800 rounded-md border border-gray-300 p-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Share your thoughts here..."
              />
            </div>
          ))}

          <button
            onClick={updateTweets}
            className="bg-purple-700 text-white rounded-md px-4 py-2 hover:bg-purple-600 transition-colors"
          >
            Update All Tweets
          </button>
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
