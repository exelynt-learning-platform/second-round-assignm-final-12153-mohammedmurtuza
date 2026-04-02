import React from 'react'

import { useState } from 'react'

function    DeleteProduct() {
    const [deleteProduct, setDeleteProduct] = useState(false);
    const [productId, setProductId] = useState('');
    
    
    const handleDelete = async () => { 
  
        if (!productId) {
            alert('Please enter a product ID');
            return;
        }       
        try {
            const response = await fetch(`http://localhost:8080/api/Product/id${productId}`, {
                method: 'DELETE',
            }); 
            if (response.ok) {
                alert('Product deleted successfully');
                setDeleteProduct(true);
                setProductId('');
            } else {
                alert('Failed to delete product');
            }   
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product');
        }
    }
   

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <h2 className="text-3xl text-white mb-6">Delete Product</h2>
            <form onSubmit={handleDelete} className="bg-white p-6 rounded-lg shadow-md w-96">
                <input
                    type="text"
                    placeholder="Enter Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button

                    type="submit"
                    className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Delete Product
                </button>   
                {deleteProduct && <p className="text-green-600 mt-4">Product deleted successfully!</p>}
            </form>
        </div>
    )
}


export default DeleteProduct