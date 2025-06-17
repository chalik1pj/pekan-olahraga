"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Download,
  Loader2,
  RefreshCw,
  Search,
  Users,
  Filter,
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
  createAt: string;
  updateAt: string | null;
  cabang: {
    id: number;
    nama: string;
    participant: number;
    harga: number;
  };
};

export default function ParticipantsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [sports, setSports] = useState<{ id: number; nama: string }[]>([]);

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
    fetchParticipants();
    fetchSports();
  }, [router]);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      // Fetch all participants (both approved and pending)
      const approvedResponse = await axios.get(
        `${config.HOST}/api/admin/register?status=approved`
      );
      const pendingResponse = await axios.get(
        `${config.HOST}/api/admin/register?status=pending`
      );

      if (
        approvedResponse.data.status === "success" &&
        pendingResponse.data.status === "success"
      ) {
        const allParticipants = [
          ...approvedResponse.data.data.approved,
          ...pendingResponse.data.data.pending,
        ];
        setParticipants(allParticipants);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error("Failed to load participants");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await axios.get(
        `${config.HOST}/api/admin/cabang-olahraga`
      );
      if (response.data.status === "success") {
        setSports(response.data.data.competitions);
      }
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const exportToCSV = () => {
    // Filter participants based on current filters
    const filteredData = filterParticipants();

    // Create CSV content
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Class",
      "Sport",
      "Status",
      "Registration Date",
      "Re-Registration Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((p) =>
        [
          p.id,
          `"${p.nama}"`,
          `"${p.email}"`,
          `"${p.nowa}"`,
          `"${p.kelas?.nama || "Unknown"}"`,
          `"${p.cabang.nama}"`,
          p.status,
          new Date(p.createAt).toLocaleDateString(),
          p.updateAt ? new Date(p.updateAt).toLocaleDateString() : "N/A",
        ].join(",")
      ),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `participants_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterParticipants = () => {
    return participants.filter((p) => {
      // Apply search filter
      const matchesSearch =
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.kelas?.nama || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        p.cabang.nama.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" ||
        p.status === statusFilter ||
        (statusFilter === "REREGISTERED" && p.updateAt !== null);

      // Apply sport filter
      const matchesSport =
        sportFilter === "all" || p.cabang.id.toString() === sportFilter;

      return matchesSearch && matchesStatus && matchesSport;
    });
  };

  const filteredParticipants = filterParticipants();

  const getStatusBadge = (status: string, updateAt: string | null) => {
    if (status === "APPROVED") {
      return <span className="status-badge status-approved">Diterima</span>;
    } else if (status === "PENDING") {
      return <span className="status-badge status-pending">Menunggu</span>;
    } else {
      return <span className="status-badge status-rejected">Ditolak</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">
              Manajemen Peserta
            </h2>
            <p className="text-gray-600 mt-1">
              Kelola dan pantau semua peserta Pekan Olahraga 2025
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchParticipants}
              className="btn btn-outline"
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              onClick={exportToCSV}
              className="btn btn-primary"
              disabled={isLoading || filteredParticipants.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Filter & Pencarian</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
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

            <div>
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="APPROVED">Diterima</option>
                <option value="PENDING">Menunggu</option>
                <option value="REJECT">Ditolak</option>
                <option value="REREGISTERED">Re-Registered</option>
              </select>
            </div>

            <div>
              <select
                className="input-field"
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
              >
                <option value="all">Seluruh Cabang</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="admin-card">
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="admin-card">
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada peserta ditemukan
              </h3>
              <p className="text-gray-600">
                Tidak ada peserta yang sesuai dengan kriteria pencarian Anda.
                Coba sesuaikan filter pencarian.
              </p>
            </div>
          </div>
        ) : (
          <div className="admin-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Daftar Peserta ({filteredParticipants.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead className="admin-table-header">
                  <tr>
                    <th className="admin-table-header-cell">Nama Peserta</th>
                    <th className="admin-table-header-cell">Kelas</th>
                    <th className="admin-table-header-cell">Jenis Lomba</th>
                    <th className="admin-table-header-cell">Kontak</th>
                    <th className="admin-table-header-cell">Status</th>
                    <th className="admin-table-header-cell">Registrasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="admin-table-cell">
                        <div className="font-medium text-gray-900">
                          {participant.nama}
                        </div>
                      </td>
                      <td className="admin-table-cell text-gray-600">
                        {participant.kelas?.nama || "Unknown"}
                      </td>
                      <td className="admin-table-cell text-gray-600">
                        {participant.cabang.nama}
                      </td>
                      <td className="admin-table-cell">
                        <div className="text-gray-900">{participant.email}</div>
                        <div className="text-gray-500 text-sm">
                          {participant.nowa}
                        </div>
                      </td>
                      <td className="admin-table-cell">
                        {getStatusBadge(
                          participant.status,
                          participant.updateAt
                        )}
                      </td>
                      <td className="admin-table-cell">
                        <div className="text-gray-900">
                          {new Date(participant.createAt).toLocaleDateString()}
                        </div>
                        {participant.updateAt && (
                          <div className="text-green-600 text-sm flex items-center mt-1">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Re-registered
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
