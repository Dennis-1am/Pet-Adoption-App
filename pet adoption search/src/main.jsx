import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DetailView from './routes/DetailedView.jsx'
import Layout from './routes/Layout.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index={true} path="/" element={<App />} />
          <Route path="/petInfo/:id" element={<DetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

