import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

type Pokemon = {
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
};
export async function generateStaticParams() {
  return Array.from({ length: 151 }, (_, i) => ({ id: String(i + 1) }));
}

async function getPokemon(id: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    notFound();
  }

  return response.json();
}

export default async function PokemonDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemon = await getPokemon(id);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          ← Back to Pokemon
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="text-center">
            <Image
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              width={256}
              height={256}
              priority
              className="mx-auto h-64 w-64 object-contain"
            />

            <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>

            <p className="mt-2 text-gray-500">#{id}</p>
          </div>
          
          <div className="mt-8">
            <h2 className="mb-3 text-2xl font-bold">Types</h2>

            <div className="flex gap-3">
              {pokemon.types.map((item) => (
                <span
                  key={item.type.name}
                  className="rounded-full bg-blue-100 px-4 py-2 capitalize text-blue-700"
                >
                  {item.type.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="mb-3 text-2xl font-bold">Abilities</h2>

            <ul className="list-inside list-disc">
              {pokemon.abilities.map((item) => (
                <li key={item.ability.name} className="capitalize">
                  {item.ability.name}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Stats</h2>

            <div className="space-y-4">
              {pokemon.stats.map((item) => {
                const percentage = Math.min((item.base_stat / 255) * 100, 100);

                let barColor = "bg-red-500";

                if (item.base_stat >= 100) {
                  barColor = "bg-green-500";
                } else if (item.base_stat >= 50) {
                  barColor = "bg-yellow-500";
                }

                return (
                  <div key={item.stat.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {item.stat.name}
                      </span>

                      <span className="font-bold">{item.base_stat}</span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-3 rounded-full ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="mb-3 text-2xl font-bold">Moves</h2>

            <div className="flex flex-wrap gap-2">
              {pokemon.moves.slice(0, 20).map((item) => (
                <span
                  key={item.move.name}
                  className="rounded-md bg-gray-200 px-3 py-1 text-sm capitalize"
                >
                  {item.move.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
