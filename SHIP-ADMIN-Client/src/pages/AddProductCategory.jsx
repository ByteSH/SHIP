import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, addCategoryWithUrl, addCategory } from '../api/category';
import { getProductsByCategory, addProductWithUrls, addProduct } from '../api/product';

function AddProductCategory() {
    const navigate = useNavigate();
    
    // Global Lists
    const [categories, setCategories] = useState([]);
    const [productsForCategory, setProductsForCategory] = useState([]);

    const [catName, setCatName] = useState('');
    const [catImageUrl, setCatImageUrl] = useState('');
    const [catImageMode, setCatImageMode] = useState('url'); // 'url' or 'file'
    const [catImageFile, setCatImageFile] = useState(null);
    const [catImagePreview, setCatImagePreview] = useState(null);
    const [isSubmittingCat, setIsSubmittingCat] = useState(false);
    const [catMessage, setCatMessage] = useState(null);

    // Product Form State
    const [prodForm, setProdForm] = useState({
        category: '',
        subCategory: '',
        productName: '',
        companyName: '',
        valueUnit: '',
        mrp: '',
        sellerMrp: '',
        purchaseMrp: '',
        imageUrls: ''
    });
    const [prodImageMode, setProdImageMode] = useState('url'); // 'url' or 'file'
    const [prodImageFiles, setProdImageFiles] = useState([]);
    const [prodImagePreviews, setProdImagePreviews] = useState([]);
    const [isSubmittingProd, setIsSubmittingProd] = useState(false);
    const [prodMessage, setProdMessage] = useState(null);

    // Initial Fetch Categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Memory-Safe Preview Renderers
    useEffect(() => {
        if (!catImageFile) {
            setCatImagePreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(catImageFile);
        setCatImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [catImageFile]);

    useEffect(() => {
        if (!prodImageFiles || prodImageFiles.length === 0) {
            setProdImagePreviews([]);
            return;
        }
        const objectUrls = Array.from(prodImageFiles).map(file => ({
             url: URL.createObjectURL(file),
             name: file.name
        }));
        setProdImagePreviews(objectUrls);
        
        return () => {
            objectUrls.forEach(obj => URL.revokeObjectURL(obj.url));
        };
    }, [prodImageFiles]);

    /**
     * Fetch all categories globally
     */
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    // Fetch products when category selection changes in prodForm
    useEffect(() => {
        /**
         * Fetch products if a category is selected constraint
         */
        const fetchProducts = async () => {
            if (!prodForm.category) {
                setProductsForCategory([]);
                return;
            }
            try {
                const data = await getProductsByCategory(prodForm.category);
                setProductsForCategory(data || []);
            } catch (err) {
                console.error('Failed to fetch products for validation', err);
            }
        };
        fetchProducts();
    }, [prodForm.category]);

    // Validation Flags
    const isCategoryDuplicate = categories.some(c => c.category && c.category.toLowerCase() === catName.trim().toLowerCase());

    /**
     * Wrapper logic to commit a new category
     */
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setCatMessage(null);
        if (isCategoryDuplicate) return;

        if (catImageMode === 'file' && catImageFile && catImageFile.size > 1024 * 1024) {
            setCatMessage({ type: 'danger', text: 'Error: Image file size must be strictly less than 1 MB.' });
            return;
        }
        if (catImageMode === 'file' && !catImageFile) {
            setCatMessage({ type: 'danger', text: 'Please select an image file.' });
            return;
        }
        
        setIsSubmittingCat(true);
        try {
            if (catImageMode === 'url') {
                await addCategoryWithUrl(catName.trim(), catImageUrl.trim());
            } else {
                await addCategory(catName.trim(), catImageFile);
            }

            setCatMessage({ type: 'success', text: 'Category successfully added!' });
            setCatName('');
            setCatImageUrl('');
            setCatImageFile(null);
            fetchCategories();
        } catch (err) {
            setCatMessage({ type: 'danger', text: 'Failed to add category. Try again.' });
        } finally {
            setIsSubmittingCat(false);
        }
    };

    const handleProductChange = (e) => {
        setProdForm({ ...prodForm, [e.target.name]: e.target.value });
    };

    /**
     * Logic dispatch to commit a newly formed product registry
     */
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setProdMessage(null);

        // Validation for File mode
        if (prodImageMode === 'file') {
            if (!prodImageFiles || prodImageFiles.length === 0) {
                setProdMessage({ type: 'danger', text: 'Please select at least one image file to upload.' });
                return;
            }
            for (let i = 0; i < prodImageFiles.length; i++) {
                if (prodImageFiles[i].size > 1024 * 1024) {
                    setProdMessage({ type: 'danger', text: `Error: Image file "${prodImageFiles[i].name}" exceeds 1 MB.` });
                    return;
                }
            }
        }

        setIsSubmittingProd(true);
        try {
            const payloadData = {
                category: prodForm.category,
                subCategory: prodForm.subCategory.trim(),
                productName: prodForm.productName.trim(),
                companyName: prodForm.companyName.trim(),
                valueUnit: prodForm.valueUnit.trim(),
                mrp: Number(prodForm.mrp),
                sellerMrp: Number(prodForm.sellerMrp),
                purchaseMrp: Number(prodForm.purchaseMrp)
            };

            if (prodImageMode === 'url') {
                const parsedUrls = prodForm.imageUrls.split(',').map(url => url.trim()).filter(url => url);
                payloadData.imageUrls = parsedUrls;
                await addProductWithUrls(payloadData);
            } else {
                await addProduct(payloadData, prodImageFiles);
            }

            setProdMessage({ type: 'success', text: 'Product successfully added!' });
            setProdForm({
                category: '',
                subCategory: '',
                productName: '',
                companyName: '',
                valueUnit: '',
                mrp: '',
                sellerMrp: '',
                purchaseMrp: '',
                imageUrls: ''
            });
            setProdImageFiles([]);
        } catch (err) {
            setProdMessage({ type: 'danger', text: 'Failed to add product. Check your inputs.' });
        } finally {
            setIsSubmittingProd(false);
        }
    };

    return (
        <div className="d-flex justify-content-center overflow-auto h-100 position-relative py-4" style={{ backgroundColor: '#F4F7FE', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            
            <button 
                onClick={() => navigate('/dashboard')} 
                className="btn position-absolute border-0 d-flex justify-content-center align-items-center shadow-sm" 
                style={{ top: '25px', left: '25px', width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#FFFFFF', zIndex: 100 }}
            >
                <i className="bi bi-arrow-left" style={{ color: '#4318FF', fontSize: '1.2rem', fontWeight: 'bold' }}></i>
            </button>

            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold m-0" style={{ color: '#2B3674' }}>Inventory Management</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Securely add new master categories and product SKUs.</p>
                </div>

                {/* --- ADD CATEGORY CARD --- */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                    <div className="p-4 px-5 border-bottom" style={{ backgroundColor: '#FFFFFF' }}>
                        <h5 className="fw-bold m-0" style={{ color: '#2B3674' }}><i className="bi bi-tags-fill me-2" style={{ color: '#4318FF' }}></i> Add New Category</h5>
                    </div>
                    <div className="p-5 bg-white">
                        <form onSubmit={handleAddCategory}>
                            {catMessage && <div className={`alert alert-${catMessage.type} py-2 px-3 small`} style={{ borderRadius: '10px' }}>{catMessage.text}</div>}

                            <div className="row g-4 align-items-start">
                                <div className="col-md-5">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Category Name</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${isCategoryDuplicate ? 'is-invalid' : ''}`}
                                        style={{ backgroundColor: '#F4F7FE', border: isCategoryDuplicate ? '2px solid #E31A1A' : 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} 
                                        placeholder="e.g. Protein, Vitamins..." 
                                        value={catName}
                                        onChange={(e) => setCatName(e.target.value)}
                                        list="category-options-list"
                                        autoComplete="off"
                                        required
                                    />
                                    <datalist id="category-options-list">
                                        {categories.map((c, idx) => (
                                            <option key={idx} value={c.category} />
                                        ))}
                                    </datalist>
                                    
                                    {isCategoryDuplicate && (
                                        <div className="invalid-feedback fw-bold mt-2" style={{ fontSize: '0.75rem' }}>
                                            ⚠️ This category already exists in the registry.
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-7">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-bold m-0" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Category Image</label>
                                        
                                        <div className="btn-group shadow-sm" role="group">
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm fw-bold ${catImageMode === 'url' ? 'active' : ''}`}
                                                style={{ fontSize: '0.7rem', backgroundColor: catImageMode === 'url' ? '#4318FF' : '#F4F7FE', color: catImageMode === 'url' ? 'white' : '#A3AED0', border: '1px solid #E9EDF7' }}
                                                onClick={() => { setCatImageMode('url'); setCatImageFile(null); }}
                                            ><i className="bi bi-link-45deg"></i> URL</button>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm fw-bold ${catImageMode === 'file' ? 'active' : ''}`}
                                                style={{ fontSize: '0.7rem', backgroundColor: catImageMode === 'file' ? '#4318FF' : '#F4F7FE', color: catImageMode === 'file' ? 'white' : '#A3AED0', border: '1px solid #E9EDF7' }}
                                                onClick={() => { setCatImageMode('file'); setCatImageUrl(''); }}
                                            ><i className="bi bi-file-earmark-arrow-up"></i> File</button>
                                        </div>
                                    </div>

                                    {catImageMode === 'url' ? (
                                        <input 
                                            type="url" 
                                            className="form-control" 
                                            style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} 
                                            placeholder="https://example.com/image.jpg" 
                                            value={catImageUrl}
                                            onChange={(e) => setCatImageUrl(e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="form-control" 
                                                style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} 
                                                onChange={(e) => setCatImageFile(e.target.files[0])}
                                                required
                                            />
                                            {catImagePreview && (
                                                <div className="mt-2">
                                                    <img src={catImagePreview} alt="Preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E9EDF7' }} title={catImageFile?.name} />
                                                </div>
                                            )}
                                            <div className="form-text mt-1 fw-bold" style={{ fontSize: '0.7rem', color: '#A3AED0' }}>Max file size parameter: 1 MB.</div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-4">
                                <button type="submit" className="btn px-4 py-2 fw-bold shadow-sm" disabled={isCategoryDuplicate || !catName || isSubmittingCat} style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '12px' }}>
                                    {isSubmittingCat ? 'Uploading...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- ADD PRODUCT CARD --- */}
                <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                    <div className="p-4 px-5 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ backgroundColor: '#FFFFFF' }}>
                        <h5 className="fw-bold m-0" style={{ color: '#2B3674' }}><i className="bi bi-box-seam-fill me-2" style={{ color: '#4318FF' }}></i> Add New Product SKU</h5>
                        
                        {/* Elevated Category Select */}
                        <div className="d-flex align-items-center gap-3">
                            <span className="fw-bold m-0" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Category:</span>
                            <select 
                                name="category"
                                className="form-select fw-bold shadow-sm"
                                style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.5rem 1rem', color: '#2B3674', minWidth: '180px' }} 
                                value={prodForm.category}
                                onChange={handleProductChange}
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map((c, i) => <option key={i} value={c.category}>{c.category}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="p-5 bg-white position-relative">
                        {!prodForm.category && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255,255,255,0.85)', zIndex: 10 }}>
                                <div className="text-center">
                                    <i className="bi bi-lock-fill" style={{ fontSize: '2rem', color: '#A3AED0' }}></i>
                                    <p className="fw-bold mt-2" style={{ color: '#2B3674' }}>Please select a Parent Category above to unlock form.</p>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleAddProduct}>
                            {prodMessage && <div className={`alert alert-${prodMessage.type} py-2 px-3 small`} style={{ borderRadius: '10px' }}>{prodMessage.text}</div>}

                            <div className="row g-4">
                                {/* Row 1 */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Product Name</label>
                                    <input type="text" name="productName" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} value={prodForm.productName} onChange={handleProductChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Company Name</label>
                                    <input type="text" name="companyName" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} value={prodForm.companyName} onChange={handleProductChange} list="company-opts" autoComplete="off" required />
                                    <datalist id="company-opts">
                                        {[...new Set(productsForCategory.map(p => p.companyName).filter(Boolean))].map((val, idx) => <option key={idx} value={val} />)}
                                    </datalist>
                                </div>
                                
                                {/* Row 2 */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Sub Category</label>
                                    <input type="text" name="subCategory" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} placeholder="e.g. Whey Isolate" value={prodForm.subCategory} onChange={handleProductChange} list="subcat-opts" autoComplete="off" required />
                                    <datalist id="subcat-opts">
                                        {[...new Set(productsForCategory.map(p => p.subCategory).filter(Boolean))].map((val, idx) => <option key={idx} value={val} />)}
                                    </datalist>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Value & Unit</label>
                                    <input type="text" name="valueUnit" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} placeholder="e.g. 1KG or 2.5LBS" value={prodForm.valueUnit} onChange={handleProductChange} required />
                                </div>
                                
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Standard MRP (₹)</label>
                                    <input type="number" step="0.01" name="mrp" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} value={prodForm.mrp} onChange={handleProductChange} required />
                                </div>

                                {/* Row 4 - Additional Pricing */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Purchase MRP (₹)</label>
                                    <input type="number" step="0.01" name="purchaseMrp" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} value={prodForm.purchaseMrp} onChange={handleProductChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Seller MRP (₹)</label>
                                    <input type="number" step="0.01" name="sellerMrp" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '0.8rem 1rem' }} value={prodForm.sellerMrp} onChange={handleProductChange} required />
                                </div>

                                {/* Row 5 - Images */}
                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-bold m-0" style={{ fontSize: '0.8rem', color: '#A3AED0' }}>Product Images</label>
                                        
                                        <div className="btn-group shadow-sm" role="group">
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm fw-bold ${prodImageMode === 'url' ? 'active' : ''}`}
                                                style={{ fontSize: '0.7rem', backgroundColor: prodImageMode === 'url' ? '#4318FF' : '#F4F7FE', color: prodImageMode === 'url' ? 'white' : '#A3AED0', border: '1px solid #E9EDF7' }}
                                                onClick={() => { setProdImageMode('url'); setProdImageFiles([]); }}
                                            ><i className="bi bi-link-45deg"></i> URL</button>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm fw-bold ${prodImageMode === 'file' ? 'active' : ''}`}
                                                style={{ fontSize: '0.7rem', backgroundColor: prodImageMode === 'file' ? '#4318FF' : '#F4F7FE', color: prodImageMode === 'file' ? 'white' : '#A3AED0', border: '1px solid #E9EDF7' }}
                                                onClick={() => { setProdImageMode('file'); setProdForm({...prodForm, imageUrls: ''}); }}
                                            ><i className="bi bi-images"></i> Device Files</button>
                                        </div>
                                    </div>

                                    {prodImageMode === 'url' ? (
                                        <>
                                            <textarea 
                                                name="imageUrls"
                                                className="form-control" 
                                                style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '1rem', minHeight: '100px' }} 
                                                placeholder="https://image1.jpg, https://image2.jpg" 
                                                value={prodForm.imageUrls}
                                                onChange={handleProductChange}
                                                required
                                            />
                                            <div className="form-text mt-2 fw-bold" style={{ fontSize: '0.75rem', color: '#A3AED0' }}><i className="bi bi-link-45deg"></i> Separate multiple high-resolution URLs using commas.</div>
                                        </>
                                    ) : (
                                        <>
                                            <input 
                                                type="file" 
                                                multiple
                                                accept="image/*"
                                                className="form-control" 
                                                style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '12px', padding: '1rem' }} 
                                                onChange={(e) => setProdImageFiles(e.target.files)}
                                                required
                                            />
                                            {prodImagePreviews.length > 0 && (
                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                    {prodImagePreviews.map((preview, idx) => (
                                                        <img key={idx} src={preview.url} alt={`Preview ${idx}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E9EDF7' }} title={preview.name} />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="form-text mt-1 fw-bold" style={{ fontSize: '0.7rem', color: '#A3AED0' }}>Select multiple files. Max size per file: 1 MB.</div>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                                <button type="submit" className="btn px-5 py-2 fw-bold shadow-sm" disabled={isSubmittingProd || !prodForm.category} style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '12px', letterSpacing: '0.5px' }}>
                                    {isSubmittingProd ? 'Uploading Database...' : 'Commit Product Registry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AddProductCategory;
