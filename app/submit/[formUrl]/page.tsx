import { getFormContentByUrl } from '@/actions/form';
import { FormElement, FormElementInstance } from '@/components/FormElements';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import React from 'react'

export default async function SubmitPage({params}:{params:{formUrl: string}}) {

  const {formUrl} = params;
  const form = await getFormContentByUrl(formUrl);

  if(!form){
    throw new Error("form not found");
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return (
   <FormSubmitComponent formUrl={formUrl} content={formContent} />
  )
}
