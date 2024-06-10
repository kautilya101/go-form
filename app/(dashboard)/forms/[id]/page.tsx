import { GetForms, getFormById, getFormWithSubmissions } from '@/actions/form';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbAntennaBars1, TbArrowBounce } from 'react-icons/tb';
import { LuView } from 'react-icons/lu'
import { StatsCard } from '@/components/StatsCards';
import FormLinkShare from '@/components/buttons/FormLinkShare';
import VisitButton from '@/components/buttons/VisitButton';
import React, { ReactNode } from 'react'
import { ElementsType, FormElementInstance } from '@/components/FormElements';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, formatDistance } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export default async function FormDetailsPage({params} : {params: {id: string}}) {
  
  const form = await getFormById(Number(params.id));

  if(!form){
    throw new Error("form not found!")
  }

  const { visits, submissions } = form

  let submissionsRate = 0;

  if(visits > 0){
    submissionsRate = (submissions / visits) * 100
  }

  const bounceRate = 100 - submissionsRate;
 

  return (<>
    <div className="py-6">
      <div className="flex justify-between container">
        <h1 className="text-4xl font-bold truncate">{form.name}</h1>
        <VisitButton shareUrl={form.shareURL} />
      </div>
    </div>
    <div className="pb-4 pt-2 border-b border-muted">
        <div className="container flex justify-between gap-2 items-center">
          <FormLinkShare shareUrl={form.shareURL}/>
        </div>
    </div>
    <div className="w-full pt-8 gap-4 grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 container">
    <StatsCard 
          title="Total visits" 
          icon={<LuView className=" text-blue-600 "/>}  
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          loading={false}
          className=" shadow-md shadow-slate-600"
        />
        <StatsCard 
          title="Total submissions" 
          icon={<FaWpforms className=" text-blue-500 "/>} 
          helperText='All time submmissions'
          value={submissions.toLocaleString() || ""}
          loading={false}
          className='shadow-md shadow-slate-600'
        />
        <StatsCard 
          title="Submissions Rate"
          icon={<HiCursorClick className=" text-blue-400 "/>} 
          helperText='Visits that result in submission'
          value={submissionsRate.toLocaleString() + "%" || ""}
          loading={false}
          className='shadow-md shadow-slate-600'
        />
        <StatsCard 
          title="Bounce Rate" 
          icon={<TbArrowBounce className=" text-blue-300 "/>} 
          helperText='Form visited but not submitted'
          value={bounceRate.toLocaleString() + "%"|| ""}
          loading={false}
          className='shadow-md shadow-slate-600'
        />
    </div>
    <div className="container pt-10">
      <SubmissionsTable id={form.id} />
    </div>
    </>)
}

type Row = {[key:string]: string} & {
  submittedAt: Date
}


async function SubmissionsTable({id}:{id:number}){
  const form = await getFormWithSubmissions(id);

  if(!form){
    throw new Error("fomr not found!")
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const  columns: {
    id: string,
    label:string,
    required: boolean,
    type: ElementsType,
  }[] = []

  formElements.forEach((element)=>{
    switch(element.type){
      case "TextField": 
      case "NumberField": 
      case "TextAreaField": 
      case "SelectField": 
      case "DateField": 
      case "CheckBoxField": 
      columns.push({
        id: element.id,
        label: element.extraAttributes?.label,
        required: element.extraAttributes?.required,
        type: element.type
      })
      break;
      default: break;
    }
  })

  const rows: Row[] = []
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content)
    rows.push({
      ...content,
      submittedAt: submission.createdAt
    })
  })

  return (
    <>
    <h1 className="text-xl font-bold my-4">
      Submissions
    </h1>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className='uppercase' >{column.label}</TableHead>
            ))}
            <TableHead className=' text-muted-foreground text-right uppercase'>
              Submitted at
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {rows.map((row,index) => (
              <TableRow key={index}>
                {
                  columns.map((column) => (
                    <RowCell 
                    key={column.id } 
                    type={column.type} 
                    value={row[column.id]} />
                  ))
                }
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt,new Date(),{
                    addSuffix: true
                  })}  
                </TableCell> 
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
    </>
  );
}

function RowCell({type,value}:{type: ElementsType,value: string}){
  let node:ReactNode = value

  switch(type){
    case 'DateField':
      if(!value) break;
      const date = new Date(value);
      node = <Badge variant={'outline'}>
        {format(date,'dd/MM/yyyy')}
      </Badge>
      break;
    case 'CheckBoxField':
      const checked = value === "true"
      node = <Checkbox checked={checked} />
      break;
  }
  return <TableCell>{node}</TableCell>
}