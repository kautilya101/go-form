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
import { BsFillCalendarDateFill } from "react-icons/bs"
import { Button } from "../ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { PopoverContent } from "@radix-ui/react-popover"
import { Calendar } from "../ui/calendar"

const type: ElementsType = "DateField"

const extraAttributes = {
  label: "Date Field",
  helperText: "Pick a date",
  required: false,
}

export const DateFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes 
  }),

  designerBtnElement: {
    icon: BsFillCalendarDateFill ,
    label: "Date Field"
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
})

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
}


export function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}){
  
  const element = elementInstance as CustomInstance
  const {label, placeholder, required, helperText} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}<span className="text-red">{required && "*"}</span>
      </Label>
      <Button variant={'outline'} className="w-full justify-start text-left font-normal">
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>Pick a Date</span>
      </Button>
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
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  },[element,form])

  function applyChanges(values: PropertiesSchemaType){
    console.log(values);
    const { label, helperText, required } = values;
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
  const [date,setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined);
  const [error,setError] = useState(false);
 
    useEffect(() => {
      setError(isInvalid === true);
    },[isInvalid])

  const {label,required, helperText} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && 'text-red-500')}>
        {label}<span className="text-red">{required && "*"}</span>
      </Label>
      <Popover>
        <PopoverTrigger>
        <Button 
          variant={'outline'} 
          className={cn('w-full justify-start text0left font-normal',
           !date && "text-muted-foreground", 
           error && "border-red-500")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a Date</span> }
        </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={date => {
              setDate(date);

              if(!submitValue) return;
              const value = date?.toUTCString() || "";
              const valid = DateFieldFormElement.validate(element,value)
              setError(!valid)
              if(!valid) return;
              submitValue(element.id,value);
            }}
            initialFocus
          />

        </PopoverContent>
      </Popover>
      {helperText && (
        <p className={cn(" text-muted-foreground text-[0.8rem]",error && "text-red-500",)}>
          {helperText}
        </p>
      )}
    </div>
  )
}