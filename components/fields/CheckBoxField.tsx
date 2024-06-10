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
import { IoMdCheckbox } from "react-icons/io";
import { Checkbox } from "../ui/checkbox"
import { tree } from "next/dist/build/templates/app-page"

const type: ElementsType = "CheckBoxField"

const extraAttributes = {
  label: "CheckBox Field",
  helperText: "Helper Text",
  required: false,
}

export const CheckBoxFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes 
  }),

  designerBtnElement: {
    icon: IoMdCheckbox ,
    label: "CheckBox Field"
  },
  designerComponent:  DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesFormComponent,
  validate(formElement , currentValue) {
    const element = formElement as CustomInstance;
    if(element.extraAttributes.required){
      return currentValue === "true"
    }
    return true;
  },
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(30),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
})

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
}


export function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}){
  
  const element = elementInstance as CustomInstance
  const {label, required, helperText} = element.extraAttributes
  const id = `checkbox-${element.id}`;
  return (
    <div className="flex items-top space-x-2">    
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>
          {label}<span className="text-red">{required && "*"}</span>
        </Label>
        {helperText && (
          <p className=" text-muted-foreground text-[0.8rem]">
            {helperText}
          </p>
        )}
      </div>
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
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  },[element,form])

  function applyChanges(values: PropertiesSchemaType){
    console.log(values);
    const { label, helperText, required} = values;
    updateElement(element.id,{
      ...element,
      extraAttributes: {
        label, helperText, required
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
  const [value,setValue] = useState<boolean>(defaultValue === "true" ? true : false);
  const [error,setError] = useState(false);
 
    useEffect(() => {
      setError(isInvalid === true);
    },[isInvalid])

  const {label, required, helperText} = element.extraAttributes
  const id = `checkbox-${element.id}`;
  return (
    <div className="flex items-top space-x-2">    
      <Checkbox 
        id={id} 
        checked={value} 
        className={cn(error && "border-red-500")}
        onCheckedChange={(checked) => {
          let value = false;
          if(checked === true) value = true;
          setValue(value);
          if(!submitValue) return;
          const valid = CheckBoxFieldFormElement.validate(element, value ? "true" : "false");
          setError(!valid)
          submitValue(element.id, value ? "true" : "false");
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className={cn(error && 'border-red-500')}>
          {label}<span className="text-red">{required && "*"}</span>
        </Label>
        {helperText && (
          <p className={cn(" text-muted-foreground text-[0.8rem]",error && 'border-red-500')}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  )
}