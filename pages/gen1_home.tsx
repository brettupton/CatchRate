import React from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

export const Gen1HomePage = () => {

    const location = useLocation()

    if (location.pathname === '/gen1') {
        return (
            <div className="container pt-4">
                <div className="row">
                    <div className="col">
                        <Link to="catchrate">Catch Rate</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container pt-4">
            <Outlet />
        </div>
    )
}

