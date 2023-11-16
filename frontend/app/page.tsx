"use client"
import './globals.css';
import Link from '../node_modules/next/link';
import { useWindowWidth } from './features';

function Home() {
  const windowWidth = useWindowWidth();
  const ChangeFlexBoxSize = windowWidth >= 370 ? 'w-1/3' : 'w-32';

  return (
    <div className='App'>
      <h1 className='lg:ml-[25%] ml-[5%] mt-[2%]'><strong>WELCOME TO THE EPITECH LYON HUB WEBSITE</strong></h1>
      <div className={`flex-box ${ChangeFlexBoxSize}`}>
        <Link href="/Inventory" className='lg:text-3xl md:text-2xl text-md p-4'><strong>INVENTORY</strong></Link>
      </div>
      <div className="flex-box w-4/5">
        <Link href="/Project" className='lg:text-3xl md:text-2xl text-md p-4'><strong>PROJECTS</strong></Link>
      </div>
    </div>
    );
}

export default Home;
