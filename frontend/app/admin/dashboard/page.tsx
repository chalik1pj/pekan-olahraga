"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Users,
  XCircle,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { jwtDecode } from "jwt-decode";
import { config } from "@/components/host/host";

type Participant = {
  id: number;
  nama: string;
  email: string;
  nowa: string;
  kelas: {
    id: number;
    nama: string;
    komting: string;
  };
  status: "PENDING" | "APPROVED" | "REJECT";
  cabang: {
    id: number;
    nama: string;
    participant: number;
    harga: number;
  };
};

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState<
    Participant[]
  >([]);
  const [approvedRegistrations, setApprovedRegistrations] = useState<
    Participant[]
  >([]);
  const [reRegisteredCount, setReRegisteredCount] = useState(0);
  const [counts, setCounts] = useState({ allRegist: 0, approve: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [lastActionResult, setLastActionResult] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Verify token expiration
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }
    } catch (error) {
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
      return;
    }

    // Fetch data
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch counts
      const countsResponse = await axios.get(
        `${config.HOST}/api/admin/register?status=count`
      );
      if (countsResponse.data.status === "success") {
        setCounts(countsResponse.data.data.count);
      }

      // Fetch pending registrations
      const pendingResponse = await axios.get(
        `${config.HOST}/api/admin/register?status=pending`
      );
      if (pendingResponse.data.status === "success") {
        setPendingRegistrations(pendingResponse.data.data.pending);
      }

      // Fetch approved registrations
      const approvedResponse = await axios.get(
        `${config.HOST}/api/admin/register?status=approved`
      );
      if (approvedResponse.data.status === "success") {
        setApprovedRegistrations(approvedResponse.data.data.approved);
      }

      // Fetch re-registered count
      const reRegisteredResponse = await axios.get(
        `${config.HOST}/api/admin/registrasi-ulang?status=count`
      );
      if (reRegisteredResponse.data.status === "success") {
        setReRegisteredCount(reRegisteredResponse.data.data.participant);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      console.log(`Approving registration with ID: ${id}`);
      const response = await axios.patch(
        `${config.HOST}/api/admin/registration/${id}/APPROVED`
      );

      console.log("Approval response:", response.data);

      if (response.data.status === "success") {
        setLastActionResult({
          success: true,
          message: "Registration approved successfully",
          timestamp: new Date(),
        });
        toast.success("Registration approved successfully");
        await fetchDashboardData();
      } else {
        setLastActionResult({
          success: false,
          message: response.data.message || "Failed to approve registration",
          timestamp: new Date(),
        });
        toast.error(response.data.message || "Failed to approve registration");
      }
    } catch (error: any) {
      console.error("Error approving registration:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to approve registration";
      setLastActionResult({
        success: false,
        message: errorMessage,
        timestamp: new Date(),
      });
      toast.error(errorMessage);

      // Log detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      console.log(`Rejecting registration with ID: ${id}`);
      const response = await axios.patch(
        `${config.HOST}/api/admin/registration/${id}/REJECT`
      );

      console.log("Rejection response:", response.data);

      if (response.data.status === "success") {
        setLastActionResult({
          success: true,
          message: "Registration rejected successfully",
          timestamp: new Date(),
        });
        toast.success("Registration rejected successfully");
        await fetchDashboardData();
      } else {
        setLastActionResult({
          success: false,
          message: response.data.message || "Failed to reject registration",
          timestamp: new Date(),
        });
        toast.error(response.data.message || "Failed to reject registration");
      }
    } catch (error: any) {
      console.error("Error rejecting registration:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to reject registration";
      setLastActionResult({
        success: false,
        message: errorMessage,
        timestamp: new Date(),
      });
      toast.error(errorMessage);

      // Log detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPending = pendingRegistrations.filter(
    (reg) =>
      reg.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.kelas.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.cabang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApproved = approvedRegistrations.filter(
    (reg) =>
      reg.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.kelas.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.cabang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Kelola pendaftaran peserta Pekan Olahraga 2025
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="btn btn-outline"
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
        </div>

        {/* Action Result Alert */}
        {lastActionResult && (
          <div
            className={`p-4 rounded-xl border ${
              lastActionResult.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start">
              {lastActionResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {lastActionResult.message}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {lastActionResult.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Peserta
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {counts.allRegist}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Diterima
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {counts.approve}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Menunggu
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {pendingRegistrations.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Re-Registered
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {reRegisteredCount}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="admin-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari nama, email, kelas, atau cabang perlombaan..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Pending Registrations */}
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Menunggu Persetujuan
                </h2>
                <span className="status-badge status-pending">
                  {filteredPending.length} pending
                </span>
              </div>

              {filteredPending.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pending registration
                  </h3>
                  <p className="text-gray-600">
                    Semua pendaftaran telah diproses
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead className="admin-table-header">
                      <tr>
                        <th className="admin-table-header-cell">
                          Nama Peserta
                        </th>
                        <th className="admin-table-header-cell">Kelas</th>
                        <th className="admin-table-header-cell">Jenis Lomba</th>
                        <th className="admin-table-header-cell">Kontak</th>
                        <th className="admin-table-header-cell text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPending.map((registration) => (
                        <tr
                          key={registration.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="admin-table-cell">
                            <div className="font-medium text-gray-900">
                              {registration.nama}
                            </div>
                          </td>
                          <td className="admin-table-cell text-gray-600">
                            {registration.kelas?.nama || "Unknown"}
                          </td>
                          <td className="admin-table-cell text-gray-600">
                            {registration.cabang.nama}
                          </td>
                          <td className="admin-table-cell">
                            <div className="text-gray-900">
                              {registration.email}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {registration.nowa}
                            </div>
                          </td>
                          <td className="admin-table-cell text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleApprove(registration.id)}
                                disabled={processingId === registration.id}
                                className="btn btn-success text-sm px-3 py-1"
                              >
                                {processingId === registration.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />{" "}
                                    Terima
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(registration.id)}
                                disabled={processingId === registration.id}
                                className="btn btn-danger text-sm px-3 py-1"
                              >
                                {processingId === registration.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1" /> Tolak
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Approved Registrations */}
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Peserta yang Diterima
                </h2>
                <span className="status-badge status-approved">
                  {filteredApproved.length} approved
                </span>
              </div>

              {filteredApproved.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada peserta yang diterima
                  </h3>
                  <p className="text-gray-600">
                    Peserta yang diterima akan muncul di sini
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead className="admin-table-header">
                      <tr>
                        <th className="admin-table-header-cell">
                          Nama Peserta
                        </th>
                        <th className="admin-table-header-cell">Kelas</th>
                        <th className="admin-table-header-cell">Jenis Lomba</th>
                        <th className="admin-table-header-cell">Kontak</th>
                        <th className="admin-table-header-cell">
                          Registrasi Ulang
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApproved.map((registration) => (
                        <tr
                          key={registration.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="admin-table-cell">
                            <div className="font-medium text-gray-900">
                              {registration.nama}
                            </div>
                          </td>
                          <td className="admin-table-cell text-gray-600">
                            {registration.kelas?.nama || "Unknown"}
                          </td>
                          <td className="admin-table-cell text-gray-600">
                            {registration.cabang.nama}
                          </td>
                          <td className="admin-table-cell">
                            <div className="text-gray-900">
                              {registration.email}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {registration.nowa}
                            </div>
                          </td>
                          <td className="admin-table-cell">
                            {registration.updateAt ? (
                              <span className="status-badge status-approved">
                                <CheckCircle className="h-3 w-3 mr-1" /> Sudah
                              </span>
                            ) : (
                              <span className="status-badge bg-gray-100 text-gray-800">
                                <XCircle className="h-3 w-3 mr-1" /> Belum
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
