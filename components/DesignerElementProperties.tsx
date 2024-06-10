import React from 'react'
import useDesigner from './hooks/useDesigner'
import { FormElements } from './FormElements';
import { Button } from './ui/button';
import { AiOutlineClose } from 'react-icons/ai';
import { Separator } from './ui/separator';

export default function DesignerElementProperties() {
  const { selectedElement,setSelectedElement } = useDesigner()
  if(!selectedElement) return;

  const PropertiesComponent = FormElements[selectedElement?.type].propertiesComponent;

  return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className=" text-md text-foreground/60">
            Element Properties
          </p>
          <Button size={'icon'} variant={'ghost'} onClick={() => setSelectedElement(null)}>
            <AiOutlineClose />
          </Button>
        </div>
        <Separator className='mb-4' />
          <PropertiesComponent elementInstance={selectedElement} />
      </div>
  )
}
