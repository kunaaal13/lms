'use client'

import { UserButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

function NavbarRoutes() {
  const pathname = usePathname()

  const isTeacherPage = pathname.startsWith('/teacher')
  const isStudentPage = pathname.startsWith('/student')

  return (
    <div className='flex gap-x-2 ml-auto'>
      {isTeacherPage || isStudentPage ? (
        <Link href={'/'}>
          <Button size={'sm'} variant='ghost'>
            <LogOut className='h-4 w-4 mr-2' />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={'/teacher/courses'}>
          <Button size={'sm'} variant='ghost'>
            Teacher Mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl='/' />
    </div>
  )
}

export default NavbarRoutes
