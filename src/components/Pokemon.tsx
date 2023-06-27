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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCapturedPokemon = capturedPokemon.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(capturedPokemon.length / itemsPerPage);

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

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
      setCapturedPokemon((prevCapturedPokemonList) => [
        ...prevCapturedPokemonList,
        spriteUrl,
      ]);
    }
  }

  return (
    <>
      <div className="left-box">
        <h2 className="tooltip-text">Search for a Pokemon</h2>
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
          <>
            <h2 className="tooltip-text">Click button to capture Pokemon</h2>
            <button className="capture-btn" onClick={handleCapture}>
              Capture
            </button>
          </>
        )}
      </div>
      <div className="right-box">
        <h2 className="tooltip-text">Capture List</h2>
        {currentCapturedPokemon.map((spriteUrl) => (
          <img src={spriteUrl} />
        ))}
        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Pokemon;
