import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { title } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!title) {
      return new NextResponse('Missing title', { status: 400 })
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log('[COURSES] POST /api/courses', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
