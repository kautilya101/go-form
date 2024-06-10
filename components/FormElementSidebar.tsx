import React from 'react'
import SidebarButtonElement from './buttons/SidebarButtonElement'
import { FormElementInstance, FormElements } from './FormElements'
import { Separator } from './ui/separator'

export default function FormElementSidebar() {
  return (
    <div>
      <p className="text-sm text-muted-foreground/70">Drag & Drop Elements</p>
      <Separator className='my-2'/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 place-items-center">
        <p className="text-sm text-muted-foreground place-self-start col-span-1 md:col-span-2">Layout Elements </p>
          <SidebarButtonElement formElement={FormElements.TitleField} />
          <SidebarButtonElement formElement={FormElements.SubtitleField} />
          <SidebarButtonElement formElement={FormElements.Paragraph} />
          <SidebarButtonElement formElement={FormElements.SeparatorField} />
          <SidebarButtonElement formElement={FormElements.SpacerField} />
        <p className="text-sm text-muted-foreground place-self-start col-span-1 md:col-span-2">Form Elements </p>
          <SidebarButtonElement formElement={FormElements.TextField} />
          <SidebarButtonElement formElement={FormElements.NumberField} />
          <SidebarButtonElement formElement={FormElements.TextAreaField} />
          <SidebarButtonElement formElement={FormElements.DateField} />
          <SidebarButtonElement formElement={FormElements.SelectField} />
          <SidebarButtonElement formElement={FormElements.CheckBoxField} />
      </div>
    </div>
  )
}
