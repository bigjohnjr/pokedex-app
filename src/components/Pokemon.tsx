import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./pokemon.css";

interface PokemonType {
  name: string;
  url: string;
}

interface Pokemon {
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

function Pokemon() {
  const [capturedPokemon, setCapturedPokemon] = useState<string[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [pokemon, setPokemon] = useState<PokemonType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [dropdownClicked, setDropdownClicked] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get<any>(
          `https://pokeapi.co/api/v2/pokemon/?name=${search}`
        );
        setPokemon(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPokemon();
  }, [search]);

  useEffect(() => {
    const fetchSelectedPokemon = async () => {
      try {
        if (!dropdownClicked) {
          return;
        }
        const response = await axios.get<Pokemon>(
          `https://pokeapi.co/api/v2/pokemon/${search}`
        );
        setSelectedPokemon(response.data);
        // console.log("fetchedSelectedPokemon", response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSelectedPokemon();
  }, [search, dropdownClicked]);

  const pokeList = pokemon
    .filter((poke) => {
      const name = poke.name.toLowerCase();
      const searchText = search.toLowerCase();
      return searchText && name.startsWith(searchText);
    })
    .map((poke) => (
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          setSearch(poke.name);
          setDropdownClicked(true);
        }}
        className="dropdown-option"
      >
        {poke.name}
      </div>
    ));

  function handleChange(e: any) {
    setSearch(e.target.value);
    setDropdownClicked(false);
  }

  function handleCapture(e: any) {
    e.preventDefault();
    if (selectedPokemon) {
      const spriteUrl = selectedPokemon?.sprites.front_default;
      console.log("Selected Pokemon:", selectedPokemon);
      console.log("Sprite URL:", spriteUrl);
      setCapturedPokemon((prevCapturedPokemonList) => [
        ...prevCapturedPokemonList,
        spriteUrl,
      ]);
      console.log("Captured Pokemon:", capturedPokemon);
    }
  }

  return (
    <>
      <div className="left-box">
        <input
          type="text"
          id="search"
          placeholder="Search"
          onChange={handleChange}
          value={search || ""}
        />
        <div className="dropdown">{pokeList}</div>

        {selectedPokemon && (
          <>
            <div className="pokemon-type">
              <img src={selectedPokemon.sprites.front_default} />
              <div>
                <h2>
                  {selectedPokemon.name.charAt(0).toUpperCase() +
                    selectedPokemon.name.slice(1)}
                </h2>
                <div className="type">{selectedPokemon.types[0].type.name}</div>
              </div>
            </div>
            <ul className="stats-wrapper">
              {selectedPokemon.stats.map((stat) => (
                <li key={stat.stat.name}>
                  {stat.stat.name.toUpperCase()} <span>{stat.base_stat}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {dropdownClicked && (
          <button className="capture-btn" onClick={handleCapture}>
            Capture
          </button>
        )}
      </div>
      <div className="right-box">
        {capturedPokemon.map((spriteUrl) => (
          <img src={spriteUrl} />
        ))}
      </div>
    </>
  );
}

export default Pokemon;
