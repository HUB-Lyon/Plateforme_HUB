import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { fill_project, fill_user } from '../model';
import Image from 'next/image';

const Project: React.FC<{ projects: fill_project[], users: fill_user[] }> = ({ projects, users }) => {
    const getStatus = (status: string): string => {
        switch (status) {
        case 'Pending':
            return 'bg-gray-500'; 
        case 'in Progress':
            return 'bg-yellow-500'; 
        case 'Done':
            return 'bg-green-800'; 
        case 'Archived':
            return 'bg-green-300'; 
        case 'Refused':
            return 'bg-red-500'; 
        case 'req finish':
            return 'bg-purple-500'; 
        default:
            return 'bg-slate-100';
        }
    };
    const getUserInfo = (leaderId: number): fill_user | undefined => {
        return users.find(user => user.id === leaderId);
    };

    return (
        <div className="h-auto p-2 m-4 max-w-screen break-words">
            <div className="p-2 flex items-center justify-between flex-wrap">
                <h1 className="text-5xl text-slate-900">Projects</h1>
                <Link href="/create-project" title="Create project" className="text-xl text-slate-900 hover:text-2xl focus:font-semibold font-bold justify-content: space-between">CREATE PROJECT</Link>
            </div>
            <div>
                <ul data-te-infinite-scroll-init className="overflow-y-scroll gap-6 max-w-screen md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {projects?.map((project: fill_project, idx: number) => {
                        const leaderUser = getUserInfo(project.leader_id);
                        return (
                            <li key={idx} className="m-4 flex flex-col justify-between relative rounded-xl bg-white text-black shadow-xl transition ease-in-out delay-100 hover:scale-105 duration-250">
                                {/* <Link href={`/project/${project.id}`} title={project.name}> */}
                                <Image src={project.image} alt={project.name} width={300} height={300} className="object-cover rounded-t-lg aspect-square mx-auto w-40 md:w-full"></Image>
                                <div className="m-2 break-words">
                                    <h1 className="text-center text-4xl break-words">{project.name}</h1>
                                    <p className="line-clamp-5 mt-2 text-lg break-words">{project.description}</p>
                                    <p className="italic font-light mt-8 p-2 text-sm break-words">
                                        {leaderUser ? (leaderUser.email) : ('N/A')}
                                    </p>
                                </div>
                                <div className={`rounded-b-lg ${getStatus(project.status)} w-auto h-10 md:h-12 lg:h-16 mb-0`}></div>
                                {/* </Link> */}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const ProjectRes = await fetch('http://localhost:3000/projects/', { method: 'GET' });
        const UsersRes = await fetch('http://localhost:3000/users/', { method: 'GET' });
        
        if (!ProjectRes.ok) throw new Error('Failed to fetch projects');
        if (!UsersRes.ok) throw new Error('Failed to fetch users');
        const projects: fill_project[] = await ProjectRes.json();
        const users: fill_user[] = await UsersRes.json();
        return {
            props: { projects: projects || [], users: users || [] }
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: { projects: [], users: [] }
        };
    }
};

export default Project;
