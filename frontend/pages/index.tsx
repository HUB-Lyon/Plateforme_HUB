import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            <h1 className='font-bold'>WELCOME TO THE EPITECH LYON HUB WEBSITE</h1>
            <div className="flex-box w-4/5">
                <Link href="/inventory" className='lg:text-3xl md:text-2xl text-md p-4 font-bold'>INVENTORY</Link>
            </div>
            <div className="flex-box w-4/5">
                <Link href="/project" className='lg:text-3xl md:text-2xl text-md p-4 font-bold'>PROJECTS</Link>
            </div>
        </div>
    );
};

export default Home;
