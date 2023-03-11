import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

function Pokemon() {
  const [pokemon, setPokemon] = useState<any[]>([]);

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get<any>(
          `https://pokeapi.co/api/v2/pokemon/?name=${search}`
        );
        setPokemon(response.data.results);
        setSearch(search);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPokemon();
  }, [search]);

  const pokeList = pokemon.filter((poke)=> {
    const name = poke.name.toLowerCase();
    const searchText = search.toLowerCase();
    return searchText && name.startsWith(searchText);
  }).map((poke) => <div onClick={(e: React.MouseEvent<HTMLDivElement>) => setSearch(poke.name)}  className="pokemon-wrapper">{poke.name}</div>);


  function handleChange(e: any) {
    e.preventDefault();
    setSearch(e.target.value);
  }

  console.log(pokemon);

  return (
    <>
      <form>
        <input
          type="text"
          id="search"
          placeholder="Search"
          onChange={handleChange}
          value={search || ""}
        />
        <button onClick={() => setSearch(search)} type="submit">Search</button>
        {/* {Need the button to pull the info of the pokemon selected from its url. Need 2nd fetch function fetchPokemonData} */}
        {pokemon.filter((data)=> {
          const url = data.url;
          return url;
        }).map((data) => <div>{data.url}</div>)}
      </form>
      {pokeList}
    </>
  );
}

export default Pokemon;
