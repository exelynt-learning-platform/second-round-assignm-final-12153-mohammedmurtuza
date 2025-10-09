import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function AddProduct() {
  const [add, setAdd] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Create product object with correct property names to match Java model
    const productData = {
      name: add.name,
      about: add.about,
      brand: add.brand,
      price: parseFloat(add.price), // Convert to number for BigDecimal
      cate: add.cate,
      releaseDate: add.releaseDate,
      available: add.available,
      quantity: parseInt(add.quantity) || 0
    };

    // Add product as JSON blob with correct parameter name
    formData.append("product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
    
    // Add image file if selected
    if(add.image) {
      formData.append("imageFile", add.image);
    }

    try {
      const response = await fetch('http://localhost:8080/api/Product', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Product added:', result);
        alert('Product added successfully!');
        // Reset form
        setAdd({
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
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        alert(`Failed to add product: ${errorText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error adding product: ' + error.message);
    }
  }

  return (
    <div className='bg-[rgb(56,58,60)] min-h-screen flex flex-col items-center justify-center'>
      <Link to="/card" className="mb-4 text-3xl text-blue-600 hover:underline">
        Back to Products
      </Link>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Product</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
    
        <input
          type="text"
          placeholder="Product Name"
          className="w-full px-3 py-2 gap-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={add.name}
          onChange={(e) => setAdd({ ...add, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="About"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={add.about}
          onChange={(e) => setAdd({ ...add, about: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Brand"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={add.brand}
          onChange={(e) => setAdd({ ...add, brand: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={add.price}
          onChange={(e) => setAdd({ ...add, price: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={add.cate}
          onChange={(e) => setAdd({ ...add, cate: e.target.value })}
        />

        <input
          type="date"
          placeholder="Release Date"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={add.releaseDate}
          onChange={(e) => setAdd({ ...add, releaseDate: e.target.value })}
        />

        <input
          type="number"
          placeholder="Quantity"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={add.quantity}
          onChange={(e) => setAdd({ ...add, quantity: e.target.value })}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={add.available}
            onChange={(e) => setAdd({ ...add, available: e.target.checked })}
            className="h-4 w-4"
          />
          <label>Available</label>
        </div>
        <div className="w-full max-w-md px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input
            type="text"
            placeholder="Image Name"
            value={add.imageName}
            onChange={(e) => setAdd({ ...add, imageName: e.target.value })}
          />
        </div>
        <div className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input
            type="text"
            placeholder="Image Type"
            value={add.imageType}
            onChange={(e) => setAdd({ ...add, imageType: e.target.value })}
          />
        </div>
        <div className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAdd({ ...add, image: e.target.files[0] })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
        >
          Add Product
        </button>
      </form>
      </div>
    </div>
  )
}

export default AddProduct
