import React, { act, useContext, useState } from 'react'
import DesignerSidebar from './DesignerSidebar'
import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { ElementsType, FormElementInstance, FormElements } from './FormElements'
import { idGenerator } from '@/lib/idGenerator'
import useDesigner from './hooks/useDesigner'
import DesignerElementWrapper from './wrappers/DesignerElementWrapper'  

export default function Designer() { 

  const {elements,addElement,selectedElement,setSelectedElement,removeElement} = useDesigner()

  const droppable = useDroppable({
    id: "designer-droppable-area",
    data: {
      isDesignerDroppableArea: true
    }
  })

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {

      const {active,over} = event
      console.log(active,over);
      if(!active || !over) return;
      
      const isDroppingOverDesignerArea = over.data?.current?.isDesignerDroppableArea;
      const isDesignerButtonElement = active?.data?.current?.isDesignerButtonElement;
      
      if(isDesignerButtonElement && isDroppingOverDesignerArea){
        const type = active?.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        addElement(elements.length,newElement);
        return;
      }

      const isDroppingOverDesignerElementTop = over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottom = over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =isDroppingOverDesignerElementTop || isDroppingOverDesignerElementBottom;
      const droppingSidebarBtnOverDesignerElement = isDesignerButtonElement && isDroppingOverDesignerElement;

      if(droppingSidebarBtnOverDesignerElement){
        const type = active?.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        let newElementIndex = elements.findIndex((el) => el.id === over.data?.current?.elementId);
        if(newElementIndex === -1) {
          throw new Error('Element not found')
        }

        if(isDroppingOverDesignerElementBottom){
          newElementIndex++;
        }
        addElement(newElementIndex,newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const isDroppingOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;

      if(isDroppingOverAnotherDesignerElement){
        console.log('hellew')
        const activeElementId = active.data?.current?.elementId;
        const droppedOverId = over.data?.current?.elementId
        const draggingElementIndex = elements.findIndex((el) => el.id === activeElementId )
        const droppedOverIndex = elements.findIndex((el) => el.id === droppedOverId)

        if(draggingElementIndex === -1 || droppedOverIndex === -1) {
          throw new Error('Element not found: cannot move elements ')
        }
        const draggingElement = {...elements[draggingElementIndex]}; // creating copy
        removeElement(activeElementId)

        let newIndex = droppedOverIndex
        if(isDroppingOverDesignerElementBottom){
          newIndex += 1;
        }
        addElement(newIndex,draggingElement)
        return;
      }
    }
  })

  return (
    <div className='flex w-full h-full'>
      <div className="p-4 w-full" onClick={() => {if(selectedElement) setSelectedElement(null)}}>
        <div 
          ref={droppable.setNodeRef}
          className={cn("bg-background max-w-[920px] h-full m-auto rounded-lg flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary ring-inset" 
          )}
         >
          
          {!droppable.isOver && elements.length < 1 && <p className="text-3xl font-bold text-muted-foreground flex flex-grow items-center justify-center">
            Drop Here
          </p>}
          {droppable.isOver && elements.length === 0 && (<div className='w-full p-2 '>
            <div className="h-[120px] rounded-md bg-primary/20"></div>
          </div>)}
          {elements.length > 0 && (
            <div className="flex flex-col gap-2 w-full p-2">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar/>
    </div>
  )
}
