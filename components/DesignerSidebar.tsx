import React from 'react'
import useDesigner from './hooks/useDesigner'
import FormElementSidebar from './FormElementSidebar'
import DesignerElementProperties from './DesignerElementProperties'

export default function DesignerSidebar() {
  const { selectedElement } = useDesigner()
  return (
    <aside className='w-[400px] max-w-[400px] h-full
    flex flex-col flex-grow gap-2 overflow-y-auto
    border-l-2 border-muted p-4 bg-background'>
      {!selectedElement && <FormElementSidebar />}
      {selectedElement && <DesignerElementProperties />}
    </aside>
  )
}
