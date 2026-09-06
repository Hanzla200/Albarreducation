/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "./api";
import { getStoredUser } from "../lib/auth";

/* =========================================================
   CLASS OPTIONS
========================================================= */

export const CLASS_OPTIONS = [
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

/* =========================================================
   AUTH
========================================================= */

const getJwt = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("jwt");
};

export const getAuthHeaders = () => {
  const jwt = getJwt();

  return jwt
    ? {
        Authorization: `Bearer ${jwt}`,
      }
    : {};
};

/* =========================================================
   ORDER CODE
========================================================= */

const generateOrderCode = () => {
  return `ALB${Math.floor(100000 + Math.random() * 900000)}`;
};

/* =========================================================
   GET COLLECTION
========================================================= */

export const readCollection = async (
  endpoint: string,
  query = ""
): Promise<any[]> => {
  try {
    const response = await api.get(
      `/${endpoint}?populate=*${query ? `&${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const data =
      response.data?.data ??
      response.data ??
      [];

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      `Failed to load ${endpoint}:`,
      error
    );

    return [];
  }
};

/* =========================================================
   GET DATA
========================================================= */

export const getSubjects = () =>
  readCollection("subjects");

export const getAnnouncements = () =>
  readCollection("announcements");

export const getBooks = () =>
  readCollection("books");

export const getNotes = () =>
  readCollection("notes");

export const getPastPapers = () =>
  readCollection("past-papers");

export const getReviews = () =>
  readCollection("reviews");

export const getOrders = () => readCollection("orders");

export const getOrdersForUser = (email: string) =>
  readCollection("orders", `filters[email][$eq]=${encodeURIComponent(email)}`);

export const getLectures = () =>
  readCollection("lectures");

export const getCarts = () =>
  readCollection("carts");

export const getCartItems = () =>
  readCollection("cartitems");

export const getContacts = () =>
  readCollection("contacts");

/* =========================================================
   CREATE COLLECTION ITEM
   STRAPI V5
========================================================= */

export const createCollectionItem = async (
  endpoint: string,
  data: Record<string, any>
) => {
  try {
    console.log(
      `📤 Saving ${endpoint} to Strapi...`,
      data
    );

    const response = await api.post(
      `/${endpoint}`,
      {
        data,
      },
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );

    const created =
      response.data?.data ??
      response.data;

    console.log(
      `✅ ${endpoint} saved to Strapi:`,
      created
    );

    return created;
  } catch (error: any) {
    console.error(
      `❌ Failed to save ${endpoint} to Strapi:`,
      error?.response?.data || error
    );

    throw error;
  }
};

/* =========================================================
   UPDATE
========================================================= */

export const updateItem = async (
  endpoint: string,
  id: number | string,
  data: Record<string, any>
) => {
  try {
    const response = await api.put(
      `/${endpoint}/${id}`,
      {
        data,
      },
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );

    return (
      response.data?.data ??
      response.data
    );
  } catch (error: any) {
    console.error(
      `Failed to update ${endpoint}:`,
      error?.response?.data || error
    );

    throw error;
  }
};

/* =========================================================
   DELETE
========================================================= */

export const deleteItem = async (
  endpoint: string,
  id: number | string
) => {
  try {
    const response = await api.delete(
      `/${endpoint}/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return (
      response.data?.data ??
      response.data
    );
  } catch (error: any) {
    console.error(
      `Failed to delete ${endpoint}:`,
      error?.response?.data || error
    );

    throw error;
  }
};

/* =========================================================
   MEDIA UPLOAD
========================================================= */

export const uploadMedia = async (
  file: File
) => {
  try {
    const formData = new FormData();

    formData.append(
      "files",
      file
    );

    const response = await api.post(
      "/upload",
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    console.log(
      "✅ Media uploaded to Strapi:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Media upload failed:",
      error?.response?.data || error
    );

    throw error;
  }
};

/* =========================================================
   SUBJECT
========================================================= */

export const createSubject = (
  subjectname: string,
  classLevel: string
) => {
  return createCollectionItem(
    "subjects",
    {
      subjectname,
      classlevel: classLevel,
    }
  );
};

/* =========================================================
   ANNOUNCEMENT
========================================================= */

export const createAnnouncement = (
  news: string
) => {
  return createCollectionItem(
    "announcements",
    {
      news,
    }
  );
};

/* =========================================================
   BOOK
========================================================= */

export const createBook = async (
  title: string,
  price: string,
  classLevel: string,
  subjectId?: number,
  file?: File
) => {
  const data: Record<string, any> = {
    title,
    price: Number(price),
    classlevel: classLevel,
  };

  if (subjectId) {
    data.subject = subjectId;
  }

  /* -------------------------------------------------------
     Upload book file to Strapi Media Library
  ------------------------------------------------------- */

  if (file) {
    const uploadResult =
      await uploadMedia(file);

    const uploadItem =
      Array.isArray(uploadResult)
        ? uploadResult[0]
        : uploadResult;

    if (uploadItem?.id) {
      data.file = [
        uploadItem.id,
      ];
    }
  }

  /* -------------------------------------------------------
     Save BOOK record to Strapi
  ------------------------------------------------------- */

  return createCollectionItem(
    "books",
    data
  );
};

/* =========================================================
   LECTURE
========================================================= */

export const createLecture = (
  title: string,
  videoUrl: string,
  classLevel: string,
  subjectId?: number
) => {
  const data: Record<string, any> = {
    description: title,
    vediourls: videoUrl,
    classlevel: classLevel,
  };

  if (subjectId) {
    data.subject = subjectId;
  }

  return createCollectionItem(
    "lectures",
    data
  );
};

/* =========================================================
   NOTE
========================================================= */

export const createNote = async (
  title: string,
  classLevel: string,
  subjectId?: number,
  file?: File
) => {
  const data: Record<string, any> = {
    title,
    classlevel: classLevel,
  };

  if (subjectId) {
    data.subject = subjectId;
  }

  /* -------------------------------------------------------
     Upload NOTE PDF/file to Strapi Media Library
  ------------------------------------------------------- */

  if (file) {
    const uploadResult =
      await uploadMedia(file);

    const uploadItem =
      Array.isArray(uploadResult)
        ? uploadResult[0]
        : uploadResult;

    if (uploadItem?.id) {
      data.media = [
        uploadItem.id,
      ];
    }
  }

  /* -------------------------------------------------------
     Save NOTE record to Strapi
  ------------------------------------------------------- */

  return createCollectionItem(
    "notes",
    data
  );
};

/* =========================================================
   PAST PAPER
========================================================= */

export const createPastPaper = async (
  title: string,
  boards: string,
  classLevel: string,
  subjectId?: number,
  file?: File,
  year?: number
) => {
  const data: Record<string, any> = {
    title,
    boards,
    classlevel: classLevel,
  };

  if (subjectId) {
    data.subject = subjectId;
  }

  if (year) {
    data.year = Number(year);
  }

  /* -------------------------------------------------------
     Upload PAST PAPER file to Strapi Media Library
  ------------------------------------------------------- */

  if (file) {
    const uploadResult =
      await uploadMedia(file);

    const uploadItem =
      Array.isArray(uploadResult)
        ? uploadResult[0]
        : uploadResult;

    if (uploadItem?.id) {
      data.file = [
        uploadItem.id,
      ];
    }
  }

  /* -------------------------------------------------------
     Save PAST PAPER record to Strapi
  ------------------------------------------------------- */

  return createCollectionItem(
    "past-papers",
    data
  );
};

/* =========================================================
   REVIEW
========================================================= */

export const createReview = (
  text: string,
  review: string | number,
  lectureId?: number,
  userId?: number
) => {
  const data: Record<string, any> = {
    text,
    review: Number(review),
  };

  if (lectureId) {
    data.lecture = lectureId;
  }

  if (userId) {
    data.users_permissions_user =
      userId;
  }

  return createCollectionItem(
    "reviews",
    data
  );
};

/* =========================================================
   CART
========================================================= */

export const createCart = (
  bookId: number,
  userId?: number,
  statused:
    | "active"
    | "checkout" = "active",
  totalitem = 1,
  totalprice = 0
) => {
  const data: Record<string, any> = {
    book: bookId,
    statused,
    totalitem,
    totalprice,
  };

  if (userId) {
    data.users_permissions_user =
      userId;
  }

  /* -------------------------------------------------------
     Save CART to Strapi
  ------------------------------------------------------- */

  return createCollectionItem(
    "carts",
    data
  );
};

/* =========================================================
   CART ITEM
========================================================= */

export const createCartItem = (
  bookId: number,
  cartId: number,
  quantity: number,
  price: number
) => {
  return createCollectionItem(
    "cartitems",
    {
      book: bookId,
      cart: cartId,
      quantity,
      price,
      totalprice:
        quantity * price,
    }
  );
};

/* =========================================================
   CREATE COMPLETE CART
   Creates:
   1. Cart
   2. Cart Items
========================================================= */

export const createCompleteCart = async (
  books: Array<{
    bookId: number;
    quantity: number;
    price: number;
  }>,
  userId?: number
) => {
  if (!books || books.length === 0) {
    throw new Error(
      "Cart is empty."
    );
  }

  const totalitem = books.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );

  const totalprice = books.reduce(
    (total, item) =>
      total +
      Number(item.quantity) *
        Number(item.price),
    0
  );

  /* -------------------------------------------------------
     Create main cart
  ------------------------------------------------------- */

  const cart = await createCart(
    books[0].bookId,
    userId,
    "active",
    totalitem,
    totalprice
  );

  const cartId =
    cart?.id ??
    cart?.documentId;

  if (!cartId) {
    throw new Error(
      "Cart was created but Strapi did not return a cart ID."
    );
  }

  /* -------------------------------------------------------
     Create every cart item
  ------------------------------------------------------- */

  const cartItems = [];

  for (const item of books) {
    const cartItem =
      await createCartItem(
        item.bookId,
        cartId,
        Number(item.quantity),
        Number(item.price)
      );

    cartItems.push(cartItem);
  }

  return {
    cart,
    cartItems,
    totalitem,
    totalprice,
  };
};

/* =========================================================
   ORDER
========================================================= */

export const createOrder = (
  name: string,
  phonenumber: string,
  address: string,
  email: string,
  bookTitle?: string,
  classLevel?: string,
  subjectName?: string,
  details?: string
) => {
  return createCollectionItem(
    "orders",
    {
      name,
      phonenumber,
      address,
      email,
      booktitle:
        bookTitle ?? null,
      classlevel:
        classLevel ?? null,
      subjectname:
        subjectName ?? null,
      details:
        details ?? null,
      ordercode:
        generateOrderCode(),
    }
  );
};

/* =========================================================
   CREATE ORDER FROM CART
========================================================= */

export const createOrderFromCart = async (
  name: string,
  phonenumber: string,
  address: string,
  email: string,
  cartId: number | string,
  bookTitle?: string,
  classLevel?: string,
  subjectName?: string,
  details?: string
) => {
  const orderData: Record<
    string,
    any
  > = {
    name,
    phonenumber,
    address,
    email,
    booktitle:
      bookTitle ?? null,
    classlevel:
      classLevel ?? null,
    subjectname:
      subjectName ?? null,
    details:
      details ?? null,
    ordercode:
      generateOrderCode(),
    cart: cartId,
  };

  return createCollectionItem(
    "orders",
    orderData
  );
};

/* =========================================================
   CONTACT
========================================================= */

export const createContactMessage = (
  name: string,
  email: string,
  message: string
) => {
  return createCollectionItem(
    "contacts",
    {
      name,
      email,
      message,
    }
  );
};

export const getComments = (lectureId: string | number) =>
  readCollection(
    "reviews",
    `filters[lecture][id][$eq]=${encodeURIComponent(String(lectureId))}`
  );

export const createComment = async (
  lectureId: string | number,
  text: string
) => {
  const user = getStoredUser();
  const userId = user?.id ?? user?.documentId;

  if (!userId) {
    throw new Error("You must be logged in to post a comment.");
  }

  return createReview(text, 0, Number(lectureId), Number(userId));
};