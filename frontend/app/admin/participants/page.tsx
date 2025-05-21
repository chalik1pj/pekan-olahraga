"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Download,
  Loader2,
  RefreshCw,
  Search,
  Users,
  XCircle,
  Clock,
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
        "http://localhost:5000/api/admin/register?status=approved"
      );
      const pendingResponse = await axios.get(
        "http://localhost:5000/api/admin/register?status=pending"
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
        "http://localhost:5000/api/admin/cabang-olahraga"
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
          `"${p.kelas}"`,
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
        p.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-heading font-bold mb-4 md:mb-0">
            Peserta
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
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
        <div className="bg-surface rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari nama, email, kelas, atau cabang perlombaan..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <select
                  className="input-field"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
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
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 text-center">
            <Users className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Tidak ada peserta ditemukan
            </h2>
            <p className="text-text-secondary">
              No participants match your current filters. Try adjusting your
              search criteria.
            </p>
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Registrasi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{participant.nama}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.kelas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.cabang.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{participant.email}</div>
                      <div className="text-text-secondary text-sm">
                        {participant.nowa}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {participant.status === "APPROVED" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : participant.status === "PENDING" ? (
                          <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span>{participant.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {new Date(participant.createAt).toLocaleDateString()}
                      </div>
                      {participant.updateAt && (
                        <div className="text-green-500 text-sm flex items-center">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Registrasi Ulang
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
