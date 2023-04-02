import React, { useEffect, useState } from "react"
import { allPokemon } from "../pokemon/allpoke"

enum Types {
    Bug,
    Dark,
    Dragon,
    Electric,
    Fairy,
    Fighting,
    Fire,
    Flying,
    Ghost,
    Grass,
    Ground,
    Ice,
    Normal,
    Poison,
    Psychic,
    Rock,
    Steel,
    Water
}

export const TypeEffectiveness = () => {

    // 2 array is for moves that are 2 effective against listed type
    // 0.5 is for moves that aren't very effective against listed type
    // 0 is for moves that have no effect against listed type
    const EffectivenessTable = {
        [Types.Bug]: {
            2: [Types.Fire, Types.Flying, Types.Rock],
            0.5: [Types.Fighting, Types.Grass, Types.Ground]
        },
        [Types.Dark]: {
            2: [Types.Bug, Types.Fairy, Types.Fighting],
            0.5: [Types.Ghost, Types.Dark],
            0: [Types.Psychic]
        },
        [Types.Dragon]: {
            2: [Types.Dragon, Types.Fairy, Types.Ice],
            0.5: [Types.Fire, Types.Grass, Types.Electric, Types.Water]
        },
        [Types.Electric]: {
            2: [Types.Ground],
            0.5: [Types.Electric, Types.Flying, Types.Steel]
        },
        [Types.Fairy]: {
            2: [Types.Poison, Types.Steel],
            0.5: [Types.Bug, Types.Dark, Types.Fighting],
            0: [Types.Dragon]
        },
        [Types.Fighting]: {
            2: [Types.Fairy, Types.Flying, Types.Psychic],
            0.5: [Types.Bug, Types.Dark, Types.Rock]
        },
        [Types.Fire]: {
            2: [Types.Ground, Types.Rock, Types.Water],
            0.5: [Types.Bug, Types.Fairy, Types.Fire, Types.Grass, Types.Ice, Types.Steel]
        },
        [Types.Flying]: {
            2: [Types.Electric, Types.Ice, Types.Rock],
            0.5: [Types.Bug, Types.Fighting, Types.Grass],
            0: [Types.Ground]
        },
        [Types.Ghost]: {
            2: [Types.Dark, Types.Ghost],
            0.5: [Types.Bug, Types.Poison],
            0: [Types.Fighting, Types.Normal]
        },
        [Types.Grass]: {
            2: [Types.Bug, Types.Fire, Types.Flying, Types.Ice, Types.Poison],
            0.5: [Types.Electric, Types.Grass, Types.Ground, Types.Water]
        },
        [Types.Ground]: {
            2: [Types.Grass, Types.Ice, Types.Water],
            0.5: [Types.Poison, Types.Rock],
            0: [Types.Electric]
        },
        [Types.Ice]: {
            2: [Types.Fighting, Types.Fire, Types.Rock, Types.Steel],
            0.5: [Types.Ice]
        },
        [Types.Normal]: {
            2: [Types.Fighting],
            0: [Types.Ghost]
        },
        [Types.Poison]: {
            2: [Types.Psychic, Types.Ground],
            0.5: [Types.Bug, Types.Grass, Types.Fairy, Types.Fighting, Types.Poison]
        },
        [Types.Psychic]: {
            2: [Types.Bug, Types.Ghost, Types.Dark],
            0.5: [Types.Fighting, Types.Psychic]
        },
        [Types.Rock]: {
            2: [Types.Grass, Types.Ground, Types.Fighting, Types.Steel, Types.Water],
            0.5: [Types.Fire, Types.Flying, Types.Normal, Types.Poison]
        },
        [Types.Steel]: {
            2: [Types.Fighting, Types.Fire, Types.Ground],
            0.5: [Types.Bug, Types.Dragon, Types.Fairy, Types.Flying, Types.Grass, Types.Normal, Types.Ice, Types.Psychic, Types.Rock, Types.Steel]
        },
        [Types.Water]: {
            2: [Types.Grass, Types.Electric],
            0.5: [Types.Fire, Types.Ice, Types.Steel, Types.Water]
        }
    }

    const [selectedPokemonAttempt, setSelectedPokemonAttempt] = useState("")
    const [selectedPokemon, setSelectedPokemon] = useState("")
    const [enemyPokemonType, setEnemyPokemonType] = useState<Types[]>([])

    useEffect(() => {
        if (selectedPokemon) {
            setEnemyPokemonType([])
            fetch("https://pokeapi.co/api/v2/pokemon/" + selectedPokemon, {
                method: "GET"
            })
                .then((response) => response.json())
                .then((data) => {
                    Object.keys(data.types).map((index) => {
                        setEnemyPokemonType((prevArray) => [...prevArray, (data.types[index].type.name).charAt(0).toUpperCase() + (data.types[index].type.name).slice(1)])
                    })
                })
        }
    }, [selectedPokemon])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget

        setSelectedPokemonAttempt(value)
    }

    const handlePokemonFind = () => {
        const pokemon = selectedPokemonAttempt.toLowerCase()

        if (allPokemon.includes(pokemon)) {
            setSelectedPokemon(pokemon)
            return
        }
        console.log('Pokemon not found')
    }

    return (
        <div className="container text-center">
            <div className="row pt-5">
                <div className="col">
                    <select>
                        {Object.keys(EffectivenessTable).map((type, index) => {
                            return (
                                <option value={Types[index]} key={type}>{Types[index]}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <div className="row pt-3">
                <div className="col">
                    <input onChange={handleInputChange} />
                </div>
                <div className="col">
                    <button className="btn btn-warning" onClick={handlePokemonFind}>Select</button>
                </div>
            </div>
            <div className="row pt-2">
                <div className="col">
                    {selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1)}
                </div>
            </div>
            <div className="row pt-2 justify-content-center">
                {enemyPokemonType && enemyPokemonType.map((type, index) => {
                    return (
                        <div className="col-2" key={index}>
                            {type}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}