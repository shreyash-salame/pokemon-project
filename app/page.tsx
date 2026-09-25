import PokemonList from "./components/PokemonList";

type Pokemon = {
  name: string;
  url: string;
};

type PokemonResponse = {
  results: Pokemon[];
};

async function getPokemon(): Promise<Pokemon[]> {
  // cache the list for 1 hour, the data almost never changes
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000", {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon");
  }

  const data: PokemonResponse = await response.json();

  return data.results;
}

export default async function Home() {
  const pokemon = await getPokemon();

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <section className="bg-linear-to-b from-red-600 to-red-500 px-6 pb-16 pt-14 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Pokemon Cards
        </h1>
        <p className="mx-auto mt-3 max-w-md text-red-100">
          Browse {pokemon.length} Pokemon, search by name and check their stats.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <PokemonList pokemon={pokemon} />
      </div>
    </main>
  );
}

