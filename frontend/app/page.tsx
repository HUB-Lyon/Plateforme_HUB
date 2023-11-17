"use client"
import Link from '../node_modules/next/link';

function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1><strong>WELCOME TO THE EPITECH LYON HUB WEBSITE</strong></h1>
      <div className="flex-box w-4/5">
        <Link href="/inventory" className='lg:text-3xl md:text-2xl text-md p-4'><strong>INVENTORY</strong></Link>
      </div>
      <div className="flex-box w-4/5">
        <Link href="/project" className='lg:text-3xl md:text-2xl text-md p-4'><strong>PROJECTS</strong></Link>
      </div>
    </div>
    );
}

export default Home;
