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
import { LuHeading1, LuHeading2 } from "react-icons/lu"
import { BsTextParagraph } from "react-icons/bs"
import { Textarea } from "../ui/textarea"

const type: ElementsType = "Paragraph"

const extraAttributes = {
  text: 'Text here'
}

export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes 
  }),

  designerBtnElement: {
    icon: BsTextParagraph ,
    label: "Paragraph"
  },
  designerComponent:  DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesFormComponent,
  validate: () => true
}

const propertiesSchema = z.object({
  text: z.string().min(2).max(500),
})

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
}


export function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}){
  
  const element = elementInstance as CustomInstance
  const {text} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Paragraph</Label>
      <p>{text}</p>
    </div>
  )
}

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export function PropertiesFormComponent({elementInstance} : {elementInstance: FormElementInstance}){

  const { updateElement } = useDesigner()
  const element = elementInstance as CustomInstance
  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      text: element.extraAttributes.subtitle,
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  },[element,form])

  function applyChanges(values: PropertiesSchemaType){
    const { text} = values;
    updateElement(element.id,{
      ...element,
      extraAttributes: {
        text
      }
    })
  }

  return <Form {...form}>
    <form 
      onBlur={form.handleSubmit(applyChanges)}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-3"
    >
      <FormField
        control={form.control}
        name="text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Text</FormLabel>
            <FormControl>
              <Textarea
                rows={5}
                {...field}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  </Form>
}

export function FormComponent(
  {elementInstance}: 
  {elementInstance: FormElementInstance,
  }){
  
  const element = elementInstance as CustomInstance
  

  const {text} = element.extraAttributes
  return (
    <p>{text}</p>
  )
}