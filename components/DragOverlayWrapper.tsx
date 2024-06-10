import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useState } from 'react'
import { SidebarButtonElementDragOverlay } from './buttons/SidebarButtonElement'
import { ElementsType, FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import DesignerElementWrapper from './wrappers/DesignerElementWrapper'
import { DesignerComponent } from './fields/TextField'

export default function DragOverlayWrapper() {
  const {elements} = useDesigner()
  const [draggedItem, setDraggedItem] = useState<Active | null>(null)
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active)
    },
    onDragCancel: () => {
      setDraggedItem(null)
    },
    onDragEnd: () => {
      setDraggedItem(null)
    }
  })

  if(!draggedItem) return null;

  
  let node = <div>No drag overlay</div>

  const isSidebarButtonElement = draggedItem.data?.current?.isDesignerButtonElement;
  const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
  

  if(isSidebarButtonElement){
    const type = draggedItem.data?.current?.type as ElementsType;
    node = <SidebarButtonElementDragOverlay formElement={FormElements[type]} />
  }
  
  if(isDesignerElement){
    const elementId = draggedItem.data?.current?.elementId; 
    const element = elements.find((el) => el.id === elementId)
    if(!element) node = <div>Element not found</div>
    else{
      const DesignerComponent = FormElements[element.type].designerComponent
      node = <div className='flex w-full h-[120px] z-0 items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100'>
          <DesignerComponent elementInstance={element} />
        </div>
    }
  }
  
  
  return (
    <DragOverlay>{node}</DragOverlay>
  )
}
