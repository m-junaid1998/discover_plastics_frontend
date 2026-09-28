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
  name: "", categoryname: "", subCategory: "", stock: 0, regularPrice: 0,
  salePrice: 0, description: "", isPublished: true, isBestSeller: false,
  dimensions: { length: 0, width: 0, height: 0 },
};

const inputStyle = "w-full bg-card-bg border border-border focus:border-accent text-xs sm:text-sm text-text-dark rounded-md px-3 py-2.5 outline-none font-sans font-semibold transition-all placeholder:text-muted";
const labelStyle = "block text-[11px] font-bold text-muted uppercase tracking-wider mb-1 font-sans";

export const AdminProducts: React.FC = () => {
  const { params, setPage, handleSearch } = usePaginationParams({ pageSize: 4 });
  const { products, pagination, createProduct, updateProduct, deleteProduct, togglePublishStatus, isProductMutationLoading } = useProduct(params);
  const { categories } = useCategory({ isAllRecord: true });

  // Unified State to prevent multi-render overhead
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    editingProduct: any;
    deletingProduct: any;
    selectedIds: string[];
    existingImages: string[];
    newFiles: File[];
    filePreviews: string[];
    selectedColors: { name: string; hex: string }[];
    colorInput: string;
    pickerHex: string;
  }>({
    isOpen: false, editingProduct: null, deletingProduct: null, selectedIds: [],
    existingImages: [], newFiles: [], filePreviews: [], selectedColors: [], colorInput: "", pickerHex: "#000000"
  });

  const { register, handleSubmit, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [regPrice, salePrice, selectedCat] = watch(["regularPrice", "salePrice", "categoryname"]);
  const discount = useMemo(() => calculateDiscount(regPrice, salePrice), [regPrice, salePrice]);
  const subCategories = useMemo(() => categories.find((c: any) => c._id === selectedCat)?.subCategories || [], [categories, selectedCat]);
  const debouncedSearch = useMemo(() => debounce((val: string) => handleSearch(val), 400), [handleSearch]);

  const cleanupPreviews = useCallback(() => {
    modalState.filePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [modalState.filePreviews]);

  const openFormModal = useCallback((product?: any) => {
    cleanupPreviews();
    reset(product ? {
      ...product,
      categoryname: typeof product.categoryname === "object" ? product.categoryname._id : product.categoryname,
      subCategory: product.subCategory || "",
      isPublished: product.isPublished ?? true,
      isBestSeller: product.isBestSeller ?? false,
      dimensions: { length: product.dimensions?.length || 0, width: product.dimensions?.width || 0, height: product.dimensions?.height || 0 }
    } : DEFAULT_FORM_VALUES);

    const formattedColors = Array.isArray(product?.colors) 
      ? product.colors.map((c: any) => typeof c === "string" ? { name: c, hex: "#000000" } : c)
      : [];

    setModalState(prev => ({
      ...prev, isOpen: true, editingProduct: product || null, existingImages: product?.images || [],
      newFiles: [], filePreviews: [], selectedColors: formattedColors, colorInput: "", pickerHex: "#000000"
    }));
  }, [reset, cleanupPreviews]);

  const closeFormModal = useCallback(() => {
    cleanupPreviews();
    setModalState(prev => ({ ...prev, isOpen: false, editingProduct: null, newFiles: [], filePreviews: [], selectedColors: [] }));
  }, [cleanupPreviews]);

  const handleAddColor = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();

    const nameToUse = modalState.colorInput.trim() || modalState.pickerHex;
    if (!nameToUse) return;

    if (!modalState.selectedColors.some(c => c.name.toLowerCase() === nameToUse.toLowerCase())) {
      setModalState(prev => ({
        ...prev,
        selectedColors: [...prev.selectedColors, { name: nameToUse, hex: prev.pickerHex }],
        colorInput: ""
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const slotsLeft = 5 - (modalState.existingImages.length + modalState.newFiles.length);
    const files = Array.from(e.target.files).slice(0, slotsLeft);
    const previews = files.map(f => URL.createObjectURL(f));
    setModalState(prev => ({ ...prev, newFiles: [...prev.newFiles, ...files], filePreviews: [...prev.filePreviews, ...previews] }));
  };

  const onSubmit = async (data: any) => {
    validateEmptyObject({ name: data.name, categoryname: data.categoryname, description: data.description });
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, k === "dimensions" ? JSON.stringify(v) : String(v)));
    fd.append("colors", JSON.stringify(modalState.selectedColors.map(c => c.name)));

    modalState.existingImages.forEach(img => fd.append("images", img));
    modalState.newFiles.forEach(file => fd.append("images", file));

    const res = modalState.editingProduct ? await updateProduct(modalState.editingProduct._id, fd) : await createProduct(fd);
    if (res?.success) closeFormModal();
  };

  const isAllSel = products.length > 0 && products.every((p: any) => modalState.selectedIds.includes(p._id));
  const totalImages = modalState.existingImages.length + modalState.newFiles.length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider uppercase text-text-dark">PRODUCT MANAGEMENT</h1>
          <p className="text-sm text-muted">Total inventory items: <span className="font-bold text-accent">{pagination?.totalCount || 0}</span></p>
        </div>
        <button onClick={() => openFormModal()} className="bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4 text-accent" /> Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input onChange={(e) => debouncedSearch(e.target.value)} placeholder="Search catalog..." className="w-full bg-card-bg border border-border text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none" />
      </div>

      <div className="flex justify-between items-center bg-card-bg border border-border px-5 py-3 rounded-xl">
        <button onClick={() => setModalState(p => ({ ...p, selectedIds: isAllSel ? [] : products.map((item: any) => item._id) }))} className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
          {isAllSel ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4 text-muted" />} Select All ({products.length})
        </button>
        <button disabled={!modalState.selectedIds.length} onClick={() => togglePublishStatus(modalState.selectedIds).then(() => setModalState(p => ({ ...p, selectedIds: [] })))} className="bg-primary text-white text-xs font-bold uppercase px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer">
          Publish / Draft
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {products.map((p: any) => (
          <div key={p._id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative aspect-square bg-card-bg">
              <img src={p.images?.[0] || "/placeholder.png"} className={`w-full h-full object-cover ${!p.isPublished && "grayscale opacity-75"}`} alt="" />
              {p.isBestSeller && <span className="absolute top-2 left-2 bg-amber-500 text-white p-1 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> Best Seller</span>}
            </div>
            <div className="p-4 space-y-2">
              <h2 className="font-bold text-base text-text-dark truncate">{p.name}</h2>
              <p className="text-sm font-bold">PKR. {p.salePrice} <span className="line-through text-muted text-xs font-normal">PKR. {p.regularPrice}</span></p>
              <div className="pt-2 border-t border-border flex justify-between text-xs">
                <span className="text-success font-bold">{p.stock} In Stock</span>
                <div className="flex gap-2 text-muted">
                  <button onClick={() => togglePublishStatus(p._id)} className="cursor-pointer">{p.isPublished ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}</button>
                  <button onClick={() => openFormModal(p)} className="cursor-pointer"><Edit2 className="w-4 h-4 hover:text-accent" /></button>
                  <button onClick={() => setModalState(prev => ({ ...prev, deletingProduct: p }))} className="cursor-pointer"><Trash2 className="w-4 h-4 hover:text-danger" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination?.totalPages > 1 && <div className="flex justify-center"><Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setPage} /></div>}

      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-light border border-border rounded-xl w-full max-w-lg max-h-[85vh] no-scrollbar  overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h2 className="font-bold text-xl">{modalState.editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={closeFormModal} className="cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className={labelStyle}>Product Images (Max 5)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {modalState.existingImages.map((src, i) => (
                    <div key={i} className="relative w-12 h-12 border border-border rounded-md overflow-hidden">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setModalState(p => ({ ...p, existingImages: p.existingImages.filter((_, idx) => idx !== i) }))} className="absolute top-0.5 right-0.5 bg-primary/80 text-white rounded-full p-0.5 cursor-pointer"><X size={10} /></button>
                    </div>
                  ))}
                  {modalState.filePreviews.map((src, i) => (
                    <div key={i} className="relative w-12 h-12 border border-accent rounded-md overflow-hidden">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setModalState(p => ({ ...p, newFiles: p.newFiles.filter((_, idx) => idx !== i), filePreviews: p.filePreviews.filter((_, idx) => idx !== i) }))} className="absolute top-0.5 right-0.5 bg-primary/80 text-white rounded-full p-0.5 cursor-pointer"><X size={10} /></button>
                    </div>
                  ))}
                </div>
                {totalImages < 5 && (
                  <label className="border border-dashed border-border rounded-lg p-2.5 text-center bg-card-bg flex flex-col items-center justify-center cursor-pointer">
                    <Upload size={16} className="text-accent" />
                    <span className="text-[10px] font-bold text-accent uppercase">Upload ({totalImages}/5)</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div><label className={labelStyle}>Product Name</label><input className={inputStyle} {...register("name")} /></div>

              <div className="grid grid-cols-2 gap-2">
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div><label className={labelStyle}>Regular Price</label><input type="number" className={inputStyle} {...register("regularPrice")} /></div>
                <div><label className={labelStyle}>Sale Price</label><input type="number" className={inputStyle} {...register("salePrice")} /></div>
                <div><label className={labelStyle}>Discount</label><div className={`${inputStyle} flex items-center justify-center font-bold text-accent`}>{discount}</div></div>
                <div><label className={labelStyle}>Stock</label><input type="number" className={inputStyle} {...register("stock")} /></div>
              </div>

              <div>
                <label className={labelStyle}>Dimensions (L x W x H cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="L" className={inputStyle} {...register("dimensions.length")} />
                  <input type="number" placeholder="W" className={inputStyle} {...register("dimensions.width")} />
                  <input type="number" placeholder="H" className={inputStyle} {...register("dimensions.height")} />
                </div>
              </div>

              {/* Color Custom Naming Section */}
              <div>
                <label className={labelStyle}>Available Colors</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {modalState.selectedColors.map((color, idx) => (
                    <span key={idx} className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: color.hex }} />
                      {color.name}
                      <X size={12} className="cursor-pointer hover:text-red-500 ml-1" onClick={() => setModalState(p => ({ ...p, selectedColors: p.selectedColors.filter((_, i) => i !== idx) }))} />
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input type="color" value={modalState.pickerHex} onChange={(e) => setModalState(p => ({ ...p, pickerHex: e.target.value }))} className="w-10 h-10 rounded-md border border-border cursor-pointer p-1 bg-card-bg" title="Pick color" />
                  <input type="text" value={modalState.colorInput} onChange={(e) => setModalState(p => ({ ...p, colorInput: e.target.value }))} onKeyDown={handleAddColor} placeholder={`Type color name or press Add for ${modalState.pickerHex}`} className={inputStyle} />
                  <button type="button" onClick={handleAddColor} className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-md hover:bg-primary-hover shrink-0 cursor-pointer">Add</button>
                </div>
              </div>

              <div><label className={labelStyle}>Description</label><textarea rows={2} className={inputStyle} {...register("description")} /></div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between bg-card-bg p-3 rounded-lg border border-border">
                  <span className="text-xs font-bold uppercase">Published</span>
                  <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" {...register("isPublished")} />
                </div>
                <div className="flex items-center justify-between bg-card-bg p-3 rounded-lg border border-border">
                  <span className="text-xs font-bold uppercase flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /> Best Seller</span>
                  <input type="checkbox" className="w-4 h-4 accent-amber-500 cursor-pointer" {...register("isBestSeller")} />
                </div>
              </div>

              <button type="submit" disabled={isProductMutationLoading} className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase py-3 rounded-lg cursor-pointer">
                {isProductMutationLoading ? "Saving..." : modalState.editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Modal 
        isOpen={Boolean(modalState.deletingProduct)} 
        onClose={() => setModalState(p => ({ ...p, deletingProduct: null }))}
        onConfirm={async () => { if (modalState.deletingProduct && (await deleteProduct(modalState.deletingProduct._id))?.success) setModalState(p => ({ ...p, deletingProduct: null })); }} 
        title="Delete Product" variant="danger" confirmText="Delete" cancelText="Cancel" isLoading={isProductMutationLoading}
        description={<span>Are you sure you want to delete <strong>{modalState.deletingProduct?.name}</strong>?</span>}
      />
    </div>
  );
};

export default AdminProducts;