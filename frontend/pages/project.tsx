import { GetServerSideProps } from 'next';

const Project: React.FC<{ data: string }> = ({ data }) => {
  return (
    <div>
      <h1>Project</h1>
      <p>{data}</p>
    </div>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async () => {
  const data = 'Données côté serveur';
  return {
    props: {
      data,
    },
  };
};
