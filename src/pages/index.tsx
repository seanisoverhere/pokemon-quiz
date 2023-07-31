import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import type { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";

const btn =
  "inline-flex items-center px-4 py-1 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  console.log("hello world");

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

  const voteMutation = trpc.useMutation(["vote-for-pokemon"]);

  const voteForHeaviest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    // fire mutation to persist changes
    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center">
      <Head>
        <title>Pokemon Quiz</title>
        <meta name="description" content="Pokemon Quiz App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-2xl text-center pt-8">Which Pokémon is Heavier?</div>
      {dataLoaded && (
        <div className="border rounded mt-6 p-8 flex justify-between items-center max-w-2xl">
          <PokemonListing
            pokemon={firstPokemon.data}
            vote={() => voteForHeaviest(first)}
          />
          <div className="p-8">VS</div>
          <PokemonListing
            pokemon={secondPokemon.data}
            vote={() => voteForHeaviest(second)}
          />
        </div>
      )}
      {!dataLoaded && <img src="/svg-loader.svg" className="w-48" />}
      <div className="w-full text-xl text-center pb-2">
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={props.pokemon.spriteUrl!}
        width={256}
        height={256}
        className="w-64 h-64"
        layout="fixed"
        priority={true}
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Heavier
      </button>
    </div>
  );
};
