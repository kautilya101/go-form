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
import { BsTextareaResize } from "react-icons/bs"
import { Textarea } from "../ui/textarea"
import { Slider } from "../ui/slider"

const type: ElementsType = "TextAreaField"

const extraAttributes = {
  label: "TextArea Field",
  helperText: "Helper Text",
  required: false,
  placeholder: "write here...",
  rows: 3,
}

export const TextAreaFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes 
  }),

  designerBtnElement: {
    icon: BsTextareaResize ,
    label: "TextArea Field"
  },
  designerComponent:  DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesFormComponent,
  validate(formElement , currentValue) {
    const element = formElement as CustomInstance;
    if(element.extraAttributes.required){
      return currentValue.length > 0
    }
    return true;
  },
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(30),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  rows: z.number().min(1).max(10)
})

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
}


export function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}){
  
  const element = elementInstance as CustomInstance
  const {label, placeholder, required, helperText,rows} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}<span className="text-red">{required && "*"}</span>
      </Label>
      <Textarea
        readOnly 
        disabled  
        placeholder={placeholder}  
      />
      {helperText && (
        <p className=" text-muted-foreground text-[0.8rem]">
          {helperText}
        </p>
      )}
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
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder,
      rows: element.extraAttributes.rows
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  },[element,form])

  function applyChanges(values: PropertiesSchemaType){
    console.log(values);
    const { label, helperText, required, placeholder,rows} = values;
    updateElement(element.id,{
      ...element,
      extraAttributes: {
        label, helperText, required, placeholder, rows
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
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input
                {...field}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
            </FormControl>
            <FormDescription>
              The label of the field. <br /> It will be displayed above the field
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="helperText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Helper Text</FormLabel>
            <FormControl>
              <Input
                {...field}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
            </FormControl>
            <FormDescription>
              The helper text of the field. <br/> It will be displayed below the field.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-md border p-3 shadow-sm">
            <div className="space-y-0.5">
            <FormLabel>Required</FormLabel>
            <FormDescription>Make requied field.</FormDescription>
            </div>
            <FormControl>
              <Switch 
                checked={field.value} 
                onCheckedChange={field.onChange} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="placeholder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placeholder</FormLabel>
            <FormControl>
              <Input
                {...field}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
            </FormControl>
            <FormDescription>
              Default value to be displayed in input.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rows"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rows {form.watch("rows")}</FormLabel>
            <FormControl>
              <Slider 
                defaultValue={[field.value]}
                min={1}
                max={10}
                step={1}
                onValueChange={value => {
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
  {elementInstance,submitValue,isInvalid,defaultValue}: 
  {elementInstance: FormElementInstance,
    submitValue?: SubmitValueFunctionType
    isInvalid?: boolean,
    defaultValue?: string
  }){
  
  const element = elementInstance as CustomInstance
  const [value,setValue] = useState(defaultValue || "");
  const [error,setError] = useState(false);
 
    useEffect(() => {
      setError(isInvalid === true);
    },[isInvalid])

  const {label, placeholder, required, helperText,rows} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && 'text-red-500')}>
        {label}<span className="text-red">{required && "*"}</span>
      </Label>
      <Textarea
        rows={rows} 
        placeholder={placeholder}
        className={cn(error && 'border-red-500')}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        onBlur={(e) => {
          if(!submitValue){
            return
          }
          const valid = TextAreaFieldFormElement.validate(element, e.target.value)
          setError(!valid)
          if(!valid) return;
          submitValue(element.id, e.target.value); 
        }}
        value={value}
      />
      {helperText && (
        <p className={cn(" text-muted-foreground text-[0.8rem]",error && "text-red-500",)}>
          {helperText}
        </p>
      )}
    </div>
  )
}