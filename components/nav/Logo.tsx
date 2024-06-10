import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
    <Link href={"/"} className='font-bold text-3xl cursor=pointer
    bg-gradient-to-r from-red-400 to-cyan-500
    text-transparent bg-clip-text'>
      Go-form
    </Link>
  )
}
