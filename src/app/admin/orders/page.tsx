"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  Calendar,
  Loader2,
  Filter,
  Download,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalRevenue(data.totalRevenue || 0);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Orders &amp; Verified Revenue"
        subtitle="Track incoming Razorpay payments, transaction signatures, and course purchase records."
      />

      {/* Revenue KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Verified Revenue
            </div>
            <div className="text-2xl font-black text-[#16141B] mt-1">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Orders
            </div>
            <div className="text-2xl font-black text-[#16141B] mt-1">
              {orders.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5B32D6] flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Completed Checkouts
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {orders.filter((o) => o.payment_status === "completed" || o.payment_status === "paid").length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, email, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F9] rounded-xl text-sm border border-transparent focus:border-[#5B32D6] focus:bg-white focus:outline-none transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-[#F7F7F9] text-gray-700 py-2 px-3 rounded-xl border border-gray-100 focus:outline-none focus:border-[#5B32D6]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="completed">Completed / Paid</option>
            <option value="pending">Pending Orders</option>
            <option value="failed">Failed Transactions</option>
            <option value="refunded">Refunded / Revoked</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6] mb-3" />
          <p className="text-sm font-semibold text-gray-500">Loading order records...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-6">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No transactions recorded yet</h3>
          <p className="text-xs text-gray-500 mt-1">
            When students complete course purchases via Razorpay, verified transaction receipts will show here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F7F9] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Course / Item</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((order) => {
                  const isSuccess =
                    order.payment_status === "completed" ||
                    order.payment_status === "paid" ||
                    order.payment_status === "success";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-600">
                        {order.transaction_id || "TXN_PENDING"}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-[#16141B]">{order.student_name}</div>
                        <div className="text-xs text-gray-400">{order.student_email}</div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-800 text-xs">
                          {order.item_title}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-extrabold text-[#16141B]">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isSuccess
                              ? "bg-emerald-100 text-emerald-800"
                              : order.payment_status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {order.payment_status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
