import { NextApiRequest, NextApiResponse } from 'next';

type Data = { name: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (!req.query.id) {
    res.status(400).end();
    return;
  }

  const { id } = req.query;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(
        `Error with status: ${response.status.toString()} and status text ${
          response.statusText
        }`,
      );
    }

    const pokemon = await response.json();
    const pokemonName = pokemon.name.split('-')[0];
    res.status(200).json({ name: pokemonName });
  } catch (e) {
    console.log('Error', e);
    throw e;
  }
}
