import Head from 'next/head';
import Home from './home';

const Index: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Site Hub</title>
        <link rel="icon" type="image/vnd.icon" href="/image/epitech_logo.ico" />
      </Head>
      <Home />
    </div>
  );
};

export default Index;
