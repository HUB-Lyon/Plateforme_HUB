import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Project, User } from '../model';

export const getStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'PENDING': 'border-gray-500',
        'IN_PROGRESS': 'border-yellow-500',
        'DONE': 'border-green-800',
        'ARCHIVED': 'border-green-300',
        'REFUSED': 'border-red-500',
        'REQ_FINISH': 'border-purple-500',
        'default': 'border-slate-100',
    };
    return statusMap[status] || statusMap['default'];
};

export const getTitleStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'PENDING': 'Pending',
        'IN_PROGRESS': 'in progress',
        'DONE': 'done',
        'ARCHIVED': 'archived',
        'REFUSED': 'refused',
        'REQ_FINISH': 'req finish',
        'default': 'unknown',
    };
    return statusMap[status] || statusMap['default'];
};

const Project: React.FC<{ projects: Project[], users: User[] }> = ({ projects, users }) => {
    const getUserInfo = (leaderId: number): User | undefined => {
        return users.find(user => user.id === leaderId);
    };

    if (projects.length === 0) {
        return (
            <div className="h-auto p-2 m-4 max-w-screen break-words">
                <div className="p-2">
                    <h1 className="text-5xl text-slate-900">No Projects Available</h1>
                    <Link href="/create-project" title="Create project" className="text-xl text-slate-900 hover:text-2xl focus:font-semibold font-bold justify-content: space-between">Create Project</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-auto p-2 m-4 mb-6 max-w-screen break-words">
            <div className="p-2 mb-4 flex items-center justify-between flex-wrap">
                <h1 className="text-5xl text-slate-900">Projects</h1>
                <Link href="/create-project" title="Create project" className="text-xl text-slate-900 hover:text-2xl focus:font-semibold font-bold justify-content: space-between">Create Project</Link>
            </div>
            <div>
                <ul className="gap-8 max-w-screen md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {projects.map((project: Project) => {
                        const leaderUser = getUserInfo(project.leaderId);
                        return (
                            <li key={project.id} className={`m-2 hover:filter hover:contrast-125 flex flex-col justify-between relative rounded-xl bg-white text-black shadow-xl transition ease-in-out delay-100 hover:scale-105 duration-250 border-b-8 ${getStatus(project.status)}`}>
                                <Link href={`/project/${project.id}`} title={`${getTitleStatus(project.status)}\n${project.name}`}>
                                    <Image src={project.image} alt="" width={300} height={300} className="object-cover rounded-t-lg mx-auto w-full"/>
                                    <div className="m-2 break-words">
                                        <h1 className="text-center text-2xl break-words">{project.name}</h1>
                                        <p className="line-clamp-5 mt-2 text-lg break-words">{project.description}</p>
                                        <p className="italic font-light mt-8 p-2 text-sm">
                                            {leaderUser ? (leaderUser.email) : ('unknown')}
                                        </p>
                                    </div>
                                </Link>
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
        const url_project = 'http://localhost:3000/projects/';
        const url_users = 'http://localhost:3000/users/';
        const ProjectRes = await fetch(url_project, { method: 'GET' });
        const UsersRes = await fetch(url_users, { method: 'GET' });
        
        if (!ProjectRes.ok) {
            toast.error('Failed to fetch projects');
            throw new Error('Failed to fetch projects');
        }
        if (!UsersRes.ok) {
            toast.error('Failed to fetch users');
            throw new Error('Failed to fetch users');
        }
        const projects: Project[] = await ProjectRes.json();
        const users: User[] = await UsersRes.json();
        return {
            props: { projects: projects || [], users: users || [] }
        };
    } catch (error) {
        toast.error('Error fetching data');
        return {
            redirect: {
                destination: '/error',
                permanent: false,
            },
            props: { projects: [], users: [] }
        };
    }
};

export default Project;
