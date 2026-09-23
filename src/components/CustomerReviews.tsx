import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, MessageSquare, User, Tag, Trash2, X, Image as ImageIcon } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { Pagination } from "../components/Pagination";
import { useReview } from "../hooks/useReview";
import { usePaginationParams } from "../hooks/Pagination/usePaginationParams";
import { validateEmptyObject } from "../utils/helper";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a star rating").max(5),
  name: z.string().optional(),
  title: z.string().optional(),
  comment: z.string().min(1, "Review comment is required"),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface CustomerReviewsProps {
  productId: string;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ productId }) => {
  const authUser = useSelector((state: any) => state.auth?.user);
  const guestId = useSelector((state: any) => state.guest?.guestId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  const { params, setPage } = usePaginationParams({ pageSize: 5, currentPage: 1 });
  const {
    reviews = [],
    reviewsCount = 0,
    isLoadingReviews,
    isReviewMutationLoading,
    createReview,
    deleteReviewByUser,
    deleteReviewByAdmin,
  } = useReview(productId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      name: authUser?.name || "",
      title: "",
      comment: "",
    },
  });

  const currentPage = params.currentPage || 1;
  const pageSize = params.pageSize || 5;
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const totalPages = Math.ceil(safeReviews.length / pageSize);
  const paginatedReviews = safeReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const avg = reviewsCount
    ? (safeReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviewsCount).toFixed(1)
    : "0.0";

  // Photo Select Handlers
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedPhotos.length + filesArray.length > 4) {
        alert("Maximum 4 photos allowed per review.");
        return;
      }
      setSelectedPhotos((prev) => [...prev, ...filesArray]);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReviewForm) => {
    const reviewPayload = {
      ...data,
      name: data.name?.trim() || authUser?.name || "Guest User",
      ...(selectedPhotos.length > 0 && { photos: selectedPhotos }),
    };

    const validatedData = validateEmptyObject(reviewPayload);
    const res = await createReview(productId, validatedData);

    if (res?.success) {
      reset();
      setSelectedPhotos([]);
      setIsFormOpen(false);
      setHoverRating(0);
      setPage(1);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (authUser?.role === "admin") {
      await deleteReviewByAdmin(reviewId);
    } else {
      await deleteReviewByUser(reviewId);
    }
  };

  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= count
              ? "text-[var(--color-accent)] fill-[var(--color-accent)]"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full py-6 font-sans text-[var(--color-text-dark)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-dark)] mb-1">
            Customer Reviews
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
            {renderStars(Math.round(Number(avg)))}
            <span className="font-bold text-[var(--color-text-dark)]">
              {avg} out of 5
            </span>
            <span>({reviewsCount} reviews)</span>
          </div>
        </div>

        <Button
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="w-full sm:w-auto !py-2.5 !px-5 text-xs font-bold uppercase tracking-wider rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all cursor-pointer"
        >
          {isFormOpen ? "Cancel" : "Write a review"}
        </Button>
      </div>

      <div className="space-y-2 max-w-lg">
        {[5, 4, 3, 2, 1].map((s) => {
          const count = safeReviews.filter((r: any) => r.rating === s).length;
          const percentage = reviewsCount ? (count / reviewsCount) * 100 : 0;
          return (
            <div
              key={s}
              className="flex items-center gap-2 sm:gap-3 text-xs text-[var(--color-muted)] font-medium"
            >
              <span className="w-10 shrink-0">{s} star</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-[var(--color-border)]">
                <div
                  className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-4 text-right font-bold text-[var(--color-text-dark)]">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 rounded-3xl bg-white border border-[var(--color-border)] shadow-xl space-y-4"
        >
          <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-text-dark)]">
            Share your experience
          </h3>

          {/* Rating Field */}
          <div>
            <label className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider block mb-1">
              Your Rating
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div
                  className="flex gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => field.onChange(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      className="cursor-pointer transition-colors p-0.5"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= (hoverRating || field.value)
                            ? "text-[var(--color-accent)] fill-[var(--color-accent)]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-[10px] font-bold text-red-500 mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Your Name (Optional)"
              placeholder={authUser?.name || "Guest User"}
              {...register("name")}
              error={errors.name?.message}
              leftIcon={<User className="w-4 h-4 text-[var(--color-muted)]" />}
              className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]"
            />
            <FormInput
              label="Review Title (Optional)"
              placeholder="e.g. Excellent Product!"
              {...register("title")}
              error={errors.title?.message}
              leftIcon={<Tag className="w-4 h-4 text-[var(--color-muted)]" />}
              className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider block mb-1">
              Comment
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Tell us what you loved..."
                {...register("comment")}
                className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-dark)] focus:outline-none focus:border-[var(--color-primary)] resize-y"
              />
              <MessageSquare className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-3" />
            </div>
            {errors.comment && (
              <p className="text-[10px] font-bold text-red-500 mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>

          {/* Photo Attachments UI */}
          <div>
            <label className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider block mb-2">
              Attach Photos (Max 4)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {selectedPhotos.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--color-border)] group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-black transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedPhotos.length < 4 && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-[var(--color-card-bg)]">
                  <ImageIcon className="w-5 h-5 text-[var(--color-muted)]" />
                  <span className="text-[9px] text-[var(--color-muted)] font-medium mt-0.5">
                    Add
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isReviewMutationLoading}
              className="w-full sm:w-auto !py-3 !px-6 text-xs font-bold rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-50 cursor-pointer"
            >
              {isReviewMutationLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      )}

      {isLoadingReviews ? (
        <div className="py-8 text-center text-xs text-[var(--color-muted)]">
          Loading reviews...
        </div>
      ) : paginatedReviews.length === 0 ? (
        <div className="py-8 text-center text-xs text-[var(--color-muted)] border-t border-[var(--color-border)]">
          No reviews yet. Be the first to write one!
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {paginatedReviews.map((rev: any) => {
            const isOwner =
              (authUser &&
                rev.user &&
                rev.user === (authUser._id || authUser.id)) ||
              (guestId && rev.guestId && rev.guestId === guestId);
            const isAdmin = authUser?.role === "admin";
            const canDelete = isOwner || isAdmin;

            const initials = rev.name
              ? rev.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
              : "GU";

            const formattedDate = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : rev.date;

            return (
              <div
                key={rev._id || rev.id}
                className="py-4 sm:py-5 flex gap-3 sm:gap-4"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="text-xs font-bold text-[var(--color-text-dark)]">
                      {rev.name || "Guest User"}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-[var(--color-muted)] shrink-0">
                        {formattedDate}
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(rev._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {renderStars(rev.rating)}
                  {rev.title && (
                    <h5 className="text-xs font-bold text-[var(--color-text-dark)]">
                      {rev.title}
                    </h5>
                  )}
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Review Photos Thumbnails */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {rev.photos.map((photo: string, index: number) => (
                        <a
                          key={index}
                          href={photo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={photo}
                            alt={`Review Photo ${index + 1}`}
                            className="w-14 h-14 object-cover rounded-lg border border-[var(--color-border)] hover:opacity-90 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};