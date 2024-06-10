import { getFormStats } from '@/actions/form'
import { LuView } from 'react-icons/lu'
import React, { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';


interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof getFormStats>>;
  loading: boolean
}

export default function StatsCards(props: StatsCardsProps) {
  const {data, loading} = props;
  return (
    <div className=' w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 '>
        <StatsCard 
          title="Total visits" 
          icon={<LuView className=" text-blue-600 "/>}  
          helperText="All time form visits"
          value={data?.visits.toLocaleString() || ""}
          loading={loading}
          className=" shadow-md shadow-slate-600"
        />
        <StatsCard 
          title="Total submissions" 
          icon={<FaWpforms className=" text-blue-500 "/>} 
          helperText='All time submmissions'
          value={data?.submissions.toLocaleString() || ""}
          loading={loading}
          className='shadow-md shadow-slate-600'
        />
        <StatsCard 
          title="Submissions Rate"
          icon={<HiCursorClick className=" text-blue-400 "/>} 
          helperText='Visits that result in submission'
          value={data?.submissionsRate.toLocaleString() + "%" || ""}
          loading={loading}
          className='shadow-md shadow-slate-600'
        />
        <StatsCard 
          title="Bounce Rate" 
          icon={<TbArrowBounce className=" text-blue-300 "/>} 
          helperText='Form visited but not submitted'
          value={data?.bounceRate.toLocaleString() + "%"|| ""}
          loading={loading}
          className='shadow-md shadow-slate-600'
        />
    </div>
  )
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className
}: {
  title: string,
  value: string,
  helperText: string,
  loading: boolean,
  icon: ReactNode,
  className: string 
} ){
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className=' text-2xl font-bold'>
          {loading && 
          <Skeleton>
            <span className=' opacity-0'>
              0
            </span>
          </Skeleton>}
          {!loading && value}
        </div>
        <p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
      </CardContent>
    </Card>
  );
}
