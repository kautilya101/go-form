import React, { useState } from 'react'
import { FormElement, FormElementInstance, FormElements } from '../FormElements'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button';
import { BiSolidTrash } from 'react-icons/bi';
import useDesigner from '../hooks/useDesigner';

export default function DesignerElementWrapper({element}: {element: FormElementInstance}) {

  const {removeElement,selectedElement,setSelectedElement} = useDesigner();
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  })

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  })

  const draggableElement = useDraggable({
    id: element.id + '-drag-handler',
    data: {
      elementId: element.id,
      type: element.type,
      isDesignerElement: true
    }
  })

  if(draggableElement.isDragging) return null;

  const DesignerComponent = FormElements[element.type].designerComponent;
  
  return (
    <div 
      className='relative h-[120px] flex 
      flex-col text-foreground cursor-pointer 
      rounded-md ring-1 ring-accent ring-inset'
      ref={draggableElement.setNodeRef}
      {...draggableElement.listeners}
      {...draggableElement.attributes}
      onMouseEnter={() => {
        setIsMouseOver(true)
      }}
      onMouseLeave={() => {
        setIsMouseOver(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
    >
      <div ref={topHalf.setNodeRef} className={cn('absolute w-full h-1/2')}></div>
      <div ref={bottomHalf.setNodeRef} className={cn('absolute bottom-0 w-full h-1/2')}></div>
      {isMouseOver && (
        <>
        <div className='absolute right-0 h-full z-10'>
          <Button 
            className='flex justify-center h-full border rounded-l-none bg-red-500' 
            variant={'outline'} 
            onClick={(e) => {
              e.stopPropagation()
              removeElement(element.id) 
            }
          }  
          >
            <BiSolidTrash className='h-6 w-6' />
          </Button>
        </div>
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
          <p className=" text-muted-foreground">
            Click for properties or drag to reorder
          </p>
        </div>
        </>

      )}
      {topHalf.isOver && (<div className='absolute top-0 w-full bg-primary h-1 rounded-md rounded-b-none '/>)}  
      <div className={cn('flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100', 
      isMouseOver && " opacity-20",
      )}>
        <DesignerComponent elementInstance={element}/>
      </div>
      {bottomHalf.isOver && <div className='absolute bottom-0 w-full bg-primary h-1 rounded-md rounded-t-none'/>}
    </div>
  )
}
