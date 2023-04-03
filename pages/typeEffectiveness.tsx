import React, { useEffect, useState } from "react"
import { allPokemon } from "../pokemon/allpoke"
import { EffectivenessTable, Types } from "../pokemon/moveEffectTable"

type EnemyPokemon = {
    name: string,
    types: Types[],
    sprite: string
}

export const TypeEffectiveness = () => {

    const [selectedPokemonAttempt, setSelectedPokemonAttempt] = useState("")
    const [selectedPokemon, setSelectedPokemon] = useState("")
    const [enemyPokemon, setEnemyPokemon] = useState<EnemyPokemon>({
        name: "",
        types: [],
        sprite: ""
    })
    const [selectedType, setSelectedType] = useState(0)
    const [typeDamage, setTypeDamage] = useState(5)

    useEffect(() => {
        window.addEventListener("keypress", handleEnterPress)

        return () => {
            window.removeEventListener("keypress", handleEnterPress)
        }
    }, [])

    useEffect(() => {
        if (selectedPokemon) {
            fetchPokemonData()
            checkTypeEffectiveness(selectedType)
        }
    }, [selectedPokemon])

    const handleEnterPress = (key: KeyboardEvent) => {
        const selectPokemonButton = document.getElementById('selectPokemon')

        if (key.key === "Enter") {
            selectPokemonButton?.click()
        }
    }

    const fetchPokemonData = () => {
        setEnemyPokemon({
            name: "",
            types: [],
            sprite: ""
        })
        fetch("https://pokeapi.co/api/v2/pokemon/" + selectedPokemon, {
            method: "GET"
        })
            .then((response) => response.json())
            .then((data) => {
                const typesArray: Types[] = []
                Object.keys(data.types).map((index) => {
                    const type = (data.types[index].type.name).charAt(0).toUpperCase() + (data.types[index].type.name).slice(1)
                    typesArray.push(Types[type as keyof typeof Types])
                })
                setEnemyPokemon({
                    name: data.name,
                    types: typesArray,
                    sprite: data.sprites.front_default
                })

            })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, id } = e.currentTarget

        if (id === 'enemyPokemon') {
            setSelectedPokemonAttempt(value)
            return
        }

        if (id === "type") {
            setSelectedType(Number(value))
            checkTypeEffectiveness(Number(value))
            return
        }
    }

    const handlePokemonFind = () => {
        const pokemon = selectedPokemonAttempt.toLowerCase()

        if (allPokemon.includes(pokemon)) {
            setSelectedPokemon(pokemon)
            return
        }
        console.log('Pokemon not found')
    }

    const checkTypeEffectiveness = (typeNum: number) => {
        const moveType = typeNum || selectedType
        const enemyPokemonTypes = enemyPokemon.types
        let damage = 1

        for (let i = 0; i < enemyPokemonTypes.length; i++) {
            const typeIndex = enemyPokemonTypes[i]

            if (0 in EffectivenessTable[typeIndex]) {
                if (EffectivenessTable[typeIndex][0].includes(moveType)) {
                    damage = 0
                }
            }

            if (0.5 in EffectivenessTable[typeIndex]) {
                if (EffectivenessTable[typeIndex][0.5].includes(moveType)) {
                    if (damage === 0) {
                        break
                    }
                    if (damage === .5) {
                        break
                    }
                    damage = damage * .5
                }
            }

            if (EffectivenessTable[typeIndex][2].includes(moveType)) {
                if (damage === 0) {
                    break
                }
                damage = damage * 2
            }
        }
        setTypeDamage(damage)
    }

    return (
        <div className="container text-center">
            <div className="row pt-5 justify-content-center">
                <div className="col-3">
                    <input onChange={handleInputChange} id="enemyPokemon" placeholder="Enter Pokemon" />
                </div>
                <div className="col-2">
                    <button className="btn btn-warning" onClick={handlePokemonFind} id="selectPokemon">Choose</button>
                </div>
            </div>
            <div className="row pt-2 justify-content-center">
                <div className="col">
                    {selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1)}
                </div>
            </div>
            {enemyPokemon.name.length > 0 &&
                <div className="row">
                    <div className="col">
                        <img src={enemyPokemon.sprite} />
                    </div>
                </div>
            }
            <div className="row pt-2 justify-content-center">
                {enemyPokemon && enemyPokemon.types.map((type, index) => {
                    return (
                        <div className="col-2" key={index}>
                            {Types[type]}
                        </div>
                    )
                })}
            </div>
            <div className="row pt-4">
                <div className="col">
                    <label htmlFor="type">Move Type</label>
                    <select onChange={handleInputChange} id="type" defaultValue={Types.Bug}>
                        {Object.keys(EffectivenessTable).map((type, index) => {
                            return (
                                <option value={index} key={type}>{Types[index]}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <div className="row pt-1">
                <div className="col">
                    <button className="btn btn-warning" onClick={() => checkTypeEffectiveness}>Check Type</button>
                </div>
            </div>
            <div className="row pt-3">
                <div className="col">
                    {typeDamage < 5 && `${Types[selectedType]} will be ${typeDamage}x effective!`}
                </div>
            </div>
        </div>
    )
}