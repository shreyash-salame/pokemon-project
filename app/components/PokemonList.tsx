"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Pokemon = {
  name: string;
  url: string;
};

type PokemonListProps = {
  pokemon: Pokemon[];
};

const ItemsPerPAGE = 20;

function getPokemonId(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 2];
}

export default function PokemonList({ pokemon }: PokemonListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredPokemon = pokemon.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages =Math.ceil(filteredPokemon.length/ItemsPerPAGE);
  const startIndex =(page - 1) *ItemsPerPAGE;
  const currentPokemon = filteredPokemon.slice(
    startIndex,
    startIndex + ItemsPerPAGE,
  );

  
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);
  const pageNumbers: number[] = [];
  for (let i = firstPage; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  function changePage(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1); 
  }

  return (
    <>
      <div className="relative z-10 -mt-7 mb-8">
        <input
          type="text"
          placeholder="Search Pokemon by name..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-full border border-gray-200 bg-white px-6 py-4 shadow-lg outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
        />
      </div>

      {filteredPokemon.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No Pokemon found for
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {currentPokemon.map((item) => {
              const id = getPokemonId(item.url);

              return (
                <Link
                  href={`/pokemon/${id}`}
                  key={item.name}
                  className="group rounded-2xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="rounded-xl bg-gray-100 py-3 transition group-hover:bg-red-50">
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                      alt={item.name}
                      width={160}
                      height={160}
                      className="mx-auto h-32 w-32 object-contain"
                    />
                  </div>

                  <p className="mt-3 text-xs font-medium text-gray-400">
                    #{id.padStart(4, "0")}
                  </p>

                  <h2 className="text-lg font-semibold capitalize">
                    {item.name}
                  </h2>
                </Link>
              );
            })}
          </div>

          //Pagination 
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => changePage(number)}
                className={`h-10 w-10 rounded-lg text-sm font-medium ${
                  number === page
                    ? "bg-red-600 text-white"
                    : "border border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <p className="mt-3 text-center text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
        </>
      )}
    </>
  );
}
