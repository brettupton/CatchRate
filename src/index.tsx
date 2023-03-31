import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { IndexPage } from '../pages/indexPage'
import { Gen1HomePage } from '../pages/gen1_home'
import { Gen1CatchRate } from '../pages/gen1_cr'
import { RNGTest } from '../pages/rng'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<IndexPage />} />
                    <Route path="/gen1" element={<Gen1HomePage />}>
                        <Route path="catchrate" element={<Gen1CatchRate />} />
                    </Route>
                    <Route path="/rng" element={<RNGTest />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)