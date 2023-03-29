// The divider register (rDiv), a single 8-bit value or byte, which increments rapidly from 0 through 255, then back to 0 and so on, 
//continuously while the game is played. More specifically, it is incremented by one every 256 processor cycles, 
//which even on an old rickety console like the Game Boy means more than 16,000 times a second. You can treat processor cycles more or less like a unit of time for our purposes - 
//any given operation or calculation the console performs takes some fixed number of processor cycles.
// The carry bit, a single bit (zero or one) that is set based on the outcome of certain arithmetic operations performed by the processor - 
//it's essentially the same kind of "carrying the one" that you probably learned to do in grade school math, but the details are not terribly important here, 
//only the fact it's sometimes zero and sometimes one depending on whatever the last thing the game was doing was.
// Two more 8-bit variables where the generated "random" values are stored, which I'll refer to here as the add byte and the subtract byte

// Add the current rDiv value and the current carry bit (as set by whatever the last calculation performed was) to the value of the add byte; 
//if the outcome surpasses 255, it will simply loop around to count from zero, so that e.g. 255 + 2 = 1.

import React, { useState, useEffect } from 'react'

export const RNGTest = () => {

    const [rDiv, setRDiv] = useState(0)
    const [addByte, setAddByte] = useState(0)

    // Cycle every 25 nanoseconds through 0 to 255
    // 25ns is roughly the speed of the GB clock cycle
    useEffect(() => {
        if (rDiv === 255) {
            setRDiv(0)
            return
        }
        const timer = setTimeout(() => {
            setRDiv((prev) => prev += 1)
        }, (1 / 2500000));
        return () => clearTimeout(timer)
    }, [rDiv])

    const calculateAddByte = () => {
        const carryBit = 1
        const currRDiv = rDiv
        const add = addByte

        const outcome = ((currRDiv + carryBit) + add) % 256

        setAddByte(outcome)
        return outcome
    }

    return (
        <div className="container text-center mt-2">
            <div className="row">
                <div className="col">
                    <h4>RNG</h4>
                </div>
            </div>
            <div className="row pt-4 justify-content-center">
                <div className="col-2">
                    divider register:
                </div>
                <div className="col-1">
                    {rDiv}
                </div>
            </div>
            <div className="row pt-5">
                <div className="col">
                    {addByte}
                </div>
            </div>
            <div className="row pt-1">
                <div className="col">
                    <button className="btn btn-warning" onClick={calculateAddByte}>Get Add Byte</button>
                </div>
            </div>
        </div>
    )
}