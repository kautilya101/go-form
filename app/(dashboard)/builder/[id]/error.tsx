"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function Error({error} : {error: Error}) {

  useEffect(() => {
    console.error(error)
  },[error])

  return (
    <div className='flex items-center h-full w-full justify-center flex-col gap-4' >
      <h2 className="text-4xl"> Hmm...Something Went Wrong!</h2>
      <Button asChild>
        <Link href={'/'}>
          Go Home 
        </Link>
      </Button>
    </div>
  )
}
