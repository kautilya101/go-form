"use client"

import { MdTextFields } from "react-icons/md"
import { ElementsType, FormElement, FormElementInstance, SubmitValueFunctionType } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import useDesigner from "../hooks/useDesigner"
import { Form,FormControl, FormDescription,FormField,FormItem,FormMessage,FormLabel } from '../ui/form';
import { Switch } from "../ui/switch"
import { cn } from "@/lib/utils"
import { RiSeparator } from "react-icons/ri"
import { Separator } from "../ui/separator"

const type: ElementsType = "SeparatorField"



export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
  }),

  designerBtnElement: {
    icon:  RiSeparator,
    label: "Separator Field"
  },
  designerComponent:  DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesFormComponent,
  validate: () => true
}

export function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}){
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Separator Field</Label>
      <Separator />
    </div>
  )
}


export function PropertiesFormComponent({elementInstance} : {elementInstance: FormElementInstance}){

  return <p>No properties for this element.</p>
}

export function FormComponent(
  {elementInstance}: 
  {elementInstance: FormElementInstance,
  }){
  return (
    <Separator />
  )
}