import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getCategories,
    addCategoryWithUrl,
    addCategory,
    editCategory,
    deleteCategory
} from '../api/category';

const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    // Generic page level messages
    const [pageErrorMsg, setPageErrorMsg] = useState('');
    const [pageSuccessMsg, setPageSuccessMsg] = useState('');

    // Modal states
    const [activeModal, setActiveModal] = useState(null); // 'create', 'edit'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({});
    
    const [imageMode, setImageMode] = useState('url'); // 'url' or 'file' (only for Create)
    const [imageFile, setImageFile] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalErrorMsg, setModalErrorMsg] = useState('');

    /**
     * Loads categories from the backend server
     */
    const loadCategories = async () => {
        setIsFetching(true);
        setPageErrorMsg('');
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (err) {
            setPageErrorMsg(err.message || 'Error fetching categories list.');
            setCategories([]);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleOpenCreate = () => {
        setFormData({ name: '', imageUrl: '' });
        setImageMode('url');
        setImageFile(null);
        setActiveModal('create');
        setModalErrorMsg('');
        setPageSuccessMsg('');
        setPageErrorMsg('');
    };

    const handleOpenEdit = (cat) => {
        setSelectedCategory(cat);
        setFormData({
            name: cat.category || '',
            imageUrl: cat.imagePath || ''
        });
        setActiveModal('edit');
        setModalErrorMsg('');
        setPageSuccessMsg('');
        setPageErrorMsg('');
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        setSelectedCategory(null);
        setModalErrorMsg('');
    };

    /**
     * Handles adding a new category
     */
    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setModalErrorMsg('');
        try {
            const catName = formData.name.trim();
            
            if (imageMode === 'url') {
                await addCategoryWithUrl(catName, formData.imageUrl.trim());
            } else {
                if (!imageFile) throw new Error("Please select an image file.");
                await addCategory(catName, imageFile);
            }

            setPageSuccessMsg(`Category '${catName}' created successfully!`);
            setActiveModal(null);
            loadCategories(); 
        } catch (err) {
            setModalErrorMsg(err.message || 'Error occurred while creating the category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles updating an existing category
     */
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setModalErrorMsg('');
        try {
            await editCategory(selectedCategory.category, formData.name.trim(), formData.imageUrl.trim());

            setPageSuccessMsg(`Category updated successfully!`);
            setActiveModal(null);
            loadCategories();
        } catch (err) {
            setModalErrorMsg(err.message || 'Error updating category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles deleting an existing category confirmation
     */
    const handleDeleteCategory = async (cat) => {
        if (window.confirm(`Are you extremely sure you want to permanently delete Category: "${cat.category}" and ALL its linked constraints?`)) {
            try {
                await deleteCategory(cat.category);
                setPageSuccessMsg(`Category '${cat.category}' deleted successfully.`);
                setCategories(prev => prev.filter(c => c.category !== cat.category));
            } catch (err) {
                setPageErrorMsg(err.message || `Error deleting category '${cat.category}'.`);
            }
        }
    };

    const thStyle = { fontSize: '0.75rem', color: '#A3AED0', backgroundColor: '#F4F7FE', padding: '0.8rem 1rem', borderBottom: '2px solid #E9EDF7', whiteSpace: 'nowrap' };
    const tdStyle = { color: '#2B3674', fontWeight: '600', fontSize: '0.85rem', verticalAlign: 'middle', padding: '0.8rem 1rem' };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 overflow-hidden" style={{ backgroundColor: '#F4F7FE', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            {/* Modals */}
            {activeModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
                    <div className="card shadow border-0 overflow-hidden" style={{ width: '95%', maxWidth: '500px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                        <div className="d-flex justify-content-between p-3 border-bottom align-items-center">
                            <h5 className="fw-bold m-0" style={{ color: '#2B3674' }}>
                                {activeModal === 'create' ? 'Create New Category' : 'Edit Category'}
                            </h5>
                            <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center" onClick={handleCloseModal} style={{ backgroundColor: '#F4F7FE', borderRadius: '50%', width: '32px', height: '32px' }}>
                                <i className="bi bi-x-lg" style={{ color: '#4318FF', fontSize: '1rem', fontWeight: 'bold' }}></i>
                            </button>
                        </div>

                        <div className="p-4">
                            {modalErrorMsg && <div className="alert alert-danger py-2 px-3 mb-3 small fw-bold" style={{ borderRadius: '10px' }}>{modalErrorMsg}</div>}
                            
                            <form onSubmit={activeModal === 'create' ? handleSubmitCreate : handleSubmitEdit}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Category Name</label>
                                        <input type="text" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/>
                                    </div>
                                    
                                    {activeModal === 'create' && (
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <label className="fw-bold m-0" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Category Image</label>
                                                <div className="btn-group shadow-sm">
                                                    <button type="button" className={`btn btn-sm fw-bold ${imageMode === 'url' ? 'active' : ''}`} style={{ fontSize: '0.65rem', backgroundColor: imageMode === 'url' ? '#4318FF' : '#F4F7FE', color: imageMode === 'url' ? '#FFF' : '#A3AED0', border: '1px solid #E9EDF7' }} onClick={() => setImageMode('url')}>Link/URL</button>
                                                    <button type="button" className={`btn btn-sm fw-bold ${imageMode === 'file' ? 'active' : ''}`} style={{ fontSize: '0.65rem', backgroundColor: imageMode === 'file' ? '#4318FF' : '#F4F7FE', color: imageMode === 'file' ? '#FFF' : '#A3AED0', border: '1px solid #E9EDF7' }} onClick={() => setImageMode('file')}>Upload File</button>
                                                </div>
                                            </div>
                                            {imageMode === 'url' ? (
                                                <input type="url" className="form-control" placeholder="https://example.com/image.jpg" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} required />
                                            ) : (
                                                <input type="file" accept="image/*" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} onChange={(e) => setImageFile(e.target.files[0])} required />
                                            )}
                                        </div>
                                    )}

                                    {activeModal === 'edit' && (
                                        <div className="col-12">
                                            <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>New Image URL (Required Format)</label>
                                            <input type="url" className="form-control" placeholder="https://example.com/image.jpg" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} required />
                                        </div>
                                    )}

                                    <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                        <button type="button" className="btn px-4 bg-light shadow-sm fw-bold border-0" style={{ color: '#2B3674', borderRadius: '10px' }} onClick={handleCloseModal}>Cancel</button>
                                        <button type="submit" className="btn px-4 shadow-sm fw-bold" style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '10px' }} disabled={isSubmitting}>
                                            {isSubmitting ? 'Processing...' : (activeModal === 'create' ? 'Add Category' : 'Save Changes')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Page Layout */}
            <div
                className="card border-0 d-flex flex-column shadow-sm"
                style={{
                    width: '95%',
                    maxWidth: '1000px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '1.2rem',
                    maxHeight: '95vh',
                    overflow: 'hidden'
                }}
            >
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
                            <h4 className="fw-bold m-0" style={{ color: '#2B3674', fontSize: '1.3rem' }}>Categories Master</h4>
                            <p className="m-0 mt-1" style={{ fontSize: '0.8rem', color: '#A3AED0', fontWeight: '500' }}>Add, edit, or remove root catalogs</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-end">
                        <button
                            className="btn d-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm"
                            onClick={loadCategories}
                            disabled={isFetching}
                            style={{ backgroundColor: '#F4F7FE', color: '#4318FF', borderRadius: '10px', fontSize: '0.85rem' }}
                        >
                            <i className={`bi bi-arrow-clockwise ${isFetching ? 'spin' : ''}`}></i> Refresh
                        </button>
                        <button
                            className="btn d-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm"
                            onClick={handleOpenCreate}
                            style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '10px', fontSize: '0.85rem' }}
                        >
                            <i className="bi bi-plus-circle-fill text-white"></i> Add Category
                        </button>
                    </div>
                </div>

                {pageErrorMsg && <div className="alert alert-danger text-center py-1 px-3 mb-2 small fw-bold" style={{ borderRadius: '10px' }}>{pageErrorMsg}</div>}
                {pageSuccessMsg && <div className="alert alert-success text-center py-1 px-3 mb-2 small fw-bold" style={{ borderRadius: '10px' }}>{pageSuccessMsg}</div>}

                {isFetching ? (
                    <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                        <div className="spinner-border" style={{ color: '#4318FF' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : categories.length > 0 ? (
                    <div className="d-flex flex-column flex-grow-1 overflow-hidden mt-1">
                        <div className="table-responsive flex-grow-1" style={{ borderRadius: '12px', border: '1px solid #E9EDF7' }}>
                            <table className="table table-hover mb-0 align-middle">
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#F4F7FE' }}>
                                    <tr>
                                        <th style={{ ...thStyle, paddingLeft: '1rem', width: '80px' }}>Image</th>
                                        <th style={thStyle}>Category Name</th>
                                        <th style={{ ...thStyle, paddingRight: '1rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderTop: 'none' }}>
                                    {categories.map((cat, idx) => (
                                        <tr key={idx}>
                                            <td style={{ ...tdStyle, paddingLeft: '1rem' }}>
                                                {cat.imagePath ? (
                                                    <img src={`http://localhost:8080${cat.imagePath.startsWith('/') ? '' : '/'}${cat.imagePath}`} 
                                                         onError={(e) => { e.target.onerror = null; e.target.src = cat.imagePath; }} 
                                                         alt={cat.category} 
                                                         style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                                ) : (
                                                    <div className="d-flex justify-content-center align-items-center" style={{ width: '45px', height: '45px', backgroundColor: '#E9EDF7', borderRadius: '10px' }}>
                                                        <i className="bi bi-card-image text-secondary"></i>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-truncate fw-bold" style={{ ...tdStyle, color: '#2B3674' }}>{cat.category}</td>
                                            <td style={{ ...tdStyle, paddingRight: '1rem' }}>
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        onClick={() => handleOpenEdit(cat)}
                                                        className="btn btn-sm d-flex align-items-center justify-content-center shadow-sm"
                                                        style={{ backgroundColor: '#F4F7FE', color: '#4318FF', fontSize: '0.85rem', borderRadius: '8px', width: '32px', height: '32px' }}
                                                        title={`Edit ${cat.category}`}>
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat)}
                                                        className="btn btn-sm d-flex align-items-center justify-content-center shadow-sm"
                                                        style={{ backgroundColor: '#FFF0F0', color: '#E31A1A', fontSize: '0.85rem', borderRadius: '8px', width: '32px', height: '32px' }}
                                                        title={`Delete ${cat.category}`}>
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-grow-1 justify-content-center align-items-center flex-column text-center h-100">
                        <i className="bi bi-tags mb-3" style={{ fontSize: '3.5rem', color: '#E9EDF7' }}></i>
                        <p style={{ color: '#A3AED0', fontWeight: '500' }}>No categories found in the system.<br />Click 'Add Category' to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;
