import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../api/category';
import { getProductsByCategory, deleteProduct, editProduct } from '../api/product';

function Product() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fetchedProducts, setFetchedProducts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Feature States for Table Filtering & Modal
    const [filterType, setFilterType] = useState('productName');
    const [filterValue, setFilterValue] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isEditingMode, setIsEditingMode] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    /**
     * Initializes categories natively from the global source
     */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data || []);
                if (data && data.length > 0) setSelectedCategory(data[0].category);
            } catch (err) {
                console.error(err);
                setErrorMsg('Could not fetch categories');
            }
        };
        fetchCategories();
    }, []);

    /**
     * Retrieves products associated with a specific category
     */
    const handleFetchProduct = async (e) => {
        if (e) e.preventDefault();
        if (!selectedCategory) return;
        setIsFetching(true);
        setErrorMsg('');
        setFetchedProducts([]);
        setFilterValue('');
        setSortConfig({ key: null, direction: 'ascending' });

        try {
            const data = await getProductsByCategory(selectedCategory);

            if (data && data.length > 0) {
                setFetchedProducts(data);
            } else {
                setErrorMsg('No products found for this category.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || 'Error fetching product details.');
        } finally {
            setIsFetching(false);
        }
    };

    /**
     * Dispatches delete logic against a singular product utilizing unique identifier
     */
    const handleDeleteProduct = async (uniqueId) => {
        if (!window.confirm(`Are you certain you wish to completely delete this product? (ID: ${uniqueId})`)) {
            return;
        }

        setIsFetching(true);
        setErrorMsg('');
        
        try {
            await deleteProduct(uniqueId);
            setFetchedProducts(prev => prev.filter(p => p.uniqueId !== uniqueId));
        } catch (err) {
            console.error('Error deleting product details:', err);
            setErrorMsg('System error encountered while deleting product.');
        } finally {
            setIsFetching(false);
        }
    };

    const sortedAndFilteredProducts = useMemo(() => {
        let filterableProducts = [...fetchedProducts];

        // Apply Dynamic Filter
        if (filterValue && filterType) {
            filterableProducts = filterableProducts.filter(p => {
                const val = p[filterType];
                return val && val.toString().toLowerCase().includes(filterValue.toLowerCase());
            });
        }

        // Apply Sorting
        if (sortConfig.key !== null) {
            filterableProducts.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();

                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filterableProducts;
    }, [fetchedProducts, sortConfig, filterValue, filterType]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const selectedCategoryData = categories.find(c => c.category === selectedCategory);

    const thStyle = {
        fontSize: '0.70rem',
        color: '#A3AED0',
        cursor: 'pointer',
        backgroundColor: '#F4F7FE',
        padding: '0.6rem 0.5rem',
        borderBottom: '2px solid #E9EDF7',
        whiteSpace: 'nowrap'
    };

    const tdStyle = {
        color: '#2B3674',
        fontWeight: '600',
        fontSize: '0.80rem',
        verticalAlign: 'middle',
        padding: '0.5rem 0.5rem'
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <i className="bi bi-arrow-down-up" style={{ fontSize: '0.60rem', color: '#D0D5DD', marginLeft: '3px' }}></i>;
        return sortConfig.direction === 'ascending'
            ? <i className="bi bi-arrow-up" style={{ fontSize: '0.65rem', color: '#4318FF', marginLeft: '3px' }}></i>
            : <i className="bi bi-arrow-down" style={{ fontSize: '0.65rem', color: '#4318FF', marginLeft: '3px' }}></i>;
    };

    // Open/Close Modal Handlers
    const handleOpenModal = (prod) => {
        setSelectedProductDetails(prod);
        setCurrentImageIndex(0);
    }

    const handleCloseModal = () => {
        setSelectedProductDetails(null);
        setCurrentImageIndex(0);
        setIsEditingMode(false);
    }

    const handleOpenEditModal = (prod) => {
        setEditForm({
            category: prod.category || '',
            subCategory: prod.subCategory || '',
            companyName: prod.companyName || '',
            productName: prod.productName || '',
            uniqueId: prod.uniqueId || '',
            valueUnit: prod.valueUnit || '',
            mrp: prod.mrp || '',
            purchaseMrp: prod.purchaseMrp || '',
            sellerMrp: prod.sellerMrp || '',
            imageUrls: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images.join(', ') : ''
        });
        setIsEditingMode(true);
        setSelectedProductDetails(prod);
        setCurrentImageIndex(0);
    }

    /**
     * Maps product modifications and submits PUT command securely payloaded to backend
     */
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        
        setIsSubmittingEdit(true);
        try {
            const uniqueId = editForm.uniqueId;
            const payloadData = {
                uniqueId: uniqueId,
                category: editForm.category.trim(),
                subCategory: editForm.subCategory.trim(),
                productName: editForm.productName.trim(),
                companyName: editForm.companyName.trim(),
                valueUnit: editForm.valueUnit.trim(),
                mrp: Number(editForm.mrp),
                sellerMrp: Number(editForm.sellerMrp),
                purchaseMrp: Number(editForm.purchaseMrp),
                imageUrls: editForm.imageUrls ? editForm.imageUrls.split(',').map(u => u.trim()).filter(Boolean) : []
            };

            const updatedProd = await editProduct(uniqueId, payloadData);
            
            setFetchedProducts(prev => prev.map(p => p.uniqueId === uniqueId ? updatedProd : p));
            setSelectedProductDetails(updatedProd);
            setIsEditingMode(false);
            setCurrentImageIndex(0);
        } catch(err) {
           console.error(err);
           alert('Failed to transmit form payload.');
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    // Carousel Image Nav
    const handleNextImage = () => {
        if (selectedProductDetails && selectedProductDetails.images) {
            setCurrentImageIndex(prev => (prev + 1) % selectedProductDetails.images.length);
        }
    };

    const handlePrevImage = () => {
        if (selectedProductDetails && selectedProductDetails.images) {
            setCurrentImageIndex(prev => (prev - 1 + selectedProductDetails.images.length) % selectedProductDetails.images.length);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 overflow-hidden" style={{ backgroundColor: '#F4F7FE', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* Pop-up Details Modal Overlay */}
            {selectedProductDetails && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
                    <div className="card shadow border-0 overflow-hidden" style={{ width: '95%', maxWidth: '950px', borderRadius: '15px', backgroundColor: '#FFFFFF' }}>
                        <div className="d-flex justify-content-between p-3 border-bottom align-items-center">
                            <h5 className="fw-bold m-0" style={{ color: '#2B3674' }}>Product Overview</h5>
                            <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center" onClick={handleCloseModal} style={{ backgroundColor: '#F4F7FE', borderRadius: '50%', width: '32px', height: '32px' }}>
                                <i className="bi bi-x-lg" style={{ color: '#4318FF', fontSize: '1rem', fontWeight: 'bold' }}></i>
                            </button>
                        </div>

                        <div className="row g-0">
                            {/* Left Column: Image Viewer */}
                            <div className="col-md-5 p-5 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#F4F7FE', borderRight: '1px solid #E9EDF7' }}>
                                <div className="position-relative d-flex justify-content-center align-items-center w-100 mb-3 p-4" style={{ height: '320px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E9EDF7', overflow: 'hidden' }}>
                                    {Array.isArray(selectedProductDetails.images) && selectedProductDetails.images.length > 1 && (
                                        <button
                                            className="btn btn-sm position-absolute start-0 ms-2 d-flex justify-content-center align-items-center"
                                            onClick={handlePrevImage}
                                            style={{ backgroundColor: '#FFF', color: '#4318FF', borderRadius: '50%', width: '35px', height: '35px', zIndex: 5, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                            <i className="bi bi-chevron-left fw-bold"></i>
                                        </button>
                                    )}

                                    <img
                                        src={Array.isArray(selectedProductDetails.images) && selectedProductDetails.images.length > 0 ? selectedProductDetails.images[currentImageIndex] : 'https://placehold.co/400x400/FFFFFF/A3AED0?text=No+Image'}
                                        alt="product zoom preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
                                    />

                                    {Array.isArray(selectedProductDetails.images) && selectedProductDetails.images.length > 1 && (
                                        <button
                                            className="btn btn-sm position-absolute end-0 me-2 d-flex justify-content-center align-items-center"
                                            onClick={handleNextImage}
                                            style={{ backgroundColor: '#FFF', color: '#4318FF', borderRadius: '50%', width: '35px', height: '35px', zIndex: 5, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                            <i className="bi bi-chevron-right fw-bold"></i>
                                        </button>
                                    )}
                                </div>

                                {/* Thumbnail Navigation Tabs */}
                                {Array.isArray(selectedProductDetails.images) && selectedProductDetails.images.length > 1 && (
                                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                                        {selectedProductDetails.images.map((url, idx) => (
                                            <img
                                                key={idx}
                                                src={url}
                                                alt={`thumb-${idx}`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                style={{
                                                    width: '55px',
                                                    height: '55px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    border: currentImageIndex === idx ? '2px solid #4318FF' : '1px solid #E9EDF7',
                                                    opacity: currentImageIndex === idx ? 1 : 0.5,
                                                    boxShadow: currentImageIndex === idx ? '0 2px 5px rgba(0,0,0,0.15)' : 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                {Array.isArray(selectedProductDetails.images) && selectedProductDetails.images.length === 0 && (
                                    <span style={{ fontSize: '0.8rem', color: '#A3AED0' }}>No image files available.</span>
                                )}
                            </div>

                            {/* Right Column: Data Attributes & Edit Config Overlay */}
                            <div className="col-md-7 p-4" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                     <h6 className="fw-bold m-0" style={{ color: '#2B3674' }}>{isEditingMode ? 'Modify Product Parameters' : 'Attributes & Details'}</h6>
                                     {!isEditingMode && (
                                         <button className="btn btn-sm d-flex align-items-center shadow-sm fw-bold" onClick={() => handleOpenEditModal(selectedProductDetails)} style={{ backgroundColor: '#2B3674', color: '#FFF', borderRadius: '8px' }}>
                                            <i className="bi bi-pencil-square me-2"></i> Edit Mode
                                         </button>
                                     )}
                                </div>

                                {isEditingMode ? (
                                    <form onSubmit={handleUpdateProduct}>
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Category</label>
                                                <input type="text" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.category || ''} onChange={(e) => setEditForm({...editForm, category: e.target.value})} required/>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Sub Category</label>
                                                <input type="text" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.subCategory || ''} onChange={(e) => setEditForm({...editForm, subCategory: e.target.value})} required/>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Company Name</label>
                                                <input type="text" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.companyName || ''} onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} required/>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Product Name</label>
                                                <input type="text" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.productName || ''} onChange={(e) => setEditForm({...editForm, productName: e.target.value})} required/>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Unique ID (unchangeable)</label>
                                                <input type="text" className="form-control" style={{ backgroundColor: '#E9EDF7', border: 'none', borderRadius: '10px', fontSize: '0.85rem', color: '#A3AED0' }} value={editForm?.uniqueId || ''} readOnly title="Unique ID parameters cannot be manually mapped here."/>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Value / Unit Details</label>
                                                <input type="text" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.valueUnit || ''} onChange={(e) => setEditForm({...editForm, valueUnit: e.target.value})} required/>
                                            </div>
                                            <div className="col-sm-4">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Base MRP (₹)</label>
                                                <input type="number" step="0.01" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.mrp || ''} onChange={(e) => setEditForm({...editForm, mrp: e.target.value})} required/>
                                            </div>
                                            <div className="col-sm-4">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Purchase MRP (₹)</label>
                                                <input type="number" step="0.01" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.purchaseMrp || ''} onChange={(e) => setEditForm({...editForm, purchaseMrp: e.target.value})} required/>
                                            </div>
                                            <div className="col-sm-4">
                                                <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Seller MRP (₹)</label>
                                                <input type="number" step="0.01" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={editForm?.sellerMrp || ''} onChange={(e) => setEditForm({...editForm, sellerMrp: e.target.value})} required/>
                                            </div>

                                            <div className="col-12 mt-4">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <label className="fw-bold m-0" style={{ fontSize: '0.75rem', color: '#2B3674' }}>Modify Image URLs</label>
                                                </div>
                                                <textarea className="form-control" rows={3} style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} placeholder="Provide comma-separated URLs..." value={editForm?.imageUrls || ''} onChange={(e) => setEditForm({...editForm, imageUrls: e.target.value})}></textarea>
                                                <div className="form-text mt-1 fw-bold" style={{ fontSize: '0.65rem', color: '#A3AED0' }}><i className="bi bi-info-circle-fill me-1"></i> Use commas to separate multiple image links. Leaving this blank clears active graphics.</div>
                                            </div>

                                            <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                                <button type="button" className="btn px-4 bg-light shadow-sm fw-bold border-0" style={{ color: '#2B3674', borderRadius: '10px' }} onClick={() => setIsEditingMode(false)}>Terminate Process</button>
                                                <button type="submit" className="btn px-4 shadow-sm fw-bold" style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '10px' }} disabled={isSubmittingEdit}>
                                                    {isSubmittingEdit ? 'Executing Call...' : 'Save Data Package'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="row g-4">
                                        {[
                                            { label: 'Category', val: selectedProductDetails.category },
                                            { label: 'Sub Category', val: selectedProductDetails.subCategory },
                                            { label: 'Company Name', val: selectedProductDetails.companyName },
                                            { label: 'Product Name', val: selectedProductDetails.productName },
                                            { label: 'Unique ID', val: selectedProductDetails.uniqueId },
                                            { label: 'Value/Unit', val: selectedProductDetails.valueUnit },
                                            { label: 'Standard MRP', val: selectedProductDetails.mrp ? `₹${selectedProductDetails.mrp}` : '-' },
                                            { label: 'Purchase MRP', val: selectedProductDetails.purchaseMrp ? `₹${selectedProductDetails.purchaseMrp}` : '-' },
                                            { label: 'Seller MRP', val: selectedProductDetails.sellerMrp ? `₹${selectedProductDetails.sellerMrp}` : '-' }
                                        ].map((item, idx) => (
                                            <div className="col-sm-6" key={idx}>
                                                <p className="m-0 text-uppercase fw-bold" style={{ fontSize: '0.65rem', color: '#A3AED0' }}>{item.label}</p>
                                                <div className="m-0 pt-1" style={{ fontSize: '0.90rem', color: '#2B3674', borderBottom: '1px solid #E9EDF7', paddingBottom: '0.3rem', fontWeight: '500', wordWrap: 'break-word', whiteSpace: 'normal' }}>{item.val || '-'}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="card border-0 d-flex flex-column shadow-sm"
                style={{
                    width: '98%',
                    maxWidth: '1600px', // Wider table support to prevent scrolling
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '1.2rem',
                    maxHeight: '98vh',
                    overflow: 'hidden'
                }}
            >
                {/* Header & Category Search inline */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 flex-shrink-0 gap-3">
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            className="btn rounded-circle d-flex justify-content-center align-items-center border-0 me-3"
                            onClick={() => navigate('/dashboard')}
                            style={{ width: '38px', height: '38px', backgroundColor: '#F4F7FE' }}
                        >
                            <i className="bi bi-arrow-left" style={{ color: '#4318FF', fontSize: '1.1rem', fontWeight: 'bold' }}></i>
                        </button>
                        <div>
                            <h4 className="fw-bold m-0" style={{ color: '#2B3674', fontSize: '1.3rem' }}>Product Database</h4>
                            <p className="m-0 mt-1" style={{ fontSize: '0.8rem', color: '#A3AED0', fontWeight: '500' }}>Retrieve and Filter details</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center flex-wrap gap-3 justify-content-end">
                        <form onSubmit={handleFetchProduct} className="d-flex align-items-center m-0 gap-3">
                            {selectedCategoryData && selectedCategoryData.imagePath && (
                                <img
                                    src={selectedCategoryData.imagePath}
                                    alt="category"
                                    style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select fw-bold shadow-sm"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{
                                        backgroundColor: '#F4F7FE',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.85rem',
                                        color: '#2B3674',
                                        minWidth: '180px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((c, i) => (
                                        <option key={i} value={c.category}>{c.category}</option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="btn fw-bold px-4 flex-shrink-0 shadow-sm"
                                    style={{
                                        borderRadius: '10px',
                                        backgroundColor: '#4318FF',
                                        color: '#FFFFFF',
                                        fontSize: '0.85rem'
                                    }}
                                    disabled={isFetching || !selectedCategory}
                                >
                                    {isFetching ? 'Fetching...' : 'Fetch'}
                                </button>
                            </div>
                        </form>

                        {/* New Add Product Button */}
                        <div style={{ width: '2px', height: '30px', backgroundColor: '#E9EDF7', margin: '0 5px' }}></div>
                        <button
                            className="btn d-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm"
                            onClick={() => alert('Navigate to Add Product flow')}
                            style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '10px', fontSize: '0.85rem' }}
                        >
                            <i className="bi bi-plus-lg text-white"></i> Add Product
                        </button>
                    </div>
                </div>

                {errorMsg && <div className="alert alert-danger text-center py-1 px-3 mb-2 small" style={{ borderRadius: '10px' }}>{errorMsg}</div>}

                {/* The Extracted Table Layout */}
                {fetchedProducts.length > 0 ? (
                    <div className="d-flex flex-column flex-grow-1 overflow-hidden">

                        {/* Interactive Toolbar for Filtering Config */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 px-1">
                            <div className="d-flex align-items-center gap-2">
                                <span style={{ fontSize: '0.80rem', color: '#A3AED0', fontWeight: 'bold' }}>Filter By:</span>
                                <select
                                    className="form-select form-select-sm fw-bold shadow-none"
                                    style={{ width: '150px', borderRadius: '8px', border: '1px solid #E9EDF7', color: '#2B3674', fontSize: '0.8rem' }}
                                    value={filterType}
                                    onChange={e => setFilterType(e.target.value)}
                                >
                                    <option value="productName">Product Name</option>
                                    <option value="companyName">Company Name</option>
                                    <option value="subCategory">Sub Category</option>
                                    <option value="uniqueId">Unique ID</option>
                                </select>
                                <input
                                    type="text"
                                    className="form-control form-control-sm shadow-none fw-semibold"
                                    placeholder={`Type value...`}
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                    style={{
                                        width: '220px',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E9EDF7',
                                        color: '#707EAE',
                                        fontSize: '0.8rem'
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#A3AED0' }}><i className="bi bi-info-circle me-1"></i>Found {sortedAndFilteredProducts.length} entries</span>
                        </div>

                        {/* Dense Data Table Container (Uncapped horizontal space) */}
                        <div className="table-responsive flex-grow-1" style={{ borderRadius: '12px', border: '1px solid #E9EDF7' }}>
                            <table className="table table-hover mb-0 align-middle">
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#F4F7FE' }}>
                                    <tr>
                                        <th style={{ ...thStyle, paddingLeft: '1rem' }} onClick={() => requestSort('subCategory')}>Sub Category <SortIcon columnKey="subCategory" /></th>
                                        <th style={thStyle} onClick={() => requestSort('companyName')}>Company <SortIcon columnKey="companyName" /></th>
                                        <th style={thStyle} onClick={() => requestSort('productName')}>Product Name <SortIcon columnKey="productName" /></th>
                                        <th style={thStyle} onClick={() => requestSort('uniqueId')}>Unique ID <SortIcon columnKey="uniqueId" /></th>
                                        <th style={thStyle} onClick={() => requestSort('valueUnit')}>Value/Unit <SortIcon columnKey="valueUnit" /></th>
                                        <th style={thStyle} onClick={() => requestSort('mrp')}>MRP <SortIcon columnKey="mrp" /></th>
                                        <th style={thStyle} onClick={() => requestSort('purchaseMrp')}>P-MRP <SortIcon columnKey="purchaseMrp" /></th>
                                        <th style={thStyle} onClick={() => requestSort('sellerMrp')}>S-MRP <SortIcon columnKey="sellerMrp" /></th>
                                        <th style={{ ...thStyle, cursor: 'default' }}>Image</th>
                                        <th style={{ ...thStyle, cursor: 'default', paddingRight: '1rem' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderTop: 'none' }}>
                                    {sortedAndFilteredProducts.map((prod, idx) => (
                                        <tr key={idx}>
                                            <td style={{ ...tdStyle, paddingLeft: '1rem' }} title={prod.subCategory || '-'}>{prod.subCategory || '-'}</td>
                                            <td style={tdStyle} title={prod.companyName || '-'}>{prod.companyName || '-'}</td>
                                            <td className="text-truncate" style={{ ...tdStyle, maxWidth: '200px' }} title={prod.productName || '-'}>{prod.productName || '-'}</td>
                                            <td className="text-truncate" style={{ ...tdStyle, maxWidth: '150px' }} title={prod.uniqueId || '-'}>{prod.uniqueId || '-'}</td>
                                            <td style={tdStyle} title={prod.valueUnit || '-'}>{prod.valueUnit || '-'}</td>
                                            <td style={tdStyle} title={prod.mrp !== undefined ? `₹${prod.mrp}` : '-'}>{prod.mrp !== undefined ? `₹${prod.mrp}` : '-'}</td>
                                            <td style={tdStyle} title={prod.purchaseMrp !== undefined ? `₹${prod.purchaseMrp}` : '-'}>{prod.purchaseMrp !== undefined ? `₹${prod.purchaseMrp}` : '-'}</td>
                                            <td style={tdStyle} title={prod.sellerMrp !== undefined ? `₹${prod.sellerMrp}` : '-'}>{prod.sellerMrp !== undefined ? `₹${prod.sellerMrp}` : '-'}</td>
                                            <td style={tdStyle}>
                                                <img
                                                    src={(prod.images && prod.images.length > 0) ? prod.images[0] : 'https://placehold.co/40x40/E9EDF7/A3AED0?text=None'}
                                                    alt="prod"
                                                    title="Open Details to View"
                                                    style={{ width: '35px', height: '35px', borderRadius: '6px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td style={{ ...tdStyle, paddingRight: '1rem' }}>
                                                <div className="d-flex gap-2 justify-content-start">
                                                    <button
                                                        onClick={() => handleOpenModal(prod)}
                                                        className="btn btn-sm d-flex align-items-center justify-content-center"
                                                        style={{ backgroundColor: '#4318FF', color: '#FFF', fontSize: '0.75rem', borderRadius: '8px', minWidth: '60px' }}>
                                                        Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEditModal(prod)}
                                                        className="btn btn-sm d-flex align-items-center justify-content-center"
                                                        style={{ backgroundColor: '#2B3674', color: '#FFF', fontSize: '0.75rem', borderRadius: '8px' }}
                                                        title={`Edit ${prod.uniqueId}`}>
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(prod.uniqueId)}
                                                        className="btn btn-sm d-flex align-items-center justify-content-center"
                                                        style={{ backgroundColor: '#E31A1A', color: '#FFF', fontSize: '0.75rem', borderRadius: '8px' }}
                                                        title={`Delete ${prod.uniqueId}`}>
                                                        <i className="bi bi-trash3-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedAndFilteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="11" className="text-center py-4" style={{ color: '#A3AED0', fontSize: '0.9rem' }}>
                                                No products found matching the criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-grow-1 justify-content-center align-items-center flex-column text-center h-100 placeholder-container">
                        <i className="bi bi-table mb-3" style={{ fontSize: '3.5rem', color: '#E9EDF7' }}></i>
                        <p style={{ color: '#A3AED0', fontWeight: '500' }}>Select a category above and click <b>Fetch</b><br />to load the data table natively.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Product;