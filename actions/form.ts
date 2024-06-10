"use server"

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs/server"

class UserNotFoundErr extends Error{}

export async function isLoggedIn(){
  const user = await currentUser();
  if(user) return true;
  return false;
}

export async function getFormStats(){
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr('Login to create form',)
  }

  const stats = prisma.form.aggregate({
    where:{
      userId: user.id ,
    },
    _sum:{
      visits: true,
      submissions: true,
    }
  })

  const visits = (await stats)._sum.visits || 0;
  const submissions = (await stats)._sum.submissions || 0;

  let submissionsRate = 0;

  if(visits > 0){
    submissionsRate = (submissions / visits) * 100
  }

  const bounceRate = 100 - submissionsRate

  return {
    visits, submissions, submissionsRate, bounceRate
  }
}

export async function createForm(data : formSchemaType) {
  
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr(  )
  }

  const {name,description} = data

  const form = await prisma.form.create({
    data:{
      userId: user.id,
      name,
      description
    }
  });

  if(!form){
    throw new Error("something went wrong!")
  }

  return form.id
}

export async function GetForms(){
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr();
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id
    },
    orderBy:{
      createdAt: "desc"
    }
  })
}

export async function getFormById(formId: number){
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id: formId  
    }
  })
}

export async function updateFormContent(id: number, elements: string){
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr();
  }

  return prisma.form.update({
    where:{
      userId: user.id,
      id
    },
    data: {
      content: elements
    }
  })
}

export async function publishForm(id: number){
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr();
  }

  return prisma.form.update({
    where:{
      userId: user.id,
      id
    },
    data: {
      published: true
    }
  })

}

export async function getFormContentByUrl(formUrl: string){
  return await prisma.form.update({
    select:{
      content: true,
    },
    data:{
      visits:{
        increment: 1,
      }
    },
    where:{
      shareURL: formUrl
    }
  })
}

export async function SubmitForm(formUrl:string,content:string){
  return await prisma.form.update({
    where: {
      shareURL:formUrl,
      published: true
    },
    data: {
      submissions:{
        increment: 1
      },
      FormSubmissions: {
        create:{
          content: content,
        }
      }
    }
  })  
}

export async function getFormWithSubmissions(id: number){
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr();
  }
  return prisma.form.findUnique({
    where: {
      userId: user.id,
      id
    },
    include:{
      FormSubmissions: true
    }
  })
}