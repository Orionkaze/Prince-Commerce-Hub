export type UserRole = "admin" | "student";

export interface ProfileRecord {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CourseRecord {
  id: string;
  title: string;
  slug?: string;
  category: string;
  badge?: string | null;
  description: string;
  teacher_name: string;
  instructor_name?: string;
  subject: string;
  thumbnail_key?: string | null;
  thumbnail_object_key?: string | null;
  price: number;
  original_price?: number | null;
  discounted_price?: number | null;
  class_level?: string;
  duration?: string;
  language?: string;
  status?: CourseStatus;
  is_published: boolean;
  mode?: string | null;
  topics?: string[];
  highlights?: string[];
  created_at: string;
  updated_at?: string;
  modules?: CourseModuleRecord[];
  lectures?: LectureRecord[];
  lectures_count?: number;
  modules_count?: number;
  enrolled_students_count?: number;
}

export interface CourseModuleRecord {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  position: number;
  created_at: string;
  updated_at?: string;
  lectures?: LectureRecord[];
}

export type ContentType =
  | "Recorded Lecture"
  | "PDF Notes"
  | "Study Material"
  | "Assignment"
  | "Other";

export type AccessType = "free" | "paid";
export type LectureStatus = "DRAFT" | "PUBLISHED";

export interface LectureRecord {
  id: string;
  course_id?: string | null;
  module_id?: string | null;
  title: string;
  chapter?: string | null;
  lecture_number?: number | string | null;
  description: string;
  teacher_name: string;
  subject: string;
  video_key?: string | null;
  video_object_key?: string | null;
  thumbnail_key?: string | null;
  thumbnail_object_key?: string | null;
  duration?: string | null;
  position?: number;
  is_preview?: boolean;
  access_type: AccessType;
  price: number; // 0 if free, > 0 if individual purchase allowed
  status?: LectureStatus;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
  resources?: LectureResourceRecord[];
  user_progress?: {
    last_position_seconds: number;
    completed: boolean;
  };
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

export interface LectureResourceRecord {
  id: string;
  lecture_id?: string | null;
  course_id?: string | null;
  title: string;
  object_key: string;
  file_type: string;
  file_size?: number;
  created_at: string;
}

export type EnrollmentStatus = "active" | "revoked";

export interface EnrollmentRecord {
  id: string;
  student_id: string;
  course_id: string;
  payment_id?: string | null;
  status: EnrollmentStatus;
  enrolled_at: string;
  created_at: string;
  course?: CourseRecord;
  student?: ProfileRecord;
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
  course?: CourseRecord;
  lecture?: LectureRecord;
}

export type PaymentStatus = "CREATED" | "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface PaymentRecord {
  id: string;
  student_id: string;
  course_id?: string | null;
  gateway_order_id?: string;
  gateway_payment_id?: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  amount: number;
  currency: string;
  payment_status?: string;
  status?: PaymentStatus;
  verified_at?: string | null;
  created_at: string;
  updated_at?: string;
  course?: CourseRecord;
  student?: ProfileRecord;
}

export interface LectureProgressRecord {
  id: string;
  student_id: string;
  lecture_id: string;
  last_position_seconds: number;
  completed: boolean;
  last_watched_at: string;
  updated_at: string;
}

export interface WebhookEventRecord {
  id: string;
  provider: string;
  event_id: string;
  event_type: string;
  payload?: any;
  processed_at: string;
  created_at: string;
}

export interface EmailLogRecord {
  id: string;
  recipient: string;
  template_type: string;
  related_entity_id?: string | null;
  provider_message_id?: string | null;
  status: string;
  error_message?: string | null;
  created_at: string;
  sent_at?: string;
}

export interface AdminAuditLogRecord {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: any;
  created_at: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  key: string;
  publicBucketName?: string;
  expiresInSeconds: number;
}

export interface ContentAccessResponse {
  allowed: boolean;
  streamUrl?: string;
  downloadUrl?: string;
  message?: string;
}
