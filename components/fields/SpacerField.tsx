"use client"

import { ElementsType, FormElement, FormElementInstance, SubmitValueFunctionType } from "../FormElements"
import { Label } from "../ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import useDesigner from "../hooks/useDesigner"
import { Form,FormControl, FormDescription,FormField,FormItem,FormMessage,FormLabel } from '../ui/form';
import { LuSeparatorHorizontal } from "react-icons/lu"
import { Slider } from "../ui/slider"

const type: ElementsType = "SpacerField"

const extraAttributes = {
  height: 20,
}

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes 
  }),

  designerBtnElement: {
    icon: LuSeparatorHorizontal ,
    label: "Spacer Field"
  },
  designerComponent:  DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesFormComponent,
  validate: () => true
}

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
})

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
}


export function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}){
  
  const element = elementInstance as CustomInstance
  const {height} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">Spacer Field: {height}px</Label>
      <LuSeparatorHorizontal className="h-8 w-8" />
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
      height: element.extraAttributes.height,
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  },[element,form])

  function applyChanges(values: PropertiesSchemaType){
    const { height } = values;
    updateElement(element.id,{
      ...element,
      extraAttributes: {
        height
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
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height (px): {form.watch('height')}</FormLabel>
            <FormControl className="pt-2">
                <Slider
                  className=" cursor-pointer"
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    console.log(value);
                    field.onChange(value[0])
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
  

  const {height} = element.extraAttributes
  return (
    <div style={{ height,width: "100%"}}></div>
  )
}