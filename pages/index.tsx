import { useEffect, useState } from 'react';

type Props = { imageUrl: string; nameLength: number; id: number };

async function isCorrectAnswer(name: string, id: number) {
  const res = await fetch(`/api/check-answer?id=${id}&name=${name}`).then(
    (res) => res.json(),
  );
  return { isCorrect: res.isCorrect, correctName: res.correctName };
}

async function getPokemonName(id: number) {
  const res = await fetch(`/api/name?id=${id}`).then((res) => res.json());
  return res.name;
}

export default function Home({ imageUrl, nameLength, id }: Props) {
  const [blurDegree, setBlurDegree] = useState(200);
  const [guessedWord, setGuessedWord] = useState(Array(nameLength).fill(''));
  const [pokemonsName, setPokemonsName] = useState('Guess that POKEMON!');

  const charArray = Array(nameLength).fill('');

  useEffect(() => {
    async function revealPokemon() {
      const name = await getPokemonName(id);
      setPokemonsName(`It's ${name.toUpperCase()}`);
    }

    if (blurDegree <= 50) {
      revealPokemon();
    }
  });

  async function onSubmit(e) {
    e.preventDefault();
    const word = guessedWord.join('');
    const res = await isCorrectAnswer(word, id);
    if (res.isCorrect) {
      setBlurDegree(0);
      setPokemonsName(`It's ${res.correctName.toUpperCase()}!`);
    } else {
      setBlurDegree((prev) => prev - 50);
    }
  }

  function handleChange(event, i: number) {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);
    if (event.target.value !== '') {
      form.elements[index + 1].focus();
    } else if (index !== 0) {
      form.elements[index - 1].focus();
    }
    const newArr = [...guessedWord];
    newArr[i] = event.target.value;
    setGuessedWord(newArr);
  }

  return (
    <div className={'mt-20 grid grid-cols-4'}>
      <div className={'col-span-2 col-start-2 flex flex-col'}>
        <p className={'text text-center text-5xl text-blue-700'}>
          {pokemonsName}
        </p>
        <form onSubmit={onSubmit}>
          <div className={'mt-20 flex flex-row justify-around'}>
            {charArray.map((c, i) => (
              <input
                tabIndex={i + 1}
                className={`h-12 w-14 bg-blue-200 text-5xl`}
                key={i}
                maxLength={1}
                value={guessedWord[i].value}
                onChange={(e) => handleChange(e, i)}
              />
            ))}
          </div>
          <button type={'submit'} tabIndex={99}>
            Submit
          </button>
        </form>
        <img src={imageUrl} className={`scale-50 blur-[${blurDegree}px]`} />
      </div>
    </div>
  );
}

export async function getStaticProps({ params }): Promise<{
  props: Props;
}> {
  const pokemonList = await fetch(
    'https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0',
  ).then((res) => res.json());

  const randomNumber = Math.floor(Math.random() * 150) + 1;
  const pokemonUrl = pokemonList.results[randomNumber];

  const pokemon = await fetch(pokemonUrl.url).then((res) => res.json());

  const imageUrl: string =
    pokemon.sprites.other['official-artwork'].front_default;

  return {
    props: {
      imageUrl,
      nameLength: pokemon.name.length,
      id: pokemon.id,
    },
  };
}
