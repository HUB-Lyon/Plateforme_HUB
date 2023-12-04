import React from 'react';
import { GetServerSideProps } from 'next';

const Project: React.FC<{ projects: string[] }> = ({ projects }) => {
    return (
        <div className="gb-red-600 dark:gb-grey-500">
            <h1>Project</h1>
            <ul>
                {projects.map((project, index) => (
                    <li key={index}>{project}</li>
                ))}
            </ul>
        </div>
    );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async () => {
    const projects: string[] = [];
    return {
        props: {
            projects,
        },
    };
};
