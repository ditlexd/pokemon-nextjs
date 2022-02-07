// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  isCorrect: boolean;
  correctName: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { id, name } = req.query;
  if (typeof name !== 'string') {
    res.status(400).end();
    return;
  }

  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (res) => res.json(),
  );

  const pokemonName = pokemon.name.split('-')[0];
  const isCorrect = name.toLowerCase() === pokemon.name.toLowerCase();
  res
    .status(200)
    .json({ isCorrect, correctName: isCorrect ? pokemonName : null });
}
