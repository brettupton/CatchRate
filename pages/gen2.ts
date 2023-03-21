
type WildPokemon = {
    name: string,
    catchRate: number,
    level: number,
    status: string,
    gender: string,
    weight: number,
    fishing: boolean,
    HPMax: number,
    HPCurrent: number
}

type TrainerPokemon = {
    level: number,
    gender: string
}

const calculateC = (ballUsed: string, wildPokemon: WildPokemon, trainerPokemon: TrainerPokemon) => {
    switch (ballUsed) {
        case "Friend" || "Poke" || "Moon":
            return wildPokemon.catchRate
        case "Park" || "Great":
            return wildPokemon.catchRate * 1.5
        case "Ultra":
            return wildPokemon.catchRate * 2
        case "Fast":
            if (["Grimer", "Magnemite", "Tangela"].indexOf(wildPokemon.name) > -1) {
                return wildPokemon.catchRate * 4
            }
            return wildPokemon.catchRate
        case "Heavy":
            if (wildPokemon.weight >= 903) {
                return wildPokemon.catchRate + 40
            }
            if (wildPokemon.weight >= 677.3) {
                return wildPokemon.catchRate + 30
            }
            if (wildPokemon.weight >= 451.5) {
                return wildPokemon.catchRate + 20
            }
            if (wildPokemon.weight >= 255.8) {
                return wildPokemon.catchRate
            }
            return wildPokemon.catchRate - 20
        case "Level":
            if (Math.floor(trainerPokemon.level / 4) > wildPokemon.level) {
                return wildPokemon.catchRate * 8
            }
            if (Math.floor(trainerPokemon.level / 2) > wildPokemon.level) {
                return wildPokemon.catchRate * 4
            }
            if (trainerPokemon.level > wildPokemon.level) {
                return wildPokemon.catchRate * 2
            }
            return wildPokemon.catchRate
        case "Love":
            if (trainerPokemon.gender === wildPokemon.gender) {
                return wildPokemon.catchRate * 8
            }
            return wildPokemon.catchRate
        case "Lure":
            if (wildPokemon.fishing) {
                return wildPokemon.catchRate * 3
            }
            return wildPokemon.catchRate
        default:
            return 0
    }
}

const checkGen2Capture = (ballUsed: string, wildPokemon: WildPokemon, trainerPokemon: TrainerPokemon) => {
    const calcC = calculateC(ballUsed, wildPokemon, trainerPokemon)
    const clampedC = Math.min(Math.max(calcC, 1), 255)

    const M = Math.floor(Math.random() * 255)

    const rateCheck = (((3 * wildPokemon.HPMax) - (2 * wildPokemon.HPCurrent)) * clampedC) / (3 * wildPokemon.HPMax)
    const clampedRate = Math.min(Math.max(rateCheck, 1), 255)

    const statusAdd = (["Asleep", "Frozen"].indexOf(wildPokemon.status) > -1) ? 10 : 0

    const X = Math.max(clampedRate, 1) + statusAdd

    return (M <= X)
}

const displayRates = (testAmount: number) => {
    let catchCount = 0
    let failCount = 0

    for (let i = 0; i < testAmount; i++) {
        if (checkGen2Capture("Park", wildScyther, trainerQuilava)) {
            catchCount++
        } else {
            failCount++
        }
    }
    console.log((catchCount / testAmount), (failCount / testAmount))
}

const wildScyther: WildPokemon = {
    name: "Scyther",
    catchRate: 45,
    level: 14,
    status: "None",
    gender: "Male",
    weight: 123.5,
    fishing: false,
    HPMax: 70,
    HPCurrent: 70
}

const trainerQuilava: TrainerPokemon = {
    level: 16,
    gender: "Male"
}

displayRates(10000000)