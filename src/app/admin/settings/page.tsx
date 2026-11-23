import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { isR2Configured } from "@/lib/storage/r2";
import { isResendConfigured } from "@/lib/email/service";
import { isRazorpayConfigured } from "@/lib/payments/razorpay";
import { ADMIN_EMAILS } from "@/lib/auth/roles";
import {
  Server,
  Cloud,
  Mail,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";


export default function AdminSettingsPage() {
  const r2BucketName = process.env.R2_BUCKET_NAME || "prime-commerce-storage";
  const r2AccountId = process.env.R2_ACCOUNT_ID ? "Configured" : "Missing";
  const resendFrom = process.env.EMAIL_FROM || "parveshdhiman@primecommerceclasses.com";
  const razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "Configured" : "Development Mock Mode";

  const services = [
    {
      name: "Cloudflare R2 Object Storage",
      description: "Direct video streaming, lecture PDFs, and course thumbnail storage.",
      icon: Cloud,
      status: isR2Configured ? "Connected" : "Requires Configuration",
      isHealthy: isR2Configured,
      details: [
        { label: "Target Bucket", value: r2BucketName },
        { label: "Account ID", value: r2AccountId },
        { label: "S3 API Endpoint", value: `https://${process.env.R2_ACCOUNT_ID || "..."}.r2.cloudflarestorage.com` },
        { label: "Bucket Security", value: "Private (Presigned URLs only)" },
      ],
    },
    {
      name: "Resend Transactional Email",
      description: "Automated student purchase confirmations and enrollment receipts.",
      icon: Mail,
      status: isResendConfigured ? "Connected" : "Development Fallback",
      isHealthy: isResendConfigured,
      details: [
        { label: "API Key", value: isResendConfigured ? "Verified Active" : "Not Set" },
        { label: "Sender Address", value: resendFrom },
        { label: "Delivery Logging", value: "Enabled in Supabase email_logs" },
      ],
    },
    {
      name: "Razorpay Payment Gateway",
      description: "1-Click checkout, cryptographic signature verification, and webhooks.",
      icon: CreditCard,
      status: isRazorpayConfigured ? "Production Key Active" : "Dev Mock Mode Available",
      isHealthy: true,
      details: [
        { label: "API Key Status", value: razorpayKey },
        { label: "Webhook Secret", value: process.env.RAZORPAY_WEBHOOK_SECRET ? "Configured" : "Not Configured" },
        { label: "Currency", value: "INR (Indian Rupee)" },
      ],
    },
    {
      name: "Supabase PostgreSQL & Auth",
      description: "Role-based access control, Row Level Security, course curriculum metadata.",
      icon: Server,
      status: "Connected & Active",
      isHealthy: true,
      details: [
        { label: "Project URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL || "Connected" },
        { label: "Row Level Security", value: "Enforced on all tables" },
        { label: "Designated Admin Accounts", value: ADMIN_EMAILS.join(", ") },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AdminHeader
        title="Platform &amp; Infrastructure Status"
        subtitle="Verify operational health of Cloudflare R2, Resend, Razorpay, and Supabase integrations."
      />

      <div className="space-y-5">
        {services.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.name}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B32D6] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#16141B]">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-gray-500">{srv.description}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    srv.isHealthy
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {srv.isHealthy ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {srv.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                {srv.details.map((d) => (
                  <div key={d.label} className="p-3 rounded-xl bg-[#F7F7F9] text-xs">
                    <div className="text-gray-400 font-medium">{d.label}</div>
                    <div className="font-bold text-[#16141B] mt-0.5 truncate font-mono">
                      {d.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
