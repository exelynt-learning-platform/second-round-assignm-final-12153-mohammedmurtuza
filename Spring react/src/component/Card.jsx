import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Card() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [likes, setLikes] = useState({})

    const handleLike = (productId) => {
        setLikes(prevLikes => ({
            ...prevLikes,
            [productId]: (prevLikes[productId] || 0) + 1
        }));
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/Products")
            .then(response => response.json())
            .then((json) => {
                setData(json)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setLoading(false)
            });
    }, []);

    

    return (
        <>
            <div className="min-h-screen bg-gray-950 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10"></div>
                
                <div className="relative z-10 w-full h-full mx-auto px-6 py-8">
                    <div className="flex justify-end mb-8">
                        <Link
                            to="/addProduct"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm"
                        >
                            + Add New Product
                        </Link>
                    </div>
                    <div className="text-center mb-16">
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                            Premium Products
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Discover our collection of high-quality products with exceptional design and performance
                        </p>
                    </div>

                {data.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="relative mx-auto mb-8">
                            <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin mx-auto" style={{animationDelay: '0.15s'}}></div>
                        </div>
                        <p className="text-gray-400 text-xl font-medium">Loading amazing products...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {data.map((product) => (
                            <div key={product.id} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:bg-gray-900/70 transition-all duration-300 hover:scale-120 hover:shadow-2xl">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Product Header */}
                                <div className="relative p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {product.brand}
                                        </span>
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Product Content */}
                                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                                        {product.name}
                                    </h2>
                                    <p className="text-gray-400 mb-6 line-clamp-2">
                                        {product.about}
                                    </p>

                                    {/* Price Section */}
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                                ₹{product.price}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Released</p>
                                            <p className="text-sm font-medium text-gray-300">
                                                {new Date(product.releaseDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleLike(product.id)} 
                                            className={`px-4 py-3 border-2 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                                likes[product.id] > 0 
                                                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-pink-500' 
                                                    : 'border-gray-600 text-gray-300 hover:border-pink-500 hover:text-pink-400 bg-gray-800/50 backdrop-blur-sm'
                                            }`}
                                        >
                                            <svg className="w-5 h-5" fill={likes[product.id] > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                            </svg>
                                            <span className="font-semibold">{likes[product.id] || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </>
    )
}


export default Card