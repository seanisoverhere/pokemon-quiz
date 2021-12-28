import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Head>
        <title>Pokemon Quiz</title>
        <meta name="description" content="Pokemon Quiz App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-2xl text-center">Which Pokémon is Heavier?</div>
      <div className="border rounded mt-6 p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16 bg-red-200"></div>
        <div className="p-8">VS</div>
        <div className="w-16 h-16 bg-red-200"></div>
      </div>
    </div>
  );
};

export default Home;
