import React, { useState, useEffect, useContext } from 'react';
import '../styles/Productos.module.css'; 
import { useAuth } from './authContext';
import { FaTrashAlt } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';
import { BsDatabaseFillAdd } from 'react-icons/bs';

const ProductList = ({ products, onEdit, onDelete, isAdmin }) => {
    // Si no hay productos, se muestra un mensaje
    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="product-list-container">
                <h3 className="list-title">Lista de Productos</h3>
                <p className="no-products-message">No hay productos para mostrar. Agrega uno nuevo para comenzar.</p>
            </div>
        );
    }

    // Si hay productos, los mostramos en una tabla
    return (
        <div className="product-list-container">
            <h3 className="list-title">Lista de Productos</h3>
            <table className="products-table">
                <thead className="table-header">
                    <tr>
                        <th className="table-th">ID</th>
                        <th className="table-th">Nombre</th>
                        <th className="table-th">Descripción</th>
                        <th className="table-th">Precio</th>
                        <th className="table-th">Stock</th>
                        {isAdmin && <th className="table-th">Acciones</th>}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {products.map(product => (
                        <tr key={product.id || Date.now() + Math.random()}>
                            <td className="table-td">{product.id}</td>
                            <td className="table-td">{product.nombre}</td>
                            <td className="table-td">{product.descripcion}</td>
                            <td className="table-td">${parseFloat(product.precio).toFixed(2)}</td>
                            <td className="table-td">{product.stock}</td>
                            {isAdmin && (
                                <td className="table-td actions-cell">
                                    <button onClick={() => onEdit(product)} className="action-button-edit"> <FaPenToSquare/></button> 
                                    <button onClick={() => onDelete(product.id)} className="action-button-delete"> <FaTrashAlt/></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Este componente es el formulario para crear o modificar un producto
const ProductForm = ({ onSubmit, onCancel, product }) => {
    const [formData, setFormData] = useState({
        id: product?.id || null,
        nombre: product?.nombre || '',
        descripcion: product?.descripcion || '',
        precio: product?.precio || '',
        stock: product?.stock || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Enviando datos del formulario:", formData);
        onSubmit(formData);
    };

    return (
        <div className="form-container">
            <h3 className="form-title">
                {product ? 'Modificar Producto' : 'Nuevo Producto'}
            </h3>
            <form onSubmit={handleSubmit} className="form-layout">
                <div className="form-field">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        className="form-textarea"
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="button-cancel"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="button-save"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

// Componente principal que gestiona la vista y los datos
export default function Productos() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [view, setView] = useState('list');

    // Aquí usamos useContext para obtener el valor de isLoggedIn y isAdmin
    const { isLoggedIn, isAdmin } = useAuth();

    // Función auxiliar para obtener el token de autorización
    const getAuthHeader = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // Función para obtener los productos del backend
    const fetchProducts = async () => {
        if (!isLoggedIn) {
            console.log('Usuario no autenticado, no se cargarán productos.');
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/productos/', {
                headers: getAuthHeader(),
            });
            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.status}`);
            }
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setProducts([]);
        }
    };

    // Usamos useEffect para cargar los productos al inicio o cuando el estado de autenticación cambie
    useEffect(() => {
        fetchProducts();
    }, [isLoggedIn]);

    // Lógica para crear un nuevo producto
    const handleCreate = async (newProduct) => {
        try {
            const res = await fetch('http://localhost:5000/api/productos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(newProduct),
            });
            if (!res.ok) {
                throw new Error(`Error al crear el producto: ${res.status}`);
            }
            await fetchProducts();
            setView('list');
        } catch (err) {
            console.error('Error al crear el producto:', err);
        }
    };

    // Lógica para actualizar un producto existente
    const handleUpdate = async (updatedProduct) => {
        try {
            const res = await fetch(`http://localhost:5000/api/productos/${updatedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(updatedProduct),
            });
            if (!res.ok) {
                throw new Error(`Error al actualizar el producto: ${res.status}`);
            }
            await fetchProducts();
            setEditingProduct(null);
            setView('list');
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
        }
    };

    // Lógica para eliminar un producto
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader()
                }
            });
            if (!res.ok) {
                throw new Error(`Error al eliminar el producto: ${res.status}`);
            }
            await fetchProducts();
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
        }
    };

    // Lógica para pasar al formulario de edición
    const handleEdit = (product) => {
        setEditingProduct(product);
        setView('form');
    };

    // Lógica para cancelar y volver a la lista
    const handleCancel = () => {
        setEditingProduct(null);
        setView('list');
    };

    // Renderizado del componente principal
    return (
        <div className="app-container">
            <div className="app-content-wrapper">
                <header className="app-header">
                    <h1 className="app-title">Gestión de Productos</h1>
                    {/* El botón de agregar solo se muestra para administradores y en la vista de lista */}
                    {isAdmin && view === 'list' && (
                        <button
                            onClick={() => setView('form')}
                            className="add-product-button"
                        >
                            <BsDatabaseFillAdd /> Agregar Producto
                        </button>
                    )}
                </header>

                {/* Mostramos la lista o el formulario según el estado 'view' */}
                {view === 'list' ? (
                    <ProductList
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isAdmin={isAdmin}
                    />
                ) : (
                    <ProductForm
                        product={editingProduct}
                        onSubmit={editingProduct ? handleUpdate : handleCreate}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
}