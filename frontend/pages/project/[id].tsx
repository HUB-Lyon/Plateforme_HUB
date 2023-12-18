import React from 'react';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { format } from 'date-fns';
import { getStatus } from '../project';
import { Project, User } from '../../model';
import { API_URL } from './../../config';

const ProjectDetails: React.FC<{ project: Project; users: User[] | undefined }> = ({ project, users }) => {
    const getEmail = (member: number): string => {
        const member_user = users?.find(user => user.id === member);
        return member_user ? member_user.email : 'Member not found';
    };
    const formatDate = (inputDate: string): string => {
        const date = new Date(inputDate);
        return format(date, 'dd MM yyyy');
    };
    const manyMembers = (): boolean => {
        return project.membersIds.length > 1;
    };

    return (
        <div className={`bg-white m-8 p-4 rounded-lg border-b-8 ${getStatus(project.status)}`}>
            <div className="h-auto m-2 max-w-screen break-words max-w-screen md:grid md:grid-cols-3">
                <Image src={project.image} alt={project.name} width={500} height={500} className="object-cover rounded-lg mr-4"></Image>
                <div className="col-span-2">
                    <h1 className="text-xl md:text-5xl m-4 text-slate-900">{project.name}</h1>
                    <h1 className="text-lg md:text-2xl m-2 text-slate-900">{formatDate(project.createdAt)}</h1>
                </div>
            </div>
            <div className="h-auto m-2 max-w-screen break-words max-w-screen lg:grid lg:grid-cols-3">
                <div className="col-span-2 lg:border-r-2 lg:broder-black">
                    <p className="text-lg md:text-2xl break-words m-2">{project.description}</p>
                </div>
                <ul className={`list-inside ${manyMembers() ? 'list-short-dash' : 'list-none'}`}>
                    <h3 className="ml-4 italic font-light text-lg md:text-xl">{manyMembers() ? 'Members:' : 'Member:'}</h3>
                    {project.membersIds.map((member: number, idx: number) => (
                        <li key={idx} className="ml-2 italic font-light text-lg md:text-xl break-words">
                            {getEmail(member)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const projectId = params?.id as string;
    try {
        const url_project = `${API_URL}/projects/${projectId}`;
        const url_users = `${API_URL}/users/`;
        const projectRes = await fetch(url_project, { method: 'GET' });
        const usersRes = await fetch(url_users, { method: 'GET' });
        
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