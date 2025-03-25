import React from 'react'
import LeftSideBar from '../components/LeftSideBar'


const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
        <main className="pt-16 flex flex-1">
        <LeftSideBar />
        </main>
    </div>
  )
}

export default HomePage