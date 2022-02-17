import { NextApiRequest, NextApiResponse } from 'next';

type Data = { name: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { id } = req.query;

  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (res) => res.json(),
  );

  const pokemonName = pokemon.name.split('-')[0];
  res.status(200).json({ name: pokemonName });
}
