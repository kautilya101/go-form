import React, { ReactNode } from 'react'

export default function Layout({children} : {children: ReactNode}) {
  return (
    <div className='flex flex-grow w-full mx-auto' >
      {children}
    </div>
  )
}
