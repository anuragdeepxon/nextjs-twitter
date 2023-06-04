import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { pathname } = request.nextUrl
    const uuid = pathname.substring(pathname.lastIndexOf('/') + 1)

    if (!uuid) {
      return NextResponse.json({
        status: 400,
        body: JSON.stringify({ error: 'UUID is missing' }),
      })
    }

    const tweetBatch = await prisma.tweetBatch.findUnique({
      where: { uuid },
    })

    if (!tweetBatch) {
      return NextResponse.json({
        status: 404,
        body: JSON.stringify({ error: 'Tweet batch not found' }),
      })
    }

    return NextResponse.json({ status: 200, data: tweetBatch })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      status: 500,
      body: JSON.stringify({ error: error }),
    })
  }
}

export async function POST(request) {
  try {
    const { pathname } = request.nextUrl
    const uuid = pathname.substring(pathname.lastIndexOf('/') + 1)

    if (!uuid) {
      return NextResponse.json({
        status: 400,
        body: { error: 'UUID is missing' },
      })
    }

    const { tweets } = await request.json()

    const tweetBatch = await prisma.tweetBatch.update({
      where: { uuid },
      data: {
        tweet_1: tweets[0],
        tweet_2: tweets[1],
        tweet_3: tweets[2],
        tweet_4: tweets[3],
        tweet_5: tweets[4],
      },
    })

    return NextResponse.json({
      status: 200,
      body: { message: 'Tweet batch updated successfully', data: tweetBatch },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      status: 500,
      body: { error: error.message },
    })
  }
}

export async function DELETE(request) {
  try {
    const { pathname } = request.nextUrl
    const uuid = pathname.substring(pathname.lastIndexOf('/') + 1)

    if (!uuid) {
      return NextResponse.json({
        status: 400,
        body: { error: 'UUID is missing' },
      })
    }

    const tweetBatch = await prisma.tweetBatch.delete({
      where: { uuid },
    })

    return NextResponse.json({
      status: 200,
      body: { message: 'Tweet batch deleted successfully', data: tweetBatch },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      status: 500,
      body: { error: error.message },
    })
  }
}
