import { NextResponse } from 'next/server'
import { TwitterClient } from 'twitter-api-client'
import dotenv from 'dotenv'
import { stringify } from 'postcss'

dotenv.config()

export async function POST(request) {
  if (request.headers.get('content-type') !== 'application/json') {
    return NextResponse.badRequest(
      'Invalid content-type. Expected application/json',
    )
  }

  const { tweet } = await request.json()

  const client = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  })

  try {
    const response = await client.tweets.statusesUpdate({
      status: tweet,
    })

    return NextResponse.json({ message: 'Tweet posted successfully' })
  } catch (error) {
    let errorMessage = 'Unknown error occurred'

    try {
      const { errors } = JSON.parse(error.data)
      if (errors && errors.length > 0) {
        errorMessage = errors[0].message
      }
    } catch (parseError) {
      console.error('Error parsing error data:', parseError)
    }
    return NextResponse.json({ status: 403, message: errorMessage })
  }
}
