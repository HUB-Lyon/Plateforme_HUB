import { GetServerSideProps } from 'next';
import Link from 'next/link';

const Project: React.FC<{ projects: string[] }> = ({ projects }) => {
  return (
    <>
      <h1>Project</h1>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>{project}</li>
        ))}
      </ul>
      <Link href="/create-project">
        Create Project
      </Link>
    </>
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
