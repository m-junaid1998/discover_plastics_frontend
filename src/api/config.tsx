export const baseUrl =import.meta.env.VITE_VERCEL_BASE_URL;
export const endpoints = {
  authRoutes: {
    register: "auth/register",
    login: "auth/login",
    google: "auth/google",
    refreshToken: "auth/refresh-token",
    logout: "auth/logout",
    guest: "auth/guest",
    updatepassword: "auth/update-password",
    deleteUser: "auth/delete-user",
  },
  categoryRoutes: {
    getAll: "categories/allcategories",
    create: "categories/createcategories",
    update: (id: string | number) => `categories/updatecategory/${id}`,
    delete: (id: string | number) => `categories/deletecategory/${id}`,
    addSubCategory: (id: string | number) => `categories/subcategory/add/${id}`,
    updateSubCategory: (id: string | number) => `categories/subcategory/update/${id}`,
    removeSubCategory: (id: string | number) => `categories/subcategory/remove/${id}`,
  },
  categoryimageRoutes: {
    getAll: "categoryimages",                       
    upload: "categoryimages/upload",   
    getCategoriesList: "categoryimages/categories-list", 
    updateCategoryImage: (id: string | number) => `categoryimages/${id}`,             
    delete: (id: string | number) => `categoryimages/${id}`, 
  },
  cartRoutes: {
    base: "cart",
    removeProduct: (productId: string | number) => `cart/${productId}`,
  },
  contactRoutes: {
    submit: "contacts/submit",
    dashboardQueries: "contacts/dashboard",
    updateStatus: (id: string | number) => `contacts/${id}/status`,
    delete: (id: string | number) => `contacts/${id}`,
  },
  customerRoutes: {
    dashboardCustomers: "customers/dashboard",
  },
  dashboardRoutes: {
    overview: "dashboard/overview",
  },
  mediaRoutes: {
    createupload: "media/upload",
    getupload: "media",
    deleteupload: (id: string | number) => `media/${id}`, 
  },
  orderRoutes: {
    create: "orders/create",
    myOrders: "orders/myorders",
    dashboardOrders: "orders/dashboard",
    getById: (id: string | number) => `orders/${id}`,
    updateStatus: (id: string | number) => `orders/${id}/status`,
    delete: "orders/delete-all",
  },
  productRoutes: {
    getAll: "products/allproducts",
    getById: (id: string | number) => `products/product/${id}`,
    getTopRated: "products/top-rated",
    getBestSellers: "products/best-sellers",
    getRelated: (id: string | number) => `products/related/${id}`,
    create: "products/createproduct",
    update: (id: string | number) => `products/updateproduct/${id}`,
    delete: (id: string | number) => `products/deleteproduct/${id}`,
    deleteAll: "products/delete-all",
    patch: "products/toggle-publish",
  },
  reviewRoutes: {
    create: (productId: string | number) => `reviews/${productId}`,
    getByProduct: (productId: string | number) => `reviews/${productId}`,
    deleteByUser: (reviewId: string | number) => `/reviews/delete/${reviewId}`,
    deleteByAdmin: (reviewId: string | number) => `/reviews/admin/delete/${reviewId}`,
  },
  searchRoutes: { catalog: "search/catalog"},
  wishlistRoutes: { base: "wishlist"}
};
