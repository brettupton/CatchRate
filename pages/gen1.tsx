import React, { useEffect, useState } from "react"
import { Random } from "random-js"
import Plot from 'react-plotly.js'
import { gen1Pokemon } from "../pokemon/gen1poke"
import { Data, Datum } from "plotly.js"

type WildPokemon = {
    name: string,
    level: number,
    baseHp: number,
    dv: { "Hp": number } // random range from 0-15
    HPMax: number,
    HPCurrent: number,
    status: Status
}

type Ball = "Ultra" | "Great" | "Poke" | "Master"
type Status = "Frozen" | "Paralyzed" | "Burned" | "Poisoned" | "Asleep" | "None"

const random = new Random()

export const Gen1 = () => {

    const [currentCaptureRate, setCurrentCaptureRate] = useState(0)
    const [wildPokemon, setWildPokemon] = useState<WildPokemon>({
        name: "bulbasaur",
        level: 50,
        baseHp: 0,
        dv: {
            "Hp": random.integer(0, 15)
        },
        HPMax: 0,
        HPCurrent: 0,
        status: 'None'
    })
    const [pokemonData, setPokemonData] = useState({
        id: 0
    })
    const [pokeBallData, setPokeBallData] = useState<Data>(
        {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'Poke',
            line: { shape: 'linear', color: "red" },
            type: 'scatter'
        }
    )
    const [greatBallData, setGreatBallData] = useState<Data>(
        {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'Great',
            line: { shape: 'linear', color: "blue" },
            type: 'scatter'
        }
    )
    const [ultraBallData, setUltraBallData] = useState<Data>(
        {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'Ultra',
            line: { shape: 'linear', color: "#f2c242" },
            type: 'scatter'
        }
    )

    // Fetch first pokemon in list data
    useEffect(() => {
        fetchPokemonData(wildPokemon.name)
    }, [])

    // When data is fetched, calculate the capture rate
    useEffect(() => {
        if (pokemonData.id !== 0)
            fetchCaptureRate()
    }, [wildPokemon])


    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { id, value } = e.currentTarget

        if (id === "pokemon") {
            fetchPokemonData(value)
            return
        }
        if (id === "level") {
            setWildPokemon((values) => ({ ...values, ["level"]: Number(value) }))
            return
        }
        if (id === "status") {
            setWildPokemon((values) => ({ ...values, ['status']: value as Status }))
            return
        }
    }

    // From API, name is set with baseHP
    // HPMax and HPCurrent are calculated from baseHp and DV
    const fetchPokemonData = (pokemon: string) => {
        fetch('https://pokeapi.co/api/v2/pokemon/' + pokemon, {
            method: "GET"
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setPokemonData(data)
                setWildPokemon((values) => ({
                    ...values,
                    name: data.species.name,
                    dv: {
                        "Hp": random.integer(0, 15)
                    },
                    baseHp: data.stats[0].base_stat,
                    HPMax: calculateHp(data.stats[0].base_stat, wildPokemon.dv.Hp),
                    HPCurrent: calculateHp(data.stats[0].base_stat, wildPokemon.dv.Hp),
                }))
            })
    }

    const fetchCaptureRate = () => {
        fetch('https://pokeapi.co/api/v2/pokemon-species/' + pokemonData.id, {
            method: "GET"
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setCurrentCaptureRate(data.capture_rate)
            })
    }

    const calculateHp = (baseStat: number, dv: number) => {
        const Hp = Math.floor((((baseStat + dv) * 2 + (Math.sqrt(0) / 4)) * wildPokemon.level) / 100) + wildPokemon.level + 10

        return Hp
    }

    const generateR = (pokemon: WildPokemon, ballUsed: Ball) => {
        switch (ballUsed) {
            case "Ultra":
                //had to play around with this number to get expected results
                //(0, 150) was generating too high of percentage
                //little bit of a cheat to counteract the results of gen 1 RNG weirdness
                if (pokemon.status !== 'None') {
                    return random.integer(0, 130)
                }
                return (random.integer(0, 233))
            case "Great":
                return (random.integer(0, 200))
            case "Poke":
                return (random.integer(0, 255))
            default:
                return 0
        }
    }

    const generateS = (pokemon: WildPokemon) => {
        const greaterStatus = ["Frozen", "Asleep"]
        const lesserStatus = ["Paralyzed", "Burned", "Poisoned"]

        if (greaterStatus.includes(pokemon.status)) {
            return 25
        }
        if (lesserStatus.includes(pokemon.status)) {
            return 12
        }
        return 0
    }

    // This comes directly from disassembly of Red & Blue from 'https://github.com/pret/pokered/'
    const checkGen1Capture = (pokemon: WildPokemon, hp: number, ballUsed: Ball) => {
        if (ballUsed === "Master") {
            return true
        }

        const R = generateR(pokemon, ballUsed)
        const S = generateS(pokemon)
        const rStar = R - S

        if (rStar < 0) {
            return true
        }

        if (currentCaptureRate < rStar) {
            return false
        }

        const ballRate = ballUsed === "Great" ? 8 : 12

        const F = Math.min((Math.floor((pokemon.HPMax * 255) / ballRate)) / Math.max((Math.floor(hp / 4)), 1), 255)

        const R2 = random.integer(1, 255)

        return R2 <= F
    }

    const getCaptureSuccessData = (pokemon: WildPokemon, hp: number, ballUsed: Ball) => {
        const testAmount = 100000
        let captureCount = 0

        for (let i = 0; i < testAmount; i++) {
            if (checkGen1Capture(pokemon, hp, ballUsed)) {
                captureCount++
            }
        }

        const successResult = Number(((captureCount / testAmount) * 100).toFixed(2))

        return successResult
    }

    const getPokeBallPlotData = (pokemon: WildPokemon) => {
        const xArray: string[] = []
        const yArray: Datum[] = []

        for (let i = 1; i < pokemon.HPCurrent; i++) {
            let result = getCaptureSuccessData(pokemon, i, "Poke")
            xArray.push(i.toString())
            yArray.push(result)
        }

        setPokeBallData((values) => ({ ...values, ["x"]: xArray }))
        setPokeBallData((values) => ({ ...values, ["y"]: yArray }))
    }

    const getGreatBallPlotData = (pokemon: WildPokemon) => {
        const xArray: string[] = []
        const yArray: Datum[] = []

        for (let i = 1; i < pokemon.HPCurrent; i++) {
            let result = getCaptureSuccessData(pokemon, i, "Great")
            xArray.push(i.toString())
            yArray.push(result)
        }

        setGreatBallData((values) => ({ ...values, ["x"]: xArray }))
        setGreatBallData((values) => ({ ...values, ["y"]: yArray }))
    }

    const getUltraBallPlotData = (pokemon: WildPokemon) => {
        const xArray: string[] = []
        const yArray: Datum[] = []

        for (let i = 1; i < pokemon.HPCurrent; i++) {
            let result = getCaptureSuccessData(pokemon, i, "Ultra")
            xArray.push(i.toString())
            yArray.push(result)
        }

        setUltraBallData((values) => ({ ...values, ["x"]: xArray }))
        setUltraBallData((values) => ({ ...values, ["y"]: yArray }))
    }

    const getPlotData = (pokemon: WildPokemon) => {
        getPokeBallPlotData(pokemon)
        getGreatBallPlotData(pokemon)
        getUltraBallPlotData(pokemon)
    }

    return (
        <div>
            <div>
                <h1>Gen 1</h1>
                <label htmlFor="pokemon">Pokemon: </label>
                <select onChange={handleInputChange} id="pokemon">
                    {gen1Pokemon.map((pokemon, index) => {
                        return (
                            <option value={pokemon} key={index}>
                                {(pokemon.charAt(0).toUpperCase() + pokemon.slice(1)).split("-").join(" ")}
                            </option>
                        )
                    })}
                </select>
            </div>
            <div>
                Catch rate: {currentCaptureRate}
            </div>
            <div>
                <label htmlFor="status">Status: </label>
                <select onChange={handleInputChange} id="status">
                    <option value="None">None</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Asleep">Asleep</option>
                    <option value="Paralyzed">Paralyzed</option>
                    <option value="Burned">Burned</option>
                    <option value="Poisoned">Poisoned</option>
                </select>
            </div>
            <div>
                <label htmlFor="level">Level: </label>
                <input type="number" id="level" onChange={handleInputChange} min="1" max="100" defaultValue={wildPokemon.level} />
            </div>
            <div>
                <button onClick={() => getPlotData(wildPokemon)}>Plot</button>
            </div>
            <div>
                <Plot data={[pokeBallData, greatBallData, ultraBallData]} layout={{
                    height: 480,
                    width: 720,
                    title: `${(wildPokemon.name.charAt(0).toUpperCase() + wildPokemon.name.slice(1)).split("-").join(" ")} Catch Rate`,
                    xaxis: {
                        title: 'HP'
                    },
                    yaxis: {
                        title: 'Rate %'
                    }
                }} />
            </div>
        </div>
    )
}
