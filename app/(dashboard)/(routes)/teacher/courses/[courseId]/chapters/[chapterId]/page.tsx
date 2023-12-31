import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type ChapterIdPageProps = {
  params: {
    courseId: string
    chapterId: string
  }
}

async function ChapterIdPage({ params }: ChapterIdPageProps) {
  const { userId } = auth()

  if (!userId) redirect('/')

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  })

  if (!chapter) redirect('/')

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `${completedFields} of ${totalFields} fields completed`

  return (
    <div className='p-6'>
      <div className='flex items-center justify-center'>
        <div className='w-full'>
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className='flex items-center text-sm hover:opacity-75 transition mb-6'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to course setup
          </Link>

          <div className='flex items-center justify-between w-full'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-medium'>Chapter Creation</h1>

              <span className='text-sm text-slate-700'>
                Complete all fields, {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage
