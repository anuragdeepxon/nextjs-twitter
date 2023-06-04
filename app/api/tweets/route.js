import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
      // Retrieve all tweet batches from the database
      const tweetBatch = await prisma.tweetBatch.findMany();
  
      // Check if tweetBatch is empty
      if (!tweetBatch || tweetBatch.length === 0) {
        return NextResponse.json({ status: 404, body: JSON.stringify({ error: 'Tweets not found' }) });
      }
  
      // Return the tweetBatch as a JSON response
      return NextResponse.json({ status: 200, data: tweetBatch });
  
    } catch (error) {
      // Handle any errors that occur during the process
      console.log(error);
      return NextResponse.json({ status: 500, body: JSON.stringify({ error: error }) });
    }
  }
  