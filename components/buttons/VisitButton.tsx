"use client"  
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function VisitButton({shareUrl}: {shareUrl: string}) {
  const [mounted,setMounted ] = useState(false);

  useEffect(() => {
    setMounted(true);
  },[])

  
  if(!mounted) return null;
  
  const shareLink = `${window.location.origin}/submit/${shareUrl}`
  return (
    <Button className='w-[200px] gap-2 flex items-center' onClick={() => window.open(shareLink)}>
      Visit
      <FaExternalLinkAlt className='h-3 w-3' />
    </Button>
  )
}
