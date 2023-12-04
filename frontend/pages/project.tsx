import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';

import Link from 'next/link';

interface Project {
    'name': string;
    'creator': string;
    'teammates': string[];
    'description': string;
    'image': string;
}

const Project: React.FC<{ projects: Project[] }> = ({ projects }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg h-auto p-2 m-4 max-w-screen break-words">
            <div className="p-2 flex items-center justify-between flex-wrap">
                <h1 className="text-5xl text-slate-900 dark:text-white">Projets</h1>
                <Link href="/create-project" title="Créer un projet" className="text-xl text-slate-900 dark:text-white hover:text-2xl focus:font-semibold font-bold justify-content: space-between">CREER PROJETS</Link>
            </div>
            <div>
                <button className="btn w-16 py-2 px-2 m-2 rounded-3xl bg-red-500 dark:bg-red-600 hover:bg-red-600 ring-opacity-75 ring-red-400 text-white text-lg focus:font-bold dark:hover:bg-red-700">
                    {/* attribut -> onClick={helloworld} */}
                    All
                </button>
                <button className="btn w-18 py-2 px-2 m-2 rounded-3xl text-lg border-solid border-2 bg-slate-50 hover:bg-slate-200 border-slate-300 hover:border-indigo-300 text-slate-900 dark:text-white dark:bg-slate-400 focus:font-bold">
                    {/* attribut -> onClick={helloworld} */}
                    Done
                </button>
            </div>
            <div>
                <ul data-te-infinite-scroll-init className="overflow-y-scroll max-w-screen md:grid md:grid-cols-2 lg:grid-cols-3">
                    {projects?.map((project: Project, idx: number) => (
                        <li key={idx} className="m-4 list-none rounded-lg bg-gray-300 dark:bg-gray-900 text-black dark:text-gray-300 p-4 shadow-lg">
                            <Image src={project.image} alt={project.name} className="object-cover rounded-lg aspect-square mx-auto w-40 md:w-full"/>
                            <p className="mt-4 text-lg break-words text-center">Creator: {project.creator}</p>
                            <div className="m-2 break-words">
                                <h1 className="text-4xl break-words">{project.name}</h1>
                                <p className="mt-2 text-lg break-words">{project.description}</p>
                                <ul className="p-1 lg:p-4 h-auto grid lg:grid-cols-2 lg:gap-4 break-words">
                                    {project.teammates?.map((member: string, index: number) => (
                                        <li key={index} className="text-lg break-words">{member}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await fetch('https://raw.githubusercontent.com/LaolouRavon-Laforest/exemple_html_base_json/main/exemple_base_json.json');
    const projects = (await res.json()).project;
    return {
        props: { projects: projects || [] }
    };
};

export default Project;