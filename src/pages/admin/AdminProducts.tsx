import React, { useMemo, useState, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, CheckSquare, Square, X, Upload, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProduct } from "../../hooks/useProduct";
import { useCategory } from "../../hooks/useCategory";
import { usePaginationParams } from "../../hooks/Pagination/usePaginationParams";
import { Pagination } from "../../components/Pagination";
import { debounce, validateEmptyObject, calculateDiscount } from "../../utils/helper";
import { Modal } from "../../components/Modal";

// Dynamic Zod Schema matching backend payload
const schema = z.object({
  name: z.string().min(1, "Name required"),
  categoryname: z.string().min(1, "Category required"),
  subCategory: z.string().optional().default(""),
  stock: z.coerce.number().min(0),
  regularPrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  description: z.string().min(1, "Description required"),
  isPublished: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  dimensions: z.object({
    length: z.coerce.number().min(0).default(0),
    width: z.coerce.number().min(0).default(0),
    height: z.coerce.number().min(0).default(0),
  }),
});

const DEFAULT_FORM_VALUES = {
  name: "",
  categoryname: "",
  subCategory: "",
  stock: 0,
  regularPrice: 0,
  salePrice: 0,
  description: "",
  isPublished: true,
  isBestSeller: false,
  dimensions: { length: 0, width: 0, height: 0 },
};

const inputStyle = "w-full bg-card-bg border border-border focus:border-accent text-xs sm:text-sm text-text-dark rounded-md px-3 py-2.5 sm:py-3 outline-none font-sans font-semibold transition-all placeholder:text-muted disabled:opacity-50 disabled:cursor-not-allowed";
const labelStyle = "block text-[11px] sm:text-xs font-bold text-muted uppercase tracking-wider mb-1 font-sans";

export const AdminProducts: React.FC = () => {
  const { params, setPage, handleSearch } = usePaginationParams({ pageSize: 4 });
  const { products, pagination, createProduct, updateProduct, deleteProduct, togglePublishStatus, isProductMutationLoading } = useProduct(params);
  const { categories } = useCategory({ isAllRecord: true });

  const [colorInput, setColorInput] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [state, setState] = useState({
    selectedIds: [] as string[],
    isFormModalOpen: false,
    editingProduct: null as any,
    deletingProduct: null as any,
    existingImages: [] as string[],
    newFiles: [] as File[],
    filePreviews: [] as string[],
  });

  const { register, handleSubmit, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [regPrice, salePrice, selectedCat] = watch(["regularPrice", "salePrice", "categoryname"]);

  const discount = useMemo(() => calculateDiscount(regPrice, salePrice), [regPrice, salePrice]);

  const subCategories = useMemo(() => {
    const matchedCategory = categories.find((c: any) => c._id === selectedCat);
    return matchedCategory?.subCategories || [];
  }, [categories, selectedCat]);

  const debouncedSearch = useMemo(() => debounce((val: string) => handleSearch(val), 400), [handleSearch]);

  const cleanupPreviews = useCallback(() => state.filePreviews.forEach((url) => URL.revokeObjectURL(url)), [state.filePreviews]);

  const openFormModal = (product?: any) => {
    cleanupPreviews();
    reset(
      product
        ? {
            ...product,
            categoryname: typeof product.categoryname === "object" ? product.categoryname._id : product.categoryname,
            subCategory: product.subCategory || "",
            isPublished: product.isPublished ?? true,
            isBestSeller: product.isBestSeller ?? false,
            dimensions: {
              length: product.dimensions?.length || 0,
              width: product.dimensions?.width || 0,
              height: product.dimensions?.height || 0,
            },
          }
        : DEFAULT_FORM_VALUES
    );

    setSelectedColors(Array.isArray(product?.colors) ? product.colors : []);
    setColorInput("");

    setState((prev) => ({
      ...prev,
      isFormModalOpen: true,
      editingProduct: product || null,
      existingImages: product?.images || [],
      newFiles: [],
      filePreviews: [],
    }));
  };

  const closeFormModal = () => {
    cleanupPreviews();
    setState((prev) => ({ ...prev, isFormModalOpen: false, editingProduct: null, newFiles: [], filePreviews: [] }));
    setSelectedColors([]);
  };

  const handleAddColor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = colorInput.trim();
      if (trimmed && !selectedColors.includes(trimmed)) {
        setSelectedColors([...selectedColors, trimmed]);
        setColorInput("");
      }
    }
  };

  const handleRemoveColor = (color: string) => {
    setSelectedColors(selectedColors.filter((c) => c !== color));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const availableSlots = 5 - (state.existingImages.length + state.newFiles.length);
    const files = Array.from(e.target.files).slice(0, availableSlots);
    const previews = files.map((f) => URL.createObjectURL(f));
    setState((prev) => ({ ...prev, newFiles: [...prev.newFiles, ...files], filePreviews: [...prev.filePreviews, ...previews] }));
  };

  const onSubmit = async (data: any) => {
    validateEmptyObject({ name: data.name, categoryname: data.categoryname, description: data.description });

    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === "dimensions") {
        fd.append("dimensions", JSON.stringify(v));
      } else {
        fd.append(k, String(v));
      }
    });

    // Append Colors Array
    fd.append("colors", JSON.stringify(selectedColors));

    // Append Images
    state.existingImages.forEach((img) => fd.append("images", img));
    state.newFiles.forEach((file) => fd.append("images", file));

    const res = state.editingProduct ? await updateProduct(state.editingProduct._id, fd) : await createProduct(fd);
    if (res?.success) closeFormModal();
  };

  const handleDeleteConfirm = async () => {
    if (!state.deletingProduct) return;
    const res = await deleteProduct(state.deletingProduct._id);
    if (res?.success) setState((prev) => ({ ...prev, deletingProduct: null }));
  };

  const isAllSel = products.length > 0 && products.every((p: any) => state.selectedIds.includes(p._id));
  const totalImages = state.existingImages.length + state.newFiles.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-sans font-extrabold tracking-wider uppercase text-text-dark">PRODUCT MANAGEMENT</h1>
          <p className="text-xs md:text-sm text-muted mt-1 font-sans">
            Manage catalog details (Total: <span className="font-bold text-accent">{pagination?.totalCount || 0}</span>)
          </p>
        </div>
        <button onClick={() => openFormModal()} className="bg-primary hover:bg-primary-hover text-white text-xs md:text-sm font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-sm font-sans cursor-pointer">
          <Plus className="w-4 h-4 text-accent" /> Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input onChange={(e) => debouncedSearch(e.target.value)} placeholder="Search for inventory products..." className="w-full bg-card-bg border border-border focus:border-accent text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none font-sans text-text-dark placeholder:text-muted" />
      </div>

      {/* Bulk Actions */}
      <div className="flex justify-between items-center bg-card-bg border border-border px-5 py-3.5 rounded-xl">
        <button onClick={() => setState((prev) => ({ ...prev, selectedIds: isAllSel ? [] : products.map((p: any) => p._id) }))} className="flex items-center gap-2.5 text-xs md:text-sm font-bold uppercase text-text-dark hover:text-accent font-sans cursor-pointer">
          {isAllSel ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4 text-muted" />} Select All ({products.length})
        </button>
        <button disabled={!state.selectedIds.length} onClick={() => togglePublishStatus(state.selectedIds).then(() => setState((prev) => ({ ...prev, selectedIds: [] })))} className={`text-xs font-bold uppercase px-4 py-2 rounded-lg font-sans ${state.selectedIds.length ? "bg-primary text-white hover:bg-primary-hover cursor-pointer" : "bg-card-bg text-muted border border-border cursor-not-allowed opacity-70"}`}>
          Publish / Draft
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {products.map((p: any) => (
          <div key={p._id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between relative">
            <div className="relative aspect-square bg-card-bg">
              <img src={p.images?.[0] || "/placeholder.png"} className={`w-full h-full object-cover ${!p.isPublished && "grayscale opacity-75"}`} alt={p.name} />
              
              {p.isBestSeller && (
                <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white p-1 rounded-md shadow flex items-center gap-1 text-[10px] font-bold uppercase">
                  <Star className="w-3 h-3 fill-current" /> Best Seller
                </span>
              )}

              <button onClick={() => setState((prev) => ({ ...prev, selectedIds: prev.selectedIds.includes(p._id) ? prev.selectedIds.filter((i) => i !== p._id) : [...prev.selectedIds, p._id] }))} className="absolute top-1.5 right-1.5 p-0.5 bg-primary/80 text-white rounded-md cursor-pointer">
                {state.selectedIds.includes(p._id) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-4 space-y-2 font-sans">
              <span className="text-xs font-bold uppercase text-accent block tracking-wider">{p.categoryname?.categoryname || p.categoryname}</span>
              <h2 className="font-serif font-bold text-base text-text-dark line-clamp-1">{p.name}</h2>
              <p className="text-sm font-bold text-text-dark">PKR. {p.salePrice} <span className="line-through text-muted text-xs font-normal">PKR. {p.regularPrice}</span></p>
              
              <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
                <span className="text-success font-bold">{p.stock} In Stock</span>
                <div className="flex gap-2.5 text-muted items-center">
                  <button onClick={() => togglePublishStatus(p._id)} className="p-1 cursor-pointer">{p.isPublished ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-muted" />}</button>
                  <button onClick={() => openFormModal(p)} className="p-1 hover:text-accent cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setState((prev) => ({ ...prev, deletingProduct: p }))} className="p-1 hover:text-danger cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {state.isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
          <div className="bg-bg-light border border-border rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar text-text-dark shadow-2xl">
            <div className="flex justify-between items-center border-b border-border pb-2.5">
              <h2 className="font-serif font-bold text-xl sm:text-2xl">{state.editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={closeFormModal} className="text-muted hover:text-text-dark p-1 cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Product Images Upload */}
              <div>
                <label className={labelStyle}>Product Images (Max 5)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {state.existingImages.map((src, i) => (
                    <div key={`ext-${i}`} className="relative w-12 h-12 border border-border rounded-md overflow-hidden">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setState((p) => ({ ...p, existingImages: p.existingImages.filter((_, idx) => idx !== i) }))} className="absolute top-0.5 right-0.5 bg-primary/80 text-white rounded-full p-0.5 cursor-pointer"><X size={10} /></button>
                    </div>
                  ))}
                  {state.filePreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative w-12 h-12 border border-accent rounded-md overflow-hidden">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setState((p) => ({ ...p, newFiles: p.newFiles.filter((_, idx) => idx !== i), filePreviews: p.filePreviews.filter((_, idx) => idx !== i) }))} className="absolute top-0.5 right-0.5 bg-primary/80 text-white rounded-full p-0.5 cursor-pointer"><X size={10} /></button>
                    </div>
                  ))}
                </div>
                {totalImages < 5 && (
                  <label className="border border-dashed border-border hover:border-accent rounded-lg p-2.5 text-center bg-card-bg flex flex-col items-center justify-center cursor-pointer">
                    <Upload size={16} className="text-accent mb-0.5" />
                    <span className="text-[10px] font-bold text-accent uppercase">Upload ({totalImages}/5)</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Product Name */}
              <div><label className={labelStyle}>Product Name</label><input className={inputStyle} {...register("name")} /></div>

              {/* Category & SubCategory */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={labelStyle}>Category</label>
                  <select className={inputStyle} {...register("categoryname")}>
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.categoryname}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Sub-Category</label>
                  <select className={inputStyle} disabled={!subCategories.length} {...register("subCategory")}>
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((s: string) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Stock & Prices */}
              <div className="grid grid-cols-4 gap-2">
                <div><label className={labelStyle}>Stock</label><input type="number" className={inputStyle} {...register("stock")} /></div>
                <div><label className={labelStyle}>Regular Price</label><input type="number" className={inputStyle} {...register("regularPrice")} /></div>
                <div><label className={labelStyle}>Sale Price</label><input type="number" className={inputStyle} {...register("salePrice")} /></div>
                <div><label className={labelStyle}>Discount</label><div className={`${inputStyle} flex items-center font-bold text-accent justify-center`}>{discount}</div></div>
              </div>

              {/* Dimensions */}
              <div>
                <label className={labelStyle}>Dimensions (Length x Width x Height in cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="Length" className={inputStyle} {...register("dimensions.length")} />
                  <input type="number" placeholder="Width" className={inputStyle} {...register("dimensions.width")} />
                  <input type="number" placeholder="Height" className={inputStyle} {...register("dimensions.height")} />
                </div>
              </div>

              {/* Available Colors (Color Picker + Input) */}
              <div>
                <label className={labelStyle}>Available Colors</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedColors.map((color) => (
                    <span key={color} className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-border shadow-xs" style={{ backgroundColor: color }} />
                      {color}
                      <X size={12} className="cursor-pointer hover:text-red-500 transition-colors ml-1" onClick={() => handleRemoveColor(color)} />
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <input
                      type="color"
                      value={colorInput.startsWith("#") ? colorInput : "#000000"}
                      onChange={(e) => {
                        const newHex = e.target.value;
                        setColorInput(newHex);
                        if (!selectedColors.includes(newHex)) {
                          setSelectedColors([...selectedColors, newHex]);
                        }
                      }}
                      className="w-10 h-10 rounded-md border border-border cursor-pointer bg-card-bg p-1 shadow-sm transition-all"
                      title="Pick a color"
                    />
                  </div>
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={handleAddColor}
                    placeholder="Type color name / hex & press Enter (e.g. Gold, #FF0000)"
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Description */}
              <div><label className={labelStyle}>Description</label><textarea rows={2} className={inputStyle} {...register("description")} /></div>

              {/* Status Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between bg-card-bg p-3 rounded-lg border border-border">
                  <span className="text-xs font-bold uppercase text-text-dark">Published</span>
                  <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" {...register("isPublished")} />
                </div>
                <div className="flex items-center justify-between bg-card-bg p-3 rounded-lg border border-border">
                  <span className="text-xs font-bold uppercase text-text-dark flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" /> Best Seller
                  </span>
                  <input type="checkbox" className="w-4 h-4 accent-amber-500 cursor-pointer" {...register("isBestSeller")} />
                </div>
              </div>

              <button type="submit" disabled={isProductMutationLoading} className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase py-3 rounded-lg transition-all cursor-pointer">
                {isProductMutationLoading ? "Saving..." : state.editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal 
        isOpen={Boolean(state.deletingProduct)} 
        onClose={() => setState((prev) => ({ ...prev, deletingProduct: null }))}
        onConfirm={handleDeleteConfirm} 
        title="Delete Product" 
        variant="danger" 
        confirmText="Delete" 
        cancelText="Cancel" 
        isLoading={isProductMutationLoading}
        description={<span>Are you sure you want to delete <strong className="text-slate-900">{state.deletingProduct?.name}</strong>?</span>}
      />
    </div>
  );
};

export default AdminProducts;