"use client"
import { Form } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import PreviewDialogBtn from './buttons/PreviewDialogBtn'
import SaveFormBtn from './buttons/SaveFormBtn'
import PublishFormBtn from './buttons/PublishFormBtn'
import Designer from './Designer'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import DragOverlayWrapper from './DragOverlayWrapper'
import useDesigner from './hooks/useDesigner'
import { ImSpinner } from 'react-icons/im'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { IoCopy } from "react-icons/io5";
import { MdDone } from 'react-icons/md'
import { toast } from './ui/use-toast'
import Link from 'next/link'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import Confetti from 'react-confetti';

export default function FormBuilder({form} : {form: Form}) {

  const {setElements, setSelectedElement} = useDesigner();
  const [isReady,setIsReady] = useState(false);
  const mouseSensor = useSensor(MouseSensor,{
    activationConstraint:{
      distance: 10
    }
  })

  const touchSensor = useSensor(TouchSensor,{
    activationConstraint:{
      delay: 300,
      tolerance: 5
    }
  })
  const sensors = useSensors(mouseSensor,touchSensor)

  useEffect(() => {
    if(isReady) return;
    setSelectedElement(null);
    const formContent = JSON.parse(form.content);
    setElements(formContent);
    const readyTimeout = setTimeout(() => setIsReady(true),500);
    return () => clearTimeout(readyTimeout)
  },[form,setElements,isReady,setSelectedElement])


  if(!isReady){
     return (<div className="flex flex-col items-center justify-center w-full h-full">
      <ImSpinner className='animate-spin h-12 w-12' />
    </div>)
  }

  const shareURL = `${window.location.origin}/submit/${form.shareURL}`

  if(form.published){
    return (
      <>
        <Confetti height={window.innerHeight} width={window.innerWidth} recycle={false} numberOfPieces={500} />
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-7">
              Form Published
            </h1>
            <h2 className=" text-2xl">
              Share this form
            </h2>
            <h3 className=" text-muted-foreground border-b pb-7">
              Anyone with the link can view and submit the form.
            </h3>
            <div className="my-4 flex flex-row gap-2 items-center pb-4 border-b w-full">
              <Input 
                className=" w-full flex-3" 
                readOnly
                value={shareURL}
                />
              <Button 
                className='w-full flex-1 transition-all' 
                variant={'ghost'} 
                onClick={
                  () => {
                    navigator.clipboard.writeText(shareURL)
                    toast({
                      title:"Copied",
                      description: 'link copied to clipboard',
                    })
                  }
                }>
                <IoCopy />
              </Button>  
            </div>
            <div className="flex justify-between">
              <Button asChild variant={'ghost'}>
                <Link href={'/'} className='gap-2'>
                  <BsArrowLeft/>
                  Go Home
                </Link>
              </Button>
              <Button asChild variant={'ghost'}>
                <Link href={`/forms/${form.id}`} className='gap-2'>
                  Form Details
                  <BsArrowRight/>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <DndContext sensors={sensors}>
    <main className='flex flex-col w-full'>
      <nav className="flex justify-between items-center border-b-2 p-3 gap-3">
        <h2 className="truncate font-medium">
          <span className="text-muted-foreground mr-2">
            Form: {form.name}
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <PreviewDialogBtn/>
          {!form.published && (
            <>
              <SaveFormBtn id={form.id}/>
              <PublishFormBtn id={form.id}/>
            </>
          )}
        </div>
      </nav>
      <div className="flex w-full flex-grow 
      items-center justify-center relative 
      overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
        <Designer/>
      </div>
    </main>
    <DragOverlayWrapper />
  </DndContext>
  )
}
