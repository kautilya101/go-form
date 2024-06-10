import React, { useTransition } from 'react'
import { Button } from '../ui/button'
import { HiSaveAs } from 'react-icons/hi'
import useDesigner from '../hooks/useDesigner';
import { updateFormContent } from '@/actions/form';
import { toast } from '../ui/use-toast';
import { FaSpinner } from 'react-icons/fa';

export default function SaveFormBtn({id}: {id: number}) {

  const {elements} = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContentData = async() => {
    try{
      const JsonElements = JSON.stringify(elements);
      await updateFormContent(id,JsonElements);
      toast({
        title: "Success",
        description: 'Your form has been saved'
      })
    }
    catch(e){
      toast({
        title: 'Error',
        description: 'Something Went Wrong!',
        variant: 'destructive'
      })
    }

  }

  return (
    <Button variant={"outline"} className='gap-2' disabled={loading} onClick={ () => startTransition(updateFormContentData) } >
      <HiSaveAs className='h-4 w-4' />
      Save
      {loading && <FaSpinner className='animate-spin'/>}
    </Button>
  )
}
