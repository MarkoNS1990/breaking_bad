import axios from "axios";
import Image from "next/image";
import { BackspaceIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

const CharacterDetails = ({
  character,
  causeOfDeath,
  deathsCaused,
  randomQuote,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl font-semibold mb-3">
        {character[0].name}({character[0].nickname})
      </h2>
      <Image src={character[0].img} height={600} width={400} />
      <div className="flex flex-col justify-between items-center bg-gray-200 w-[400px] font-semibold space-y-3 p-3">
        <p>Actor: {character[0].portrayed}</p>
        <p>Birthday: {character[0].birthday}</p>
        <p>Status: {character[0].status}</p>
        {causeOfDeath.length > 0 ? (
          <p className="max-w-[200px]">
            Cause of Death: {causeOfDeath[0].cause}
          </p>
        ) : null}
        {deathsCaused.length > 0 && (
          <p>Deaths caused: {deathsCaused[0].deathCount}</p>
        )}
        {randomQuote.length > 0 && (
          <p className="max-w-[200px] font-medium">
            Random Quote: &quot;{randomQuote[0].quote}&quot;
          </p>
        )}
      </div>
      <Link href="/">
        <div className="flex justify-between w-[100px] items-center text-red-300 cursor-pointer">
          <BackspaceIcon />
        </div>
      </Link>
    </div>
  );
};

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  const character = await axios
    .get(`https://www.breakingbadapi.com/api/characters/${id}`)
    .then((res) => res.data);

  const causeOfDeath = await axios
    .get(`https://www.breakingbadapi.com/api/death?name=${character[0].name}`)
    .then((res) => res.data);

  const name = character[0].name.split(" ").join("+");

  const deathsCaused = await axios
    .get(`https://www.breakingbadapi.com/api/death-count?name=${name}`)
    .then((res) => res.data);
  console.log(deathsCaused);

  const randomQuote = await axios
    .get(`https://www.breakingbadapi.com/api/quote/random?author=${name}`)
    .then((res) => res.data);
  console.log(randomQuote);

  return {
    props: {
      character,
      causeOfDeath,
      deathsCaused,
      randomQuote,
    },
  };
};

export const getStaticPaths = async () => {
  const characters = await axios
    .get(`https://www.breakingbadapi.com/api/characters/`)
    .then((res) => res.data);
  const paths = characters.map((character) => {
    return { params: { id: `${character.char_id}` } };
  });

  return {
    paths,
    fallback: false,
  };
};

export default CharacterDetails;
