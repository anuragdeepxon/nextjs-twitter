'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/common/Header'

const Tweet = () => {
  const router = useRouter()
  const [tweets, setTweets] = useState([])
  const [displayedTweets, setDisplayedTweets] = useState([])
  const [showAll, setShowAll] = useState(false)
  const tweetsPerPage = 5
  const initialTweetsToShow = tweets.slice(0, tweetsPerPage)

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch('/api/tweets')
        if (!response.ok) {
          throw new Error('Failed to fetch tweets')
        }
        const data = await response.json()

        const { data: tweetData } = data
        setTweets(tweetData)
      } catch (error) {
        toast.error(error.message)
      }
    }

    fetchTweets()
  }, [])

  useEffect(() => {
    setDisplayedTweets(initialTweetsToShow)
  }, [tweets])

  const handleEdit = (uuid) => {
    router.push(`/tweet/edit/${uuid}`)
  }

  const handleView = (uuid) => {
    router.push(`/tweet/view/${uuid}`)
  }

  const handleDelete = async (uuid) => {
    try {
      const response = await fetch(`/api/tweet/${uuid}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.message || 'Failed to delete tweet'
        toast.error(errorMessage)
        return
      }

      toast.success('Tweet deleted successfully')
      // Refresh the tweets after deletion
      const updatedTweets = tweets.filter((tweet) => tweet.uuid !== uuid)
      setTweets(updatedTweets)
      setDisplayedTweets(updatedTweets.slice(0, tweetsPerPage))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleShowMore = () => {
    const startIndex = displayedTweets.length
    const endIndex = startIndex + tweetsPerPage

    if (endIndex >= tweets.length) {
      setDisplayedTweets(tweets)
      setShowAll(true)
    } else {
      setDisplayedTweets(tweets.slice(0, endIndex))
    }
  }

  const handleShowLess = () => {
    setDisplayedTweets(initialTweetsToShow)
    setShowAll(false)
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

      <main className="bg-gradient-to-r from-indigo-800 to-purple-700 mt-16 min-h-screen">
        <Toaster />

        <div className="max-w-5xl mx-auto px-4 py-8">
          <br />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Topics</h1>
          </div>

          {displayedTweets.length === 0 ? (
            <p className="text-white">No tweets available</p>
          ) : (
            displayedTweets.map((tweet) => (
              <div
                key={tweet.uuid}
                className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow"
              >
                <div className="font-bold text-gray-600 text-lg">
                  {tweet.topic}
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleView(tweet.uuid)}
                    className="bg-indigo-800 text-white rounded-md px-4 py-2 hover:bg-indigo-600 transition-colors"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEdit(tweet.uuid)}
                    className="bg-indigo-800 text-white rounded-md px-4 py-2 hover:bg-indigo-600 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(tweet.uuid)}
                    className="bg-indigo-800 text-white rounded-md px-4 py-2 hover:bg-indigo-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          {tweets.length > tweetsPerPage && (
            <div className="flex justify-center mt-4">
              {!showAll ? (
                <button
                  onClick={handleShowMore}
                  className="bg-indigo-800 text-white rounded-md px-4 py-2 hover:bg-indigo-600 transition-colors"
                  disabled={showAll}
                >
                  Show More
                </button>
              ) : (
                <button
                  onClick={handleShowLess}
                  className="bg-indigo-800 text-white rounded-md px-4 py-2 hover:bg-indigo-600 transition-colors"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default Tweet
