import React, { useEffect, useState } from "react"
import { Random } from "random-js"
import { FTable } from '../pokemon/FTable'
import Plot from 'react-plotly.js'
import { gen1Pokemon } from "../pokemon/gen1poke"
import { Datum, PlotData } from "plotly.js"

type WildPokemon = {
    id: number,
    name: string,
    level: number,
    baseHp: number,
    dv: { "Hp": number } // random range from 0-15
    HPMax: number,
    HPCurrent: number
}

type BallData = {
    [key: string]: Partial<PlotData>
}

type Ball = "Ultra" | "Great" | "Poke" | "Master"
enum Status {
    None,
    Frozen,
    Asleep,
    Paralyzed,
    Burned,
    Poisoned
}

const random = new Random()

export const Gen1CatchRate = () => {

    //RNG 

    const [rDiv, setRDiv] = useState(0)
    const [addByte, setAddByte] = useState(0)

    // Cycle every 25 nanoseconds through 0 to 255
    // 25ns is roughly the speed of the GB clock cycle

    // useEffect(() => {
    //     if (rDiv === 255) {
    //         setRDiv(0)
    //         return
    //     }
    //     const timer = setTimeout(() => {
    //         setRDiv((prev) => prev += 1)
    //     }, (1 / 2500000))
    //     return () => clearTimeout(timer)
    // }, [rDiv])

    // const calculateAddByte = () => {
    //     const carryBit = 1
    //     const currRDiv = rDiv
    //     const add = addByte

    //     const outcome = ((currRDiv + carryBit) + add) % 256

    //     setAddByte(outcome)
    //     return outcome
    // }

    // RNG END


    const [currentCaptureRate, setCurrentCaptureRate] = useState(0)
    const [currentStatus, setCurrentStatus] = useState<Status>(0)
    const [wildPokemon, setWildPokemon] = useState<WildPokemon>({
        id: 0,
        name: "bulbasaur",
        level: 10,
        baseHp: 0,
        dv: {
            "Hp": random.integer(0, 15)
        },
        HPMax: 0,
        HPCurrent: 0
    })
    const [plottingData, setPlottingData] = useState(false)

    const [ballData, setBallData] = useState<BallData>({
        "Ultra": {
            x: [],
            y: [],
            mode: 'lines',
            name: 'Ultra',
            line: { shape: 'spline', color: "#f2c242" },
            type: 'scatter'
        },
        "Great": {
            x: [],
            y: [],
            mode: 'lines',
            name: 'Great',
            line: { shape: 'spline', color: "blue" },
            type: 'scatter'
        },
        "Poke": {
            x: [],
            y: [],
            mode: 'lines',
            name: 'Poke',
            line: { shape: 'spline', color: "red" },
            type: 'scatter'
        }
    })

    const [verticalLineData, setVerticalLineData] = useState<Partial<PlotData>>(
        {
            x: [],
            y: [],
            mode: 'lines',
            name: "50% HP",
            line: {
                dash: 'dot',
                width: 4,
                color: "green"
            },
            connectgaps: true
        }
    )

    // Fetch first pokemon in list data
    useEffect(() => {
        fetchPokemonData(wildPokemon.name)
    }, [])

    // When data is fetched, calculate the capture rate
    useEffect(() => {
        if (wildPokemon.id !== 0)
            fetchCaptureRate()
    }, [wildPokemon])

    useEffect(() => {
        if (ballData["Great"]["x"]?.length) {
            setPlottingData(false)
        }
    }, [ballData])


    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { id, value } = e.currentTarget

        if (id === "pokemon") {
            fetchPokemonData(value)
            return
        }
        if (id === "level") {
            setWildPokemon((values) => ({
                ...values,
                ["level"]: Number(value),
                HPMax: calculateHp(values.baseHp, wildPokemon.dv.Hp, Number(value)),
                HPCurrent: calculateHp(values.baseHp, wildPokemon.dv.Hp, Number(value)),
            }))
            return
        }
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = Number(e.currentTarget.value)

        setCurrentStatus(status)
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
                setWildPokemon((values) => ({
                    ...values,
                    id: data.id,
                    name: data.species.name,
                    dv: {
                        "Hp": random.integer(0, 15)
                    },
                    baseHp: data.stats[0].base_stat,
                    HPMax: calculateHp(data.stats[0].base_stat, wildPokemon.dv.Hp, 10),
                    HPCurrent: calculateHp(data.stats[0].base_stat, wildPokemon.dv.Hp, 10),
                }))
            })
    }

    const fetchCaptureRate = () => {
        fetch('https://pokeapi.co/api/v2/pokemon-species/' + wildPokemon.id, {
            method: "GET"
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setCurrentCaptureRate(data.capture_rate)
            })
    }

    const calculateHp = (baseStat: number, dv: number, level: number) => {
        const Hp = Math.floor((((baseStat + dv) * 2 + (Math.sqrt(0) / 4)) * level) / 100) + level + 10

        return Hp
    }

    const generateR = (ballUsed: Ball) => {
        const currentStat = Status[currentStatus]
        // pulling index.not name of enum

        switch (ballUsed) {
            case "Ultra":
                //had to play around with this number to get expected results
                //(0, 150) was generating too high of percentage
                //little bit of a cheat to counteract the results of gen 1 RNG weirdness
                if (currentStat !== 'None') {
                    return random.integer(0, 133)
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
        const currentStat = Status[currentStatus]

        if (greaterStatus.includes(currentStat)) {
            return 25
        }
        if (lesserStatus.includes(currentStat)) {
            return 12
        }
        return 0
    }

    // This function comes directly from disassembly of Red & Blue from 'https://github.com/pret/pokered/'
    const checkGen1Capture = (pokemon: WildPokemon, hp: number, ballUsed: Ball) => {
        if (ballUsed === "Master") {
            return true
        }

        const R = generateR(ballUsed)
        const S = generateS(pokemon)
        const rStar = R - S

        if (rStar < 0) {
            return true
        }

        if (currentCaptureRate < rStar) {
            return false
        }
        const greatBall = ballUsed === "Great"
        const hpMaxString = pokemon.HPMax.toString()

        const F = FTable[`${greatBall ? "Great" : "Other"}`][hpMaxString][hp - 1]

        const R2 = random.integer(1, 255)

        return R2 <= F
    }

    const getCaptureSuccessData = (pokemon: WildPokemon, hp: number, ballUsed: Ball) => {
        const testAmount = 10000
        let captureCount = 0

        for (let i = 0; i < testAmount; i++) {
            if (checkGen1Capture(pokemon, hp, ballUsed)) {
                captureCount++
            }
        }

        const successResult = Number(((captureCount / testAmount) * 100).toFixed(2))

        return successResult
    }

    const returnMaxAndMin = (orginalArray: Datum[], checkAgainstArray: Datum[]) => {

        const maxMin: Datum[] = []
        // Create new number arrays out of the data in provided Datum array
        // This is so the Math.max works with the arrays, as it doesn't with the Datum ones
        const numOriginal =
            orginalArray.filter((num) => {
                return typeof num === 'number'
            }).map((num) => {
                return num as number
            })

        const numCheck =
            checkAgainstArray.filter((num) => {
                return typeof num === 'number'
            }).map((num) => {
                return num as number
            })

        const originalMax = Math.max(...numOriginal)
        const originalMin = Math.min(...numOriginal)
        const checkMax = Math.max(...numCheck)
        const checkMin = Math.min(...numCheck)

        if (originalMax > checkMax) {
            if (originalMin > checkMin) {
                maxMin.push(originalMax, originalMin)
                return maxMin
            }
            maxMin.push(originalMax, checkMin)
            return maxMin
        }
        maxMin.push(checkMax, checkMin)
        return maxMin
    }

    const getBallPlotData = (pokemon: WildPokemon) => {
        const halfHp = Math.floor(pokemon.HPMax / 2)
        const ballArray = ["Ultra", "Great", "Poke"]

        // Store the previous yArray
        let prevYArray: Datum[] = []

        for (let ball of ballArray) {
            let xArray: Datum[] = []
            let yArray: Datum[] = []

            // Vertical Line Data
            const hpArray: Datum[] = []

            for (let i = pokemon.HPCurrent; i >= 1; i--) {
                let result = getCaptureSuccessData(pokemon, i, ball as Ball)

                hpArray.push(halfHp)
                xArray.push(i)
                yArray.push(result)
            }

            const maxMin = returnMaxAndMin(yArray, prevYArray.concat(yArray))

            setBallData((values) => ({
                ...values,
                [ball]: {
                    ...values[ball],
                    ["x"]: xArray,
                    ["y"]: [...yArray]
                }
            }))

            setVerticalLineData((values) => ({
                ...values,
                ["x"]: hpArray,
                ["y"]: maxMin
            }))

            prevYArray = prevYArray.concat(yArray)
        }

    }

    const getPlotData = (pokemon: WildPokemon) => {
        getBallPlotData(pokemon)
    }

    const handlePlotClick = () => {
        setPlottingData(true)
        getPlotData(wildPokemon)
    }

    const testCaptureTime = () => {
        console.time("F")
        checkGen1Capture(wildPokemon, wildPokemon.HPCurrent, "Ultra")
        console.timeEnd("F")
    }

    return (
        <div className="container text-start mt-3 bg-transparent">
            <div className="row">
                <div className="col">
                    <h1 className="text-center">Gen 1</h1>
                </div>
            </div>
            <div className="row pt-1">
                <div className="col">
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
            </div>
            <div className="row pt-1">
                <div className="col">
                    Catch rate: {currentCaptureRate}
                </div>
            </div>
            <div className="row">
                <div className="col">

                    <label htmlFor="status">Status: </label>
                    <select onChange={handleStatusChange}>
                        <option value={0}>None</option>
                        <option value={1}>Frozen</option>
                        <option value={2}>Asleep</option>
                        <option value={3}>Paralyzed</option>
                        <option value={4}>Burned</option>
                        <option value={5}>Poisoned</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="level">Level: </label>
                    <input type="number" id="level" onChange={handleInputChange} min="1" max="100" defaultValue={wildPokemon.level} />
                </div>
            </div>
            <div className="row mt-1">
                <div className="col">
                    <button className="btn btn-warning" onClick={handlePlotClick}>
                        {plottingData ?
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            : "Plot"}
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Plot data={[ballData["Poke"], ballData["Great"], ballData["Ultra"], verticalLineData]} layout={{
                        height: 480,
                        width: 720,
                        title: `${(wildPokemon.name.charAt(0).toUpperCase() + wildPokemon.name.slice(1)).split("-").join(" ")} Catch Rate`,
                        xaxis: {
                            title: 'HP',
                            autorange: "reversed",
                            linecolor: 'black',
                            linewidth: 2,
                            mirror: true
                        },
                        yaxis: {
                            title: 'Rate %',
                            linecolor: 'black',
                            linewidth: 2,
                            mirror: true
                        },
                        plot_bgcolor: "#F8F8FF",
                        paper_bgcolor: "#F8F8FF"
                    }} />
                </div>
            </div>
        </div>
    )
}
