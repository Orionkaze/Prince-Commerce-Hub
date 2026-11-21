export type CourseLevel =
  | "Class 11"
  | "Class 12"
  | "Foundation"
  | "Board Prep"
  | "Starter"
  | "Elementary"
  | "Intermediate"
  | "Upper Intermediate"
  | "Advanced"
  | "Beginner";

export interface ScheduleItem {
  id: string;
  courseName: string;
  level: CourseLevel;
  days: string;
  startDate: string;
  time: string;
  price: string;
  status: "Open" | "2 Slots Left" | "Full";
}

export interface PublicReview {
  id: string;
  author: string;
  platform: "google" | "facebook";
  rating: number;
  text: string;
  date?: string;
}

export interface StudentFeedback {
  id: string;
  author: string;
  tagline: string;
  quote: string;
  story: string;
  image: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    level: CourseLevel;
  }[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  image: string;
  mode?: string;
  description: string;
  topics?: string[];
  highlights?: string[];
}

export interface CartItem {
  course: Course;
  addedAt: string;
}
