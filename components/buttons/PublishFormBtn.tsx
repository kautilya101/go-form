import React, { useTransition } from 'react'
import { Button } from '../ui/button'
import { MdOutlinePublish } from 'react-icons/md'
import {  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, } from '../ui/alert-dialog'
import { FaSpinner } from 'react-icons/fa'
import { toast } from '../ui/use-toast'
import { publishForm, updateFormContent } from '@/actions/form'
import { useRouter } from 'next/navigation'
import useDesigner from '../hooks/useDesigner'



export default function PublishFormBtn({id}: {id: number}) {
  const {elements} = useDesigner();
  const [loading, setTransition] = useTransition();
  const router = useRouter();

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

  const publishLocalForm = async() => {
    try{
      await publishForm(id);
      toast({
        title: "Success",
        description: "form is now available publicly"
      })
      router.refresh();
    }
    catch(e){
        toast({
          title: 'Error',
          description: 'Unable to publish at the moment',
          variant: 'destructive'
        })
    
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className='gap-2
        text-white bg-gradient-to-r 
        from-red-400 to-cyan-500'>
          <MdOutlinePublish className='h-4 w-4' />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>After publishing you won't be able to edit this form.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            disabled={loading} 
            onClick={
              (e) => {
                e.preventDefault()
                setTransition(updateFormContentData)
                setTransition(publishLocalForm);
              }} 
            >
              Proceed 
              {loading && <FaSpinner className='animate-spin'/>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
