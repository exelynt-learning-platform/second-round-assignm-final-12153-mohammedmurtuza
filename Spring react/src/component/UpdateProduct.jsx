import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({
        name: '',
        about: '',
        brand: '',
        price: '',
        cate: '',
        releaseDate: '',
        available: false,
        quantity: '',
        image: null
    });

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/Products/${id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const productData = await response.json();
                setProduct({
                    name: productData.name || '',
                    about: productData.about || '',
                    brand: productData.brand || '',
                    price: productData.price || '',
                    cate: productData.cate || '',
                    releaseDate: productData.releaseDate || '',
                    available: productData.available || false,
                    quantity: productData.quantity || '',
                    image: null
                });
            } catch (err) {
                console.error("Error fetching product:", err);
                alert('Failed to load product data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        
        // Create product object with correct property names to match Java model
        const productData = {
            id: parseInt(id), // Include the product ID for update
            name: product.name,
            about: product.about,
            brand: product.brand,
            price: parseFloat(product.price),
            cate: product.cate,
            releaseDate: product.releaseDate,
            available: product.available,
            quantity: parseInt(product.quantity) || 0
        };

        // Add product as JSON blob with correct parameter name
        formData.append("product",
            new Blob([JSON.stringify(productData)], { type: "application/json" })
        );
        
        // Add image file if selected
        if(product.image) {
            formData.append("imageFile", product.image);
        }

        try {
            const response = await fetch(`http://localhost:8080/api/Product/${id}`, {
                method: 'PUT',
                body: formData,
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Product updated:', result);
                alert('Product updated successfully!');
                navigate(`/product/${id}`); // Navigate back to product detail
            } else {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                alert(`Failed to update product: ${errorText}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Error updating product: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading product data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 ">
            <div className="rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Product</h2>
                <form className="space-y-6  bg-white/90 p-3 rounded-lg" onSubmit={handleSubmit}>
                    
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="About"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        value={product.about}
                        onChange={(e) => setProduct({ ...product, about: e.target.value })}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Brand"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.brand}
                        onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.cate}
                        onChange={(e) => setProduct({ ...product, cate: e.target.value })}
                    />

                    <input
                        type="date"
                        placeholder="Release Date"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.releaseDate}
                        onChange={(e) => setProduct({ ...product, releaseDate: e.target.value })}
                    />

                    <input
                        type="number"
                        placeholder="Quantity"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.quantity}
                        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                    />

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={product.available}
                            onChange={(e) => setProduct({ ...product, available: e.target.checked })}
                            className="h-4 w-4"
                        />
                        <label className="text-gray-700">Available</label>
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Product Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/product/${id}`)}
                            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProduct