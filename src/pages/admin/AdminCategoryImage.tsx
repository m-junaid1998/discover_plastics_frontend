import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Image as ImageIcon, UploadCloud,
Layers, Sparkles, Pencil, X, RefreshCw} from "lucide-react";
import { useCategoryImage } from "../../hooks/useCategoryImage";
import { FormSelect } from "../../components/FormSelect";
import { Modal } from "../../components/Modal";

const schema = z.object({
  categoryName: z.string().min(1, "Category is Required"),
  subCategoryName: z.string().optional(),
  image: z.instanceof(File).optional(),
});

type FormSchema = z.infer<typeof schema>;

interface ModalState {
  isOpen: boolean;
  editingId: string | null;
  existingImageUrl: string | null;
}

const INITIAL_MODAL_STATE: ModalState = {
  isOpen: false,
  editingId: null,
  existingImageUrl: null,
};

const AdminCategoryImage = () => {
  const { categoriesList,isLoadingCategoriesList,categoryImages,
  isLoadingCategoryImages,isMutationLoading,uploadCategoryImage,
  updateCategoryImage,deleteCategoryImage } = useCategoryImage();

  const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL_STATE);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit,setValue,reset,control,setError,formState: { errors }} = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { categoryName: "", subCategoryName: "" },
  });

  const selectedCategory = useWatch({ control, name: "categoryName" });
  const selectedFile = useWatch({ control, name: "image" });

  const categoryOptions = useMemo(() =>
    categoriesList?.map((c: any) => ({
    label: c.categoryname, value: c.categoryname,
      })) || [],
    [categoriesList],
  );

  const availableSubs = useMemo(() =>
      categoriesList?.find((c: any) => c.categoryname === selectedCategory)
        ?.subCategories || [],
    [selectedCategory, categoriesList],
  );

  const subCategoryOptions = useMemo(() => {
    const formattedSubs = availableSubs.map((s: string) => ({
      label: s, value: s }));
    return [{ label: "None (Main Category)", value: "" }, ...formattedSubs];
  }, [availableSubs]);

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  const toggleModal = (img?: any) => {
    reset();
    setModalState( img ? { isOpen: true, editingId: img._id, existingImageUrl: img.imageUrl }
        : { ...INITIAL_MODAL_STATE, isOpen: true },
    );
    if (img) {
      setValue("categoryName", img.categoryName);
      setValue("subCategoryName", img.subCategoryName || "");
    }
  };

  const closeModal = () => {
    reset();
    setModalState(INITIAL_MODAL_STATE);
  };

  const handleRemoveImage = () => {
    setValue("image", undefined, { shouldValidate: true });
    if (modalState.existingImageUrl) {
      setModalState((prev) => ({ ...prev, existingImageUrl: null }));
    }
  };

  const onSubmit = async (data: FormSchema) => {
    if (!modalState.editingId && !data.image)
      return setError("image", { message: "Image is required" });
    const action = modalState.editingId
      ? updateCategoryImage(modalState.editingId, data)
      : uploadCategoryImage(data);
    if ((await action)?.success) closeModal();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCategoryImage(deleteId);
    setDeleteId(null);
  };

  const currentMediaUrl = previewUrl || modalState.existingImageUrl;
  const isEditing = Boolean(modalState.editingId);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[var(--color-accent-text)] uppercase mb-1">
            <Sparkles size={13} /> Studio Assets
          </div>
          <h1 className="text-base font-bold uppercase tracking-wider text-gray-800">
            Category Image Management
          </h1>
        </div>
        <button
          onClick={() => toggleModal()}
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Plus size={16} className="text-[var(--color-accent)]" />{" "}
          <span>Upload Asset</span>
        </button>
      </div>
      {isLoadingCategoryImages ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--color-muted)]">
          <span className="text-xs tracking-wider uppercase font-medium">
            Loading Assets...
          </span>
        </div>
      ) : categoryImages.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[var(--color-border)] rounded-2xl p-6">
          <ImageIcon
            className="mx-auto text-[var(--color-muted)] opacity-40 mb-3"
            size={36}
          />
          <p className="text-sm font-semibold text-[var(--color-text-dark)]">
            No Category Media Found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryImages.map((img: any) => (
            <div
              key={img._id}
              className="group bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all"
            >
              <div className="relative aspect-4/3 bg-[var(--color-card-bg)] overflow-hidden">
                <img src={img.imageUrl}  alt={img.categoryName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 right-2 flex gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={() => toggleModal(img)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl cursor-pointer shadow-md transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(img._id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl cursor-pointer shadow-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-[var(--color-border)] flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[var(--color-text-dark)] truncate">
                  {img.categoryName}
                </h3>
                {img.subCategoryName ? (
                  <span className="text-[10px] bg-[var(--color-card-bg)] text-[var(--color-accent-text)] px-2.5 py-1 rounded-full border border-[var(--color-border)] font-semibold flex items-center gap-1">
                    <Layers size={10} />
                    {img.subCategoryName}
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                    Main
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Asset"
        variant="danger"
        confirmText="Delete"
        description="Are you sure you want to delete this category image asset? This action cannot be undone."
      />

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={isEditing ? "Update Category Image" : "Upload Category Image"}
        variant="info"
        className="max-h-[80dvh]!"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <FormSelect
            label="Target Category"
            required
            placeholder={
              isLoadingCategoriesList ? "Loading..." : "Select Category"
            }
            options={categoryOptions}
            disabled={isLoadingCategoriesList}
            error={errors.categoryName?.message}
            {...register("categoryName", {
              onChange: () => setValue("subCategoryName", ""),
            })}
          />

          <FormSelect
            label="Sub-Category (Optional)"
            placeholder="Select Sub-Category"
            options={subCategoryOptions}
            disabled={!selectedCategory}
            {...register("subCategoryName")}
          />

          <div>
            <label
              className={`block font-bold text-[var(--color-text-dark)] uppercase tracking-wider mb-2 ${!isEditing ? "required" : ""}`}
            >
              Asset Media File
            </label>

            {currentMediaUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-inner flex items-center justify-center transition-all duration-300">
                <div
                  className="absolute inset-0 bg-cover bg-center blur-lg opacity-30 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${currentMediaUrl})` }}
                />

                <img
                  src={currentMediaUrl}
                  alt="Asset Preview"
                  className="relative w-full h-full object-cover rounded-xl"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 z-30 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all transform active:scale-90 hover:rotate-90 cursor-pointer backdrop-blur-xs"
                  title="Remove Asset"
                >
                  <X size={15} />
                </button>

                <label className="absolute inset-0 z-20 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:bg-slate-950/60">
                  <div className="p-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20 text-white shadow-md">
                    <RefreshCw size={18} className="animate-spin-slow" />
                  </div>
                  <span className="text-white text-[11px] font-bold tracking-wider uppercase drop-shadow-sm">
                    Replace Media File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      setValue("image", e.target.files[0], {
                        shouldValidate: true,
                      })
                    }
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-7 border-2 border-dashed border-slate-300 rounded-2xl bg-gradient-to-b from-slate-50/50 to-white hover:border-[var(--color-accent)] hover:bg-slate-50/80 cursor-pointer transition-all duration-300 group">
                <div className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 mb-2.5">
                  <UploadCloud
                    size={26}
                    className="text-[var(--color-accent-text)]"
                  />
                </div>
                <span className="font-bold text-slate-800 text-xs mb-1">
                  Click to browse file
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  SVG, PNG, JPG or WEBP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    setValue("image", e.target.files[0], {
                      shouldValidate: true,
                    })
                  }
                />
              </label>
            )}

            {errors.image && (
              <p className="text-[var(--color-danger)] text-[10px] mt-1.5 font-semibold">
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="submit"
              disabled={isMutationLoading}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98"
            >
              {isMutationLoading
                ? "Processing..."
                : isEditing
                  ? "Update Asset"
                  : "Upload Asset"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoryImage;
