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
import { RxDropdownMenu } from "react-icons/rx";
import { Select } from "../ui/select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai"
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

const type: ElementsType = "SelectField"

const extraAttributes = {
  label: "Select Field",
  helperText: "Helper Text",
  required: false,
  placeholder: "Value here...",
  options: []
}

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes 
  }),

  designerBtnElement: {
    icon: RxDropdownMenu ,
    label: "Select Field"
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
  options: z.array(z.string()).default([]),
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
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </Select>
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

  const { updateElement, setSelectedElement } = useDesigner()
  const element = elementInstance as CustomInstance
  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder,
      options: element.extraAttributes.options
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  },[element,form])

  function applyChanges(values: PropertiesSchemaType){
    console.log(values);
    const { label, helperText, required, placeholder, options} = values;
    updateElement(element.id,{
      ...element,
      extraAttributes: {
        label, helperText, required, placeholder, options
      }
    })
    toast({
      title: 'Success',
      description: "Properties Saved Successfully"
    })
    setSelectedElement(null)
  }

  return <Form {...form}>
    <form 
      onSubmit={form.handleSubmit(applyChanges)}     
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
        name="options"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Options</FormLabel>
              <Button variant={'outline'} className="gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  form.setValue('options',field.value.concat("New Option"))
                }}
              >
                <AiOutlinePlus/>
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {form.watch("options").map((option,index) => (
                <div key={index} className="flex items-center justify-between gap-1">
                  <Input 
                    value={option} 
                    placeholder=""
                    onChange={(e) => {
                      field.value[index] = e.target.value;
                      field.onChange(field.value)
                    }}
                  />
                  <Button 
                    variant={'ghost'} 
                    size={'icon'}
                    onClick={e => {
                      e.preventDefault();
                      const newOptions = [...field.value]
                      newOptions.splice(index,1)
                      field.onChange(newOptions)
                    }}  
                  >
                    <AiOutlineClose/>
                  </Button>
                </div>
              ))}
            </div>
            
            <FormDescription>
              The helper text of the field. <br/> It will be displayed below the field.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="w-full" type="submit">Save</Button>
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

  const {label, placeholder, required, helperText, options} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && 'text-red-500')}>
        {label}<span className="text-red">{required && "*"}</span>
      </Label>
      <Select 
      defaultValue={value}
      onValueChange={value => {
        setValue(value);
        if(!submitValue) return;
        const valid = SelectFieldFormElement.validate(element,value);
        setError(!valid)
        // if(!valid) return;
        submitValue(element.id,value);
      }}>
        <SelectTrigger 
          className={cn("w-full",error && 'border-red-500')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option,index) => (
            <SelectItem key={index} value={option} >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className={cn(" text-muted-foreground text-[0.8rem]",error && "text-red-500",)}>
          {helperText}
        </p>
      )}
    </div>
  )
}