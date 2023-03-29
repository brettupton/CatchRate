import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { IndexPage } from '../pages/indexPage'
import { Gen1CatchRate } from '../pages/gen1'
import { RNGTest } from '../pages/rng'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/gen1" element={<Gen1CatchRate />} />
                <Route path="/rng" element={<RNGTest />} />
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