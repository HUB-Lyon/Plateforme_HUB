import React from 'react';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { format } from 'date-fns';
import { getTitleStatus, getStatus } from '../project';
import { Project, User } from '../../model';

const ProjectDetails: React.FC<{ project: Project; users: User[] | undefined }> = ({ project, users }) => {
    const getEmail = (member: number): string => {
        const member_user = users?.find(user => user.id === member);
        return member_user ? member_user.email : 'Member not found';
    };
    const formatDate = (inputDate: string): string => {
        const date = new Date(inputDate);
        return format(date, 'dd MM yyyy');
    };
    return (
        <div className="bg-white m-8 p-4">
            <div className="h-auto p-2 m-4 max-w-screen break-words gap-6 max-w-screen md:grid md:grid-cols-2">
                <div>
                    <h1 className="text-5xl m-8 text-slate-900">{project.name}</h1>
                    <h1 className="text-2xl text-slate-900">{formatDate(project.created_at)}</h1>
                </div>
                <Image src={project.image} alt={project.name} width={300} height={300} className="object-cover rounded-lg mr-4"></Image>
            </div>
            <p className="mt-2 text-2xl break-words pb-4 ml-4">{project.description}</p>
            <div className="h-auto p-2 m-4 max-w-screen break-words gap-6 max-w-screen md:grid md:grid-cols-2">
                <ul className="list-disc">
                    <h3 className="ml-4">Members:</h3>
                    {project.members_id.map((member: number, idx: number) => (
                        <li key={idx} className="ml-8">
                            <p className="italic font-light text-lg break-words">{getEmail(member)}</p>
                        </li>
                    ))}
                </ul>
                <div title={getTitleStatus(project.status)} className={`rounded-full text-center inline-block align-middle ${getStatus(project.status)} h-10 md:h-12 lg:h-16 mb-0`}></div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const projectId = params?.id as string;
    try {
        const projectRes = await fetch(`http://localhost:3000/projects/${projectId}`, { method: 'GET' });
        const usersRes = await fetch('http://localhost:3000/users/', { method: 'GET' });
        
        if (!projectRes.ok || !usersRes.ok) {
            throw new Error('Failed to fetch project or users');
        }

        const project: Project = await projectRes.json();
        const users: User[] = await usersRes.json();
        return {
            props: { project, users },
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            notFound: true,
        };
    }
};

export default ProjectDetails;
