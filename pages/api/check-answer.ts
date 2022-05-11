// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export type CheckAnswerResponse = {
  isCorrect: boolean;
  correctName: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckAnswerResponse>,
) {
  if (!req.query.id || (!req.query.name && req.query.name !== '')) {
    console.log(
      `Missing query field name: ${req.query.name} or id: ${req.query.id} `,
    );
    res.status(400).end();
    return;
  }

  const { id, name } = req.query;
  if (typeof name !== 'string') {
    console.log('Query field name is not a string');
    res.status(400).end();
    return;
  }

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (!response.ok) {
    console.log(
      `Error with status: ${response.status.toString()} and status text ${
        response.statusText
      }`,
    );
    throw new Error();
  }

  try {
    const pokemon = await response.json();
    const pokemonName = pokemon.name.split('-')[0];
    const isCorrect = name.toLowerCase() === pokemon.name.toLowerCase();
    res
      .status(200)
      .json({ isCorrect, correctName: isCorrect ? pokemonName : null });
  } catch (e) {
    console.log('Error', e);
    throw e;
  }
}
