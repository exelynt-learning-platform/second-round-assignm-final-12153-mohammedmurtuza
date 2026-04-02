import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Card from './component/Card'
import About from './component/About'
import ProductDetail from './component/ProductDetail'
import AddProduct from './component/AddProduct'
import UpdateProduct from './component/UpdateProduct'
import Home from './component/Home'
import DeleteProduct from './component/DeleteProduct'

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    console.log(theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme])

  return (
    <div className={theme ? 'dark' : 'light'}>
      <select value={theme} onChange={(e) => setTheme(e.target.value)} className="fixed bottom-5 bg-gray-800 text-white p-2 rounded-lg z-50">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/card" element={<Card />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/updateProduct/:id" element={<UpdateProduct />} />
            <Route path="/deleteProduct/:id" element={<DeleteProduct />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App