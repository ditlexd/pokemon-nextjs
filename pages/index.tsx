import { useEffect, useRef, useState } from 'react';
import { checkAnswer, getName } from '../lib/APIClient';

type Props = { imageUrl: string; nameLength: number; id: number };

async function isCorrectAnswer(name: string, id: number) {
  const res = await checkAnswer(id, name);
  return { isCorrect: res.isCorrect, correctName: res.correctName };
}

async function getPokemonName(id: number) {
  const res = await getName(id);
  return res.name;
}

export default function Home({ imageUrl, nameLength, id }: Props) {
  const [brightness, setBrightness] = useState(0);
  const [guessedWord, setGuessedWord] = useState(Array(nameLength).fill(''));
  const [pokemonsName, setPokemonsName] = useState('Guess that POKEMON!');
  const textInput = useRef(null);

  useEffect(() => {
    async function revealPokemon() {
      const name = await getPokemonName(id);
      setPokemonsName(`It's ${name.toUpperCase()}`);
    }

    if (brightness == 1) {
      revealPokemon();
    }
  }, [brightness]);

  async function onSubmit(e) {
    e.preventDefault();
    const word = guessedWord.join('');
    const res = await isCorrectAnswer(word, id);
    if (res.isCorrect) {
      setBrightness(1);
      setPokemonsName(`It's ${res.correctName.toUpperCase()}!`);
    } else {
      setGuessedWord(Array(nameLength).fill(''));
      textInput.current.focus();
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
        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col items-center gap-5">
          <div className={'mt-20 flex w-full flex-row justify-around'}>
            {guessedWord.map((c, i) => (
              <input
                ref={i === 0 ? textInput : undefined}
                tabIndex={i + 1}
                className={`h-12 w-14 bg-blue-200 text-5xl`}
                key={i}
                maxLength={1}
                value={guessedWord[i]}
                onChange={(e) => handleChange(e, i)}
              />
            ))}
          </div>
          <button type="submit" tabIndex={99}>
            <img
              className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              width="100"
              alt="Poké Ball icon"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.svg.png"
            />
          </button>
        </form>
        <img
          src={imageUrl}
          className={`scale-50`}
          style={{ filter: `brightness(${brightness})` }}
        />
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
