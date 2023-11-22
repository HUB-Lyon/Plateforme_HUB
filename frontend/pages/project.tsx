import { GetServerSideProps } from 'next';

const Project: React.FC<{ projects: string[] }> = ({ projects }) => {
  return (
    <>
      <h1>Project</h1>
      <p>{projects}</p>
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
