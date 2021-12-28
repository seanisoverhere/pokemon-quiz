import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";

const Home: NextPage = () => {
  const [ids, updateids] = useState(getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: first,
    },
  ]);

  const secondPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: second,
    },
  ]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Head>
        <title>Pokemon Quiz</title>
        <meta name="description" content="Pokemon Quiz App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-2xl text-center">Which Pokémon is Heavier?</div>
      <div className="border rounded mt-6 p-8 flex justify-between items-center max-w-2xl">
        <div className="w-64 h-64 flex flex-col">
          <img src={firstPokemon.data?.sprites.front_default!} className="w-full" />
          <div className="text-xl text-center capitalize mt-[-2rem]">{firstPokemon.data?.name}</div>
        </div>
        <div className="p-8">VS</div>
        <div className="w-64 h-64 flex flex-col">
          <img src={secondPokemon.data?.sprites.front_default!} className="w-full" />
          <div className="text-xl text-center capitalize mt-[-2rem]">{secondPokemon.data?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
