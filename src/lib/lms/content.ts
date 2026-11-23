import { CourseRecord, LectureRecord, ResourceRecord } from "@/types/lms";

export const initialCourses: CourseRecord[] = [
  {
    id: "class-11",
    category: "Class 11 Commerce",
    badge: "FOUNDATION MODULE",
    title: "Class 11 Accountancy (Comprehensive Foundation)",
    price: 12500,
    original_price: 15000,
    teacher_name: "Parvesh Kumar",
    subject: "Accountancy",
    description:
      "Designed to help students build an unbreakable foundation in financial accounting. Covers basic accounting principles, debit/credit logic, journal entries, ledger posting, trial balance, and financial statements.",
    thumbnail_key: "/images/accountancy-classroom.jpg",
    topics: [
      "Introduction to Accounting & Basic Terms",
      "Theory Base of Accounting & Accounting Standards",
      "Rules of Debit and Credit & Accounting Equation",
      "Journal, Ledger, Cash Book & Subsidiary Books",
      "Bank Reconciliation Statement (BRS)",
      "Trial Balance & Rectification of Errors",
      "Depreciation, Provisions and Reserves",
      "Financial Statements with Adjustments",
    ],
    highlights: [
      "Concept-first methodology eliminating rote learning",
      "NCERT and standard reference book coverage",
      "Step-by-step numerical calculations & ledger formats",
      "Regular chapter-end tests & personalized doubt sessions",
    ],
    mode: "Online Interactive & Self-Paced Batches",
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "class-12",
    category: "Class 12 Commerce",
    badge: "BOARD EXCELLENCE",
    title: "Class 12 Accountancy (Board Excellence)",
    price: 14500,
    original_price: 18000,
    teacher_name: "Parvesh Kumar",
    subject: "Accountancy",
    description:
      "Comprehensive, result-oriented learning module for Class 12 Commerce students aiming for top percentiles and 100/100 in Board Examinations. Thorough coverage of Partnership, Company Accounts, and Financial Analysis.",
    thumbnail_key: "/images/class-12-accountancy.jpg",
    topics: [
      "Accounting for Partnership Firms — Fundamentals",
      "Goodwill: Nature and Valuation",
      "Change in Profit Sharing Ratio & Revaluation",
      "Admission, Retirement & Death of a Partner",
      "Dissolution of Partnership Firm",
      "Accounting for Share Capital (Issue & Forfeiture)",
      "Issue and Redemption of Debentures",
      "Financial Statement Analysis & Ratio Analysis",
      "Cash Flow Statement (As per AS-3)",
    ],
    highlights: [
      "Comprehensive coverage of CBSE & State Board syllabus",
      "In-depth focus on 6-mark & 8-mark numerical adjustments",
      "Speed, accuracy, and presentation formatting drills",
      "Previous 15 years' board questions & chapter-wise papers",
    ],
    mode: "Online Interactive & Self-Paced Batches",
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

export const initialResources: ResourceRecord[] = [];

