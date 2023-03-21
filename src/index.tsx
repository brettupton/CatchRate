import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Gen1 } from '../pages/gen1'

const container = document.getElementById('app-root')!
const root = createRoot(container)
root.render(
    <React.StrictMode>
        <div>
            <Gen1 />
        </div>
    </React.StrictMode>
)