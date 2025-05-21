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
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { jwtDecode } from "jwt-decode";

type Participant = {
  id: number;
  nama: string;
  email: string;
  nowa: string;
  kelas: string;
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
        "http://localhost:5000/api/admin/register?status=count"
      );
      if (countsResponse.data.status === "success") {
        setCounts(countsResponse.data.data.count);
      }

      // Fetch pending registrations
      const pendingResponse = await axios.get(
        "http://localhost:5000/api/admin/register?status=pending"
      );
      if (pendingResponse.data.status === "success") {
        setPendingRegistrations(pendingResponse.data.data.pending);
      }

      // Fetch approved registrations
      const approvedResponse = await axios.get(
        "http://localhost:5000/api/admin/register?status=approved"
      );
      if (approvedResponse.data.status === "success") {
        setApprovedRegistrations(approvedResponse.data.data.approved);
      }

      // Fetch re-registered count
      const reRegisteredResponse = await axios.get(
        "http://localhost:5000/api/admin/registrasi-ulang?status=count"
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
        `http://localhost:5000/api/admin/registration/${id}/APPROVED`
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
        `http://localhost:5000/api/admin/registration/${id}/REJECT`
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
      reg.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.cabang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApproved = approvedRegistrations.filter(
    (reg) =>
      reg.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.cabang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-heading font-bold mb-4 md:mb-0">
            Admin Dashboard
          </h1>

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

        {lastActionResult && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              lastActionResult.success
                ? "bg-green-500/10 border border-green-500"
                : "bg-red-500/10 border border-red-500"
            }`}
          >
            <div className="flex items-start">
              {lastActionResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{lastActionResult.message}</p>
                <p className="text-sm text-text-secondary">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-surface rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <Users className="w-10 h-10 text-primary mr-4" />
                  <div>
                    <p className="text-text-secondary text-sm">Total Peserta</p>
                    <h3 className="text-2xl font-bold">{counts.allRegist}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <CheckCircle className="w-10 h-10 text-green-500 mr-4" />
                  <div>
                    <p className="text-text-secondary text-sm">Diterima</p>
                    <h3 className="text-2xl font-bold">{counts.approve}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <Clock className="w-10 h-10 text-yellow-500 mr-4" />
                  <div>
                    <p className="text-text-secondary text-sm">Menunggu</p>
                    <h3 className="text-2xl font-bold">
                      {pendingRegistrations.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <RefreshCw className="w-10 h-10 text-blue-500 mr-4" />
                  <div>
                    <p className="text-text-secondary text-sm">Re-Registered</p>
                    <h3 className="text-2xl font-bold">{reRegisteredCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari nama, email, kelas, atau cabang perlombaan..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Pending Registrations */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Menunggu Persetujuan
              </h2>

              {filteredPending.length === 0 ? (
                <div className="bg-surface rounded-xl p-6 text-center text-text-secondary">
                  Tidak ada pending registration
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-surface rounded-xl overflow-hidden">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Nama Peserta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Kelas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Jenis Lomba
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Kontak
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredPending.map((registration) => (
                        <tr key={registration.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">
                              {registration.nama}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {registration.kelas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {registration.cabang.nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{registration.email}</div>
                            <div className="text-text-secondary text-sm">
                              {registration.nowa}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleApprove(registration.id)}
                                disabled={processingId === registration.id}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                              >
                                {processingId === registration.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />{" "}
                                    Diterima
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(registration.id)}
                                disabled={processingId === registration.id}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                              >
                                {processingId === registration.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1" /> Ditolak
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
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Perserta yang diterima
              </h2>

              {filteredApproved.length === 0 ? (
                <div className="bg-surface rounded-xl p-6 text-center text-text-secondary">
                  Peserta yang diterima tidak ditemukan
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-surface rounded-xl overflow-hidden">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Nama Peserta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Kelas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Jenis Lomba
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Kontak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Registrasi Ulang
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredApproved.map((registration) => (
                        <tr key={registration.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">
                              {registration.nama}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {registration.kelas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {registration.cabang.nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{registration.email}</div>
                            <div className="text-text-secondary text-sm">
                              {registration.nowa}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {registration.updateAt ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <XCircle className="h-3 w-3 mr-1" /> No
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
