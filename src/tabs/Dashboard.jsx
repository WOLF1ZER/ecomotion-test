import React from 'react'
import Hero from '../components/Hero';
import Badges from '../components/Badges';
import WeeklyJourneys from '../components/WeeklyStats';
import PlannedJourneys from '../components/PlannedJourneys';


const Dashboard = () => {
  return (
   <div className='mb-[100px] space-y-14'>
    <Hero />
    <Badges />
    <WeeklyJourneys />
    <PlannedJourneys />
   </div>
    
  )
}

export default Dashboard;