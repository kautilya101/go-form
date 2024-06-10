import { getFormStats } from '@/actions/form'
import { StatsCards } from '@/components/index'
import React from 'react'

export default async function StatsCardWrapper() {
  const stats = await getFormStats();
  
  return (
    <StatsCards loading={false} data={stats} />
  )
}
