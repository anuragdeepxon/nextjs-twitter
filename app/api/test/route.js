import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request) {
    if (request.headers.get('content-type') !== 'application/json') {
        return NextResponse.badRequest('Invalid content-type. Expected application/json');
    }
    
    let body;
    try {
        body = await request.json();
    } catch (err) {
        return NextResponse.badRequest({ error: 'Could not parse JSON' });
    }

    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(body.password, saltRounds);

        const result = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword, 
            },
        });

        await prisma.$disconnect();

        return NextResponse.json({ message: 'success', data: result });
    } catch (error) {
        await prisma.$disconnect();
        
        console.error("Error: ", error);
        return new NextResponse()
            .status(500)
            .json({
                error: 'An error occurred while trying to process your request.',
                details: error.message
            });
    }
}