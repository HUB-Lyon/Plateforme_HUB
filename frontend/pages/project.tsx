import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useMsal } from '@azure/msal-react';
import { Project, User } from '../model';
import { API_URL } from './../config';

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

    const { accounts } = useMsal();
    const account = accounts[0];
    const [username, setUsername] = useState('');
    useEffect(() => {
        if (account) {
            console.log('User ID:', account.localAccountId);
            setUsername(account.username);
        }
    }, [account]);

    const userEmail = username;

    const router = useRouter();

    const [showAllProjects, setShowAllProjects] = useState<boolean>(false);

    if (projects.length === 0) {
        return (
            <div className="flex h-auto p-2 m-4 max-w-screen break-words">
                <h1 className="p-2 text-5xl text-slate-900">No Projects Available</h1>
                <button className="p-2 bg-blue-500 text-white p-2 rounded-lg m-2 mb-4 transition ease-in-out delay-100 hover:scale-105 duration-250"
                    onClick={() => router.push('/create-project')}>
                    Create Project
                </button>
            </div>
        );
    }

    const getFilteredProjects = (): Project[] => {
        return projects.filter((project) => {
            const leaderUser = getUserInfo(project.leaderId);

            const isUserProject = !showAllProjects && leaderUser && leaderUser.email === userEmail;

            const isMemberOfProject = project.membersIds.some(memberId => {
                const memberUser = getUserInfo(memberId);
                return memberUser && memberUser.email === userEmail;
            });

            return showAllProjects || isUserProject || isMemberOfProject;
        });
    };

    const filteredProjects = getFilteredProjects();

    const buttonProject = 'p-2 m-2 mb-4 bg-blue-500 text-white transition ease-in-out delay-100 hover:scale-105 duration-250';

    return (
        <div className="h-auto p-2 m-4 mb-6 max-w-screen break-words">
            <div className="p-2 mb-4 flex items-center justify-between flex-wrap">
                <h1 className="text-5xl text-slate-900">Projects</h1>
                <div className="flex">
                    <button className={`rounded-lg ${buttonProject}`}
                        onClick={() => router.push('/create-project')}>
                        Create Project
                    </button>
                    <button
                        className={`rounded-l-lg mr-0 ${buttonProject} ${showAllProjects ? '' : 'scale-105 border-2 border-slate-700 cursor-not-allowed'}`}
                        onClick={() => setShowAllProjects(!showAllProjects)}
                        disabled={!showAllProjects}
                    >
                        Your Projects
                    </button>
                    <button
                        className={`rounded-r-lg ml-0 ${buttonProject} ${!showAllProjects ? '' : 'scale-105 border-2 border-slate-700 cursor-not-allowed'}`}
                        onClick={() => setShowAllProjects(!showAllProjects)}
                        disabled={showAllProjects}
                    >
                        All Projects
                    </button>
                </div>
            </div>
            <ul className="gap-8 max-w-screen md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProjects.map((project: Project) => {
                    const leaderUser = getUserInfo(project.leaderId);
                    return (
                        <li key={project.id} className={`m-2 hover:filter hover:contrast-125 flex flex-col justify-between relative rounded-xl bg-white text-black shadow-xl transition ease-in-out delay-100 hover:scale-105 duration-250 border-b-8 ${getStatus(project.status)}`}>
                            <Link href={`/project/${project.id}`} title={`${getTitleStatus(project.status)}\n${project.name}`}>  
                                <Image src={project.image || '/image/default_project.jpg'} alt={`Image for ${project.name}`} width={300} height={300} className="object-cover rounded-t-lg mx-auto w-full"/>
                                <h2 className="m-2 text-center text-2xl break-words">{project.name}</h2>
                                <p className="m-2 line-clamp-5 mt-2 text-lg break-words">{project.description}</p>
                                <p className="m-2 italic font-light mt-8 p-2 text-sm">
                                    {leaderUser ? (leaderUser.email) : ('unknown')}
                                </p>                
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const url_project = `${API_URL}/projects/`;
        const url_users = `${API_URL}/users/`;
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
