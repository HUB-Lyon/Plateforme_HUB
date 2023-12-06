import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { fill_project } from '../model';
import Image from 'next/image';

const Project: React.FC<{ projects: fill_project[] }> = ({ projects }) => {
    return (
        <div className="bg-white rounded-lg h-auto p-2 m-4 max-w-screen break-words">
            <div className="p-2 flex items-center justify-between flex-wrap">
                <h1 className="text-5xl text-slate-900">Projects</h1>
                <Link href="/create-project" title="Create project" className="text-xl text-slate-900 hover:text-2xl focus:font-semibold font-bold justify-content: space-between">CREATE PROJECT</Link>
            </div>
            <div>
                <ul data-te-infinite-scroll-init className="overflow-y-scroll gap-8 max-w-screen md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {projects?.map((project: fill_project, idx: number) => (
                        <li key={idx} className="m-4 list-none rounded-xl bg-gray-300 text-black p-4 shadow-xl transition ease-in-out delay-100 hover:scale-105 duration-250">
                            <Image src={project.image} alt={project.name} width={200} height={200} className="object-cover rounded-lg aspect-square mx-auto w-40 md:w-full"></Image>
                            <div className="m-2 break-words">
                                <h1 className="text-4xl break-words">name: {project.name}</h1>
                                <p className="mt-2 text-lg break-words">description: {project.description}</p>
                                <p className="mt-2 text-lg break-words">id: {project.id}</p>
                                <p className="mt-2 text-lg break-words">date: {project.created_at}</p>
                                <p className="mt-2 text-lg break-words">leader: {project.leader_id}</p>
                                <p className="mt-2 text-lg break-words">status: {project.status}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const res = await fetch('http://localhost:3000/projects/', { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch projects');
        const projects: fill_project[] = await res.json();
        return {
            props: { projects: projects || [] }
        };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return {
            props: { projects: [] }
        };
    }
};

export default Project;
