/**
 * Generated Strapi schema types for frontend use.
 * Based on Strapi schema JSON definitions from albarreducatonbackend/src/api.
 */

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiResponse<T> {
  data: T | T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiRelation<T> {
  data: StrapiEntity<T> | StrapiEntity<T>[] | null;
}

export interface StrapiMediaAttributes {
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, { url: string; width: number; height: number } | null> | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export type StrapiMediaEntity = StrapiEntity<StrapiMediaAttributes>;

export interface StrapiUserAttributes {
  first_name?: string;
  second_name?: string;
  username?: string;
  email?: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
}

export type StrapiUserEntity = StrapiEntity<StrapiUserAttributes>;

export interface AnnouncementAttributes {
  news: string;
}

export type AnnouncementEntity = StrapiEntity<AnnouncementAttributes>;

export interface SubjectAttributes {
  subjectname: string;
  lectures?: StrapiRelation<LectureAttributes>;
  notes?: StrapiRelation<NoteAttributes>;
  past_papers?: StrapiRelation<PastPaperAttributes>;
  books?: StrapiRelation<BookAttributes>;
}

export type SubjectEntity = StrapiEntity<SubjectAttributes>;

export interface BookAttributes {
  subject?: StrapiRelation<SubjectAttributes>;
  title?: string;
  file?: StrapiRelation<StrapiMediaAttributes>;
  price?: string;
  carts?: StrapiRelation<CartAttributes>;
  cartitems?: StrapiRelation<CartItemAttributes>;
}

export type BookEntity = StrapiEntity<BookAttributes>;

export type CartStatusedEnum = "active" | "checkout";

export interface CartAttributes {
  book?: StrapiRelation<BookAttributes>;
  users_permissions_user?: StrapiRelation<StrapiUserAttributes>;
  statused?: CartStatusedEnum;
  totalitem?: string;
  totalprice?: string;
  cartitems?: StrapiRelation<CartItemAttributes>;
}

export type CartEntity = StrapiEntity<CartAttributes>;

export interface CartItemAttributes {
  book?: StrapiRelation<BookAttributes>;
  cart?: StrapiRelation<CartAttributes>;
  quantity?: string;
  price?: string;
  totalprice?: string;
}

export type CartItemEntity = StrapiEntity<CartItemAttributes>;

export interface LectureAttributes {
  subject?: StrapiRelation<SubjectAttributes>;
  vediourls?: string;
  description?: string;
  reviews?: StrapiRelation<ReviewAttributes>;
}

export type LectureEntity = StrapiEntity<LectureAttributes>;

export interface NoteAttributes {
  subject?: StrapiRelation<SubjectAttributes>;
  title: string;
  media?: StrapiRelation<StrapiMediaAttributes>;
}

export type NoteEntity = StrapiEntity<NoteAttributes>;

export interface OrderAttributes {
  name: string;
  phonenumber: string;
  address: string;
  email: string;
  user?: StrapiRelation<StrapiUserAttributes>;
}

export type OrderEntity = StrapiEntity<OrderAttributes>;

export type PastPaperBoardEnum =
  | "BISE Lahore"
  | "BISE Rawalpindi"
  | "BISE Faisalabad"
  | "BISE Gujranwala"
  | "BISE Multan"
  | "BISE Sargodha"
  | "BISE Bahawalpur"
  | "BISE DG Khan"
  | "BISE Sahiwal";

export interface PastPaperAttributes {
  subject?: StrapiRelation<SubjectAttributes>;
  title?: string;
  boards?: PastPaperBoardEnum;
  file?: StrapiRelation<StrapiMediaAttributes>;
}

export type PastPaperEntity = StrapiEntity<PastPaperAttributes>;

export interface ReviewAttributes {
  text?: string;
  review?: string;
  reply?: string;
  users_permissions_user?: StrapiRelation<StrapiUserAttributes>;
  lecture?: StrapiRelation<LectureAttributes>;
}

export type ReviewEntity = StrapiEntity<ReviewAttributes>;

