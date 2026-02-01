"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Button from './Button'

const Navbar = ({children, forward = '/upload', ...props}) => {
  const pathname = usePathname()
  return (
  <nav className="max-w-3xl rounded-full mx-auto flex items-center justify-between px-8 py-4   bg-white shadow-md" >
    <div className="text-2xl font-bold mask-l-from-95% bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text">Analyserz</div>
    {pathname !== '/upload' && (
      <div>
        <Button children={children} forward={forward} />
      </div>
    )}
   </nav>
  )
}

export default Navbar