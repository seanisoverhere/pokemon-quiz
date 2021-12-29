import type { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/utils/inferType";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VotesAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const countPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VotesAgainst } = pokemon._count;
  if (VoteFor + VotesAgainst === 0) return 0;
  return (VoteFor / (VoteFor + VotesAgainst)) * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border-b p-4 items-center justify-between">
      <div className="flex items-center">
        <Image src={pokemon.spriteUrl} width={32} height={32} layout="fixed" />
        <div className="capitalize pl-3">{pokemon.name}</div>
      </div>
      <div>{countPercent(pokemon).toFixed(2) + "%"}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Result</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((currentPokemon, index) => {
          return <PokemonListing key={index} pokemon={currentPokemon} />;
        })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return {
    props: {
      pokemon: pokemonOrdered,
    },
    revalidate: 60,
  };
};
