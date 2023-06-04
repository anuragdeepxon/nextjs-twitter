'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import DropDown from '@/components/form/DropDown'
import { tweettypes, tweetvibes } from '@/utils/datatypes'
import Head from 'next/head'
import Header from '@/components/common/Header'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

const Index = () => {
  const router = useRouter()
  const [apiKey, setApiKey] = useState('')
  const [vibe, setVibe] = useState('Casual')
  const [type, setType] = useState('Tweet')
  const [tweet, setTweet] = useState('')
  const [generatedTweets, setGeneratedTweets] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const localKey = `${process.env.OPENAI_KEY}`
    setApiKey(localKey)
  }, [])

  const generateBio = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!apiKey) {
      enqueueSnackbar('Please Add Your API Key!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      })
      setLoading(false)
      return
    }

    if (!tweet) {
      enqueueSnackbar('Please write about your tweet!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      })
      setLoading(false)
      return
    }

    const prompt = `I want you to generate 5 tweets based on the following information:
  
    - Tweet Text: ${tweet}
    - Tweet Vibe: ${vibe}
    - Tweet Type: ${type}
  
    For each tweet, please use natural language processing techniques to generate a message that matches the provided vibe and type of tweet. The tweets should be no longer than 280 characters each. 
  
    For the first tweet, please focus on conveying the main message of the input text in a way that matches the provided vibe and type.
  
    For the second tweet, please focus on generating a tweet that complements or expands on the message of the first tweet, again matching the provided vibe and type.`

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          tweet,
        }),
      })

      if (!response.ok) {
        setLoading(false)
        const errorResponse = await response.json()
        const errorMessage = errorResponse.error

        enqueueSnackbar(errorMessage, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
      } else {
        const responseData = await response.json()
        if (responseData.error) {
          setLoading(false)
          enqueueSnackbar(responseData.error, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          })
        } else {
          const restweets = responseData.data.choices[0].text
            .split('\n')
            .filter((tweet) => tweet !== '')
          setGeneratedTweets(restweets)

          setTimeout(() => {
            router.push(`/tweet/view/${responseData.data.uuid}`)
            setLoading(false)
          }, 1000)
        }
      }
    } catch (error) {
      setLoading(false)
      enqueueSnackbar(`An error occurred: ${error.message}`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      })
    }
  }

  const menuItems = [{ label: 'All Tweets', link: '/tweets' }]

  return (
    <>
      <Head>
        <title>Social Automation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header menuItems={menuItems} />

      <main className="bg-gradient-to-r mt-14 from-indigo-800 to-fuchsia-600 min-h-screen">
        <SnackbarProvider />

        <div className="flex justify-end px-4 py-2">
          <div className="group"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white text-center mb-10">
            Twitter
          </h1>
          <section className="bg-white shadow-md rounded-md p-8">
            <div className="mb-8">
              <label className="text-gray-700 font-bold mb-2 block">
                Select your vibe:
              </label>
              <div className="flex gap-2">
                <DropDown
                  vibe={vibe}
                  setVibe={(newVibe) => setVibe(newVibe)}
                  themes={tweetvibes}
                />
                <DropDown vibe={type} setVibe={setType} themes={tweettypes} />
              </div>
            </div>
            <div className="mb-8">
              <label className="text-gray-700 font-bold mb-2 block">
                Write about your tweet:
              </label>
              <textarea
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                rows={8}
                className="w-full bg-white text-gray-800 rounded-md border border-gray-300 p-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Share your thoughts here..."
                required
              />
            </div>
            <div className="text-center">
              {!loading ? (
                <button
                  type="submit"
                  onClick={generateBio}
                  className="bg-indigo-900 text-white rounded-md font-medium px-6 py-3 hover:bg-indigo-800 transition-colors"
                >
                  Generate your tweet &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={generateBio}
                  className="relative bg-indigo-700 text-white rounded-md font-medium px-6 py-3 cursor-not-allowed opacity-75"
                  disabled
                >
                  <span className="flex items-center justify-center">
                    Generating....
                    <span className="animate-spin ml-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 2.627 5.373 2.627 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042.83 5.878 2.199 8.32l1.414-1.414C2.956 16.752 2 14.48 2 12H2a9.964 9.964 0 003.8 8.055l1.414-1.414zM12 20c-1.657 0-3-1.343-3-3h2c0 .552.448 1 1 1s1-.448 1-1h2c0 1.657-1.343 3-3 3z"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Index
