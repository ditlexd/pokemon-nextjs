import Head from 'next/head';

type Props = { imageUrl: string; names: [string] };

export default function Home({ imageUrl, names }: Props) {
  return (
    <div className={'border-2 border-solid border-black'}>
      {names.map((name) => {
        return (
          <div key={name}>
            {name}
            <img src={imageUrl} />
          </div>
        );
      })}
    </div>
  );
}

export async function getStaticProps({ params }): Promise<{
  props: Props;
}> {
  console.log(params);
  const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon/5').then(
    (res) => res.json(),
  );
  const imageUrl: string =
    pokemon.sprites.other['official-artwork'].front_default;

  return { props: { imageUrl, names: ['Bulbasaur'] } };
}
