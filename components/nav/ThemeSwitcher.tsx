"use client";

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

export default function ThemeSwitcher() {
  const {theme, setTheme} = useTheme();
  const [mounted,setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  },[])

  if(!mounted) return null; 

  return (
    <Tabs defaultValue={theme}>
      <TabsList className='border'>
        <TabsTrigger 
          value='light' 
          onClick={() => setTheme('light')}>
            {/* {theme == "light" ? <MoonIcon className='h-[1.2rem] w-[1.2rem]'/> : <SunIcon className='h-[1.2rem] w-[1.2rem]'/> } */}
            <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-180 transition-all'/>
        </TabsTrigger>
        <TabsTrigger 
          value='dark' 
          onClick={() => setTheme('dark')}>
            {/* {theme == "light" ? <MoonIcon className='h-[1.2rem] w-[1.2rem]'/> : <SunIcon className='h-[1.2rem] w-[1.2rem]'/> } */}
            <MoonIcon className='h-[1.2rem] w-[1.2rem] transition-all rotate-0 dark:rotate-90'/>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
