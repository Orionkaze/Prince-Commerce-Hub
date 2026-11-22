export type UserRole = "admin" | "student";

export interface UserRoleRecord {
  id: string;
  user_id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface CourseRecord {
  id: string;
  title: string;
  category: string;
  badge?: string | null;
  description: string;
  teacher_name: string;
  subject: string;
  thumbnail_key?: string | null;
  price: number;
  original_price?: number | null;
  is_published: boolean;
  mode?: string | null;
  topics?: string[];
  highlights?: string[];
  created_at: string;
  updated_at?: string;
}

export type ContentType =
  | "Recorded Lecture"
  | "PDF Notes"
  | "Study Material"
  | "Assignment"
  | "Other";

export type AccessType = "free" | "paid";

export interface LectureRecord {
  id: string;
  course_id?: string | null;
  title: string;
  chapter?: string | null;
  lecture_number?: number | string | null;
  description: string;
  teacher_name: string;
  subject: string;
  video_key?: string | null;
  thumbnail_key?: string | null;
  duration?: string | null;
  access_type: AccessType;
  price: number; // 0 if free, > 0 if individual purchase allowed
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export type ResourceFileType = "pdf" | "notes" | "assignment" | "other";

export interface ResourceRecord {
  id: string;
  course_id?: string | null;
  lecture_id?: string | null;
  title: string;
  description: string;
  file_key: string;
  file_type: ResourceFileType;
  file_format?: string | null;
  category_label?: string | null;
  access_type: AccessType;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PurchaseRecord {
  id: string;
  student_id: string;
  course_id?: string | null;
  lecture_id?: string | null;
  amount: number;
  payment_status: "completed" | "pending" | "failed" | "refunded";
  transaction_id: string;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  student_id: string;
  gateway_order_id: string;
  gateway_payment_id?: string | null;
  amount: number;
  currency: string;
  payment_status: "pending" | "success" | "failed" | "refunded";
  created_at: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  key: string;
  publicBucketName: string;
  expiresInSeconds: number;
}

export interface ContentAccessResponse {
  allowed: boolean;
  streamUrl?: string;
  downloadUrl?: string;
  message?: string;
}
