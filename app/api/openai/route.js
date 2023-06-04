import { NextResponse } from 'next/server';
import Twitter from 'twitter';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req, res) {
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.badRequest(
      'Invalid content-type. Expected application/json',
    );
  }

  const { tweet: message } = await req.json(); // Rename 'tweet' to 'message'

  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY || '',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || '',
    access_token_key: process.env.ACCESS_TOKEN_KEY || '',
    access_token_secret: process.env.ACCESS_TOKEN_SECRET || '',
  });

  client.post(
    'statuses/update',
    { status: message + ` (${new Date().toLocaleDateString()})` },
    function (error, createdTweet, response) { // Rename 'tweet' to 'createdTweet'
      if (error) {
        console.error('Error posting tweet:', error);
        return NextResponse.json({
          status: 500,
          body: JSON.stringify({ error: 'Failed to post tweet' }),
        });
      } else {
        console.log('Tweet posted successfully');
        return NextResponse.json({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      }
    },
  );
}
