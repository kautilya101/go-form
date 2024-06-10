import { Separator } from "@/components/ui/separator";
import StatsCardWrapper from "@/components/wrappers/StatsCardWrapper";
import { Suspense } from "react";
import {  StatsCards, CreateFormButton  } from '@/components/index'
import { Skeleton } from "@/components/ui/skeleton";
import { GetForms } from "@/actions/form";
import { Form } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from 'date-fns'
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiRightArrowAlt } from 'react-icons/bi'
import { FaEdit } from "react-icons/fa";

export default function Home() {

  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true}/>} > 
        <StatsCardWrapper/>
      </Suspense>
      <Separator className="my-6 opacity-0" />
      <h2 className=" text-4xl font-bold col-span-2">Your Forms</h2>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormButton/>
        <Suspense fallback={[1,1,1,1].map((_,index) => (<FormCardSkeleton key={index}/>))} >
          <FormCards/>
        </Suspense>
      </div>
    </div>
  );
}

function FormCardSkeleton(){
  return <Skeleton className="border-2 border-primary/20 h-[190px] w-full" />
}

async function FormCards(){
  const forms = await GetForms();
  return <>
    {forms.map(((form) => (
      <FormCard key={form.id} form={form} />
    )))}
  </>
}

function FormCard({form}: {form: Form}){
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold capitalize">
            {form.name}
          </span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant='destructive'>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true
          })}
          {
            form.published && <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground " />
              <span> {form.visits.toLocaleString()} </span>
              <FaWpforms className="text-muted-foreground " />
              <span> {form.submissions.toLocaleString()} </span>
            </span>
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
          {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.published && 
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>View submission <BiRightArrowAlt /> </Link>
          </Button>}
        {!form.published && 
        <Button asChild className="w-full mt-2 text-md gap-4" variant="secondary">
          <Link href={`/builder/${form.id}`}>Edit Form <FaEdit /> </Link>
        </Button>}
      </CardFooter>
    </Card>
  )
}




