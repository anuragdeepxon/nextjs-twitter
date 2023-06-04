import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { prompt, tweet } = await request.json()

    if (!prompt || !tweet) {
      return NextResponse.json({
        status: 400,
        body: JSON.stringify({ error: 'Prompt or tweet is missing' }),
      })
    }

    const payload = {
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 200,
      n: 5,
    }

    const openaiRes = await fetch('https://api.openai.com/v1/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (openaiRes.status === 401) {
      return NextResponse.json({
        status: 401,
        body: JSON.stringify({ error: 'Invalid API key' }),
      })
    }

    if (!openaiRes.ok) {
      const errorMessage = await openaiRes.text()
      return NextResponse.json({
        status: 401,
        body: JSON.stringify({
          error: `OpenAI API failed to respond: ${errorMessage}`,
        }),
      })
    }

    const result = await openaiRes.json()

    const generatedTweets = result.choices[0].text
      .split('\n')
      .filter((tweet) => tweet !== '')

    const savedTweets = await prisma.tweetBatch.create({
      data: {
        uuid: uuidv4(),
        topic: tweet,
        tweet_1: generatedTweets[0] || '',
        tweet_2: generatedTweets[1] || '',
        tweet_3: generatedTweets[2] || '',
        tweet_4: generatedTweets[3] || '',
        tweet_5: generatedTweets[4] || '',
      },
    })

    await prisma.$disconnect()
    return NextResponse.json({
      status: 200,
      data: { uuid: savedTweets.uuid, ...result },
    })
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: JSON.stringify({ error: error }),
    })
  }
}