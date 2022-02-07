import { GetStaticPaths } from 'next';

type Props = { imageUrl: string; name: string };

export default function Home({ imageUrl, name }: Props) {
  return (
    <div className={'grid grid-cols-4'}>
      <div className={'col-span-2 col-start-2 flex flex-col justify-between'}>
        <p className={'text-center text-5xl text-green-900'}>{name}</p>
        <img src={imageUrl} className={'scale-50'} />
      </div>
    </div>
  );
}

export async function getStaticProps({ params }): Promise<{
  props: Props;
}> {
  console.log(params);
  const pokemon = await fetch(
    'https://pokeapi.co/api/v2/pokemon/' + params.id,
  ).then((res) => res.json());
  console.log(pokemon);
  const imageUrl: string =
    pokemon.sprites.other['official-artwork'].front_default;

  return { props: { imageUrl, name: pokemon.name } };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
