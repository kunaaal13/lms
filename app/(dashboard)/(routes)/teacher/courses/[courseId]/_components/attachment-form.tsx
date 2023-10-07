'use client'

import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Attachment, Course } from '@prisma/client'
import axios from 'axios'
import { File, ImageIcon, Loader2, PlusCircle, X, XIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

type AttachmentFormProps = {
  initialData: Course & {
    attachments: Attachment[]
  }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: 'URL is required',
  }),
})

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleEditing = () => setIsEditing((prev) => !prev)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success('Course updated')
      toggleEditing()

      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      toast.success('Attachment deleted')

      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course Attachments
        <Button onClick={toggleEditing} variant='ghost'>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm mt-2 text-slate-500 italic'>No attachments</p>
          )}

          {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                >
                  <File className='h-4 w-4 mr-2 flex-shrink-0' />

                  <p className='text-xs line-clamp-1'>{attachment.name}</p>

                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className='h-4 w-4 ml-2 animate-spin' />
                    </div>
                  )}

                  {deletingId !== attachment.id && (
                    <button
                      className='ml-auto hover:opacity-75 transition'
                      onClick={() => {
                        onDelete(attachment.id)
                      }}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url })
              }
            }}
          />

          <div className='text-xs text-muted-foreground mt-4'>
            Add anything you want to share with your students.
          </div>
        </div>
      )}
    </div>
  )
}

export default AttachmentForm
