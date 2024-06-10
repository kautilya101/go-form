"use client"

import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElementInstance, FormElements } from './FormElements'
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { ImSpinner } from 'react-icons/im';
import { SubmitForm } from '@/actions/form';

export default function FormSubmitComponent({formUrl,content}: {formUrl: string, content: FormElementInstance[]}) {

  const formValues = useRef<{[key:string]:string}>({}) // to prevent re render each time value is changed
  const formErrors = useRef<{[key:string]: boolean}>({});
  const [renderKey, setRenderKey] = useState(Math.random());
  const [submitted,setSubmitted] = useState(false);
  const [pending,setTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for( const field of content){
      const fieldValue = formValues.current[field.id] || '';
      const valid = FormElements[field.type].validate(field,fieldValue)
      console.log("valid value in line 18:",valid)
      if(!valid){
        formErrors.current[field.id] = true
      }
      
    }
    if(Object.keys(formErrors.current).length > 0) return false
    return true;
  },[content]) 

  const submitValue = (key:string,value:string) => {
    formValues.current[key] = value;
  }

  const submitForm = async() => {
    formErrors.current = {};
    const validForm = validateForm()
    if(!validForm){
      setRenderKey(Math.random());
      toast({
        title: 'Form Error',
        description: 'please check the form',
        variant: 'destructive'
      })
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current)
      await SubmitForm(formUrl,jsonContent);
      setSubmitted(true);
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Something went wrong!',
        variant: 'destructive'
      })
    }
  }

  if(submitted){
     return(
      <div className="flex justify-center items-center p-8 w-full h-full">
        <div className="max-w-[620px] 
      flex flex-col gap-4 flex-grow 
      bg-background w-full p-8 overflow-y-auto
      border shadow-lg shadow-blue-900/80 rounded
      ">
        <h1 className="text-2xl font-bold">Form Submitted</h1>
        <p className="text-muted-foreground">
          Thank you for submitting the form, you can close this page now.
        </p>
      </div>
      </div>
     )
  }

  return (
    <div className='flex items-center justify-center h-full w-full p-8'>
      <div className="max-w-[620px] 
      flex flex-col gap-4 flex-grow 
      bg-background w-full p-8 overflow-y-auto
      border shadow-lg shadow-blue-900/80 rounded
      ">
        {content.map((element) => {
          const FormElementComponent  = FormElements[element.type].formComponent;
          return <FormElementComponent 
            key={element.id} 
            elementInstance={element} 
            submitValue={submitValue} 
            isInvalid={formErrors.current[element.id]} 
            defaultValue={formValues.current[element.id]}
          />
        })}
        <Button 
          className='mt-3' 
          disabled={pending}
          onClick={() => {
            setTransition(submitForm);
          }
          }>
          { !pending &&
            <>
            Submit
            </>
          }
          {pending && <ImSpinner className='animate-spin' />}
        </Button>
      </div>
      
    </div>
  )
}
