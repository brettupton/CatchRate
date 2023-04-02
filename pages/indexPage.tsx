import React from "react"
import { Link } from 'react-router-dom'

export const IndexPage = () => {
    return (
        <div className="container text-center py-1">
            <div className="row">
                <div className="col">
                    <h1>Welcome</h1>
                </div>
            </div>
            <div className="row pt-4">
                <div className="col">
                    <Link to="gen1">Gen 1</Link>
                </div>
            </div>
            <div className="row pt-4">
                <div className="col">
                    <Link to="rng">RNG</Link>
                </div>
            </div>
            <div className="row pt-4">
                <div className="col">
                    <Link to="types">Types</Link>
                </div>
            </div>
        </div>
    )
}