import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/Products/${id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const productData = await response.json();
                setProduct(productData);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }  
    }, [id]);

    // Delete function to handle deletion directly
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/Product/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    alert('Product deleted successfully!');
                    navigate('/card');
                } else {
                    const errorText = await response.text();
                    console.error('Delete failed:', errorText);
                    throw new Error(`Failed to delete product: ${errorText}`);
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting product: ' + error.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/card')}  
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/card')}
                    className="mb-6 flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Products
                </button>

                <div className="bg-gradient-to-br from-white/90 to-blue-100 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Section */}
                        {product.imageDate ? (
                            <img
                                src={`data:image/jpeg;base64,${product.imageDate}`}
                                alt={product.name}
                                className="object-cover w-full h-96 lg:h-full"
                            />
                        ) : (
                            <div className="h-96 lg:h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative">
                                <div className="text-white text-center">
                                    <div className="text-6xl mb-4">📦</div>
                                    <p className="text-xl font-semibold">No Image Available</p>
                                </div>
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/50 bg-opacity-90 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                                        {product.cate}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Product Details Section */}
                        <div className="p-8 lg:p-12">
                            <div className="mb-6">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    {product.about}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-5xl font-bold text-emerald-600">
                                    ₹{product.price?.toLocaleString()}
                                </span>
                            </div>

                            {/* Product Info Grid */}
                            <div className="grid grid-cols-1 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Brand
                                    </h3>
                                    <p className="text-lg font-medium text-gray-800">
                                        {product.brand}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Release Date
                                    </h3>
                                    <p className="text-lg font-medium text-gray-800">
                                        {product.releaseDate}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4">
                                <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                                    Add to Cart
                                </button>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => navigate(`/updateProduct/${id}`)}
                                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Update
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;