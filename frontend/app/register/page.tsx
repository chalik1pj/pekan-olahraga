"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Trophy,
  Info,
  ClubIcon as Football,
  ShoppingBasketIcon as Basketball,
  VibrateIcon as Volleyball,
  RatIcon as Racquet,
  TableIcon as TableTennis,
  FishIcon as Swim,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const participantSchema = z.object({
  nama: z.string().min(3, "Nama harus minimal 3 karakter"),
  komting: z.string().min(3, "Nama ketua kelas diperlukan"),
  email: z.string().email("Alamat email tidak valid"),
  nowa: z.string().min(10, "Nomor telepon harus minimal 10 digit"),
  kelas: z.string().min(2, "Nama kelas diperlukan"),
});

const formSchema = z.object({
  nama: z.string().min(3, "Nama cabang olahraga diperlukan"),
  participant: z.number().min(1, "Jumlah peserta minimal 1"),
  harga: z.number().min(1, "Harga harus lebih dari 0"),
  pesertaGroup: z
    .array(participantSchema)
    .min(1, "Minimal satu peserta diperlukan"),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to get sport icon
const getSportIcon = (sportName: string) => {
  if (sportName.includes("Sepak Bola")) return Football;
  if (sportName.includes("Basket")) return Basketball;
  if (sportName.includes("Voli")) return Volleyball;
  if (sportName.includes("Tangkis")) return Racquet;
  if (sportName.includes("Tenis")) return TableTennis;
  if (sportName.includes("Renang")) return Swim;
  return Trophy; // Default icon
};

export default function RegisterPage() {
  const router = useRouter();
  const [sports, setSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    isExistingBranch?: boolean;
    competitionId?: number;
    message?: string;
    emailsSent?: number;
    totalEmails?: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      participant: 1,
      harga: 0,
      pesertaGroup: [{ nama: "", komting: "", email: "", nowa: "", kelas: "" }],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "pesertaGroup",
  });

  const selectedSport = watch("nama");

  // Fetch sports categories on component mount
  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/cabang-olahraga"
        );
        if (response.data.status === "success") {
          setSports(response.data.data.competitions);
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
        toast.error("Gagal memuat kategori olahraga");
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  // Update price when sport changes
  useEffect(() => {
    if (selectedSport) {
      const sport = sports.find((s) => s.nama === selectedSport);
      if (sport) {
        setValue("participant", sport.participant);
        setValue("harga", sport.harga);
      }
    }
  }, [selectedSport, sports, setValue]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setRegistrationResult(null);

    try {
      // Log the data being sent for debugging
      console.log("Submitting registration data:", data);

      // Add a timeout to the request to prevent hanging
      const response = await axios.post(
        "http://localhost:5000/api/pekan-olahraga/register",
        data,
        {
          timeout: 30000,
        }
      );

      console.log("Registration response:", response.data);

      // Check if the response indicates success
      if (response.data && response.data.status === "success") {
        // Set registration result with email info
        setRegistrationResult({
          success: true,
          isExistingBranch: response.data.data?.isExistingBranch,
          competitionId: response.data.data?.competitionId,
          message: response.data.message,
          emailsSent: response.data.data?.emailsSent,
          totalEmails: response.data.data?.totalEmails,
        });

        // Show success message with email info
        const emailInfo = response.data.data?.emailsSent
          ? ` ${response.data.data.emailsSent}/${response.data.data.totalEmails} email terkirim.`
          : "";

        toast.success(
          `${
            response.data.message || "Pendaftaran berhasil!"
          }${emailInfo} Periksa email Anda untuk konfirmasi.`
        );

        // Store registration details in session storage
        const registrationDetails = {
          id: `REG${Math.floor(100000 + Math.random() * 900000)}`,
          sportName: data.nama,
          participants: data.participant,
          price: data.harga,
          date: new Date().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          status: "PENDING",
        };

        sessionStorage.setItem(
          "registrationDetails",
          JSON.stringify(registrationDetails)
        );

        // Redirect to success page
        setTimeout(() => {
          router.push("/register/success");
        }, 1500);

        // Reset the form
        reset({
          nama: "",
          participant: 1,
          harga: 0,
          pesertaGroup: [
            { nama: "", komting: "", email: "", nowa: "", kelas: "" },
          ],
        });
      } else {
        // Handle non-success response
        setRegistrationResult({
          success: false,
          message:
            response.data.message || "Pendaftaran gagal. Silakan coba lagi.",
        });
        toast.error(
          response.data.message || "Pendaftaran gagal. Silakan coba lagi."
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Display specific error message if available
      const errorMessage =
        error.response?.data?.message ||
        (error.code === "ECONNABORTED"
          ? "Waktu permintaan habis. Server mungkin sibuk, silakan coba lagi."
          : "Pendaftaran gagal. Silakan coba lagi.");

      setRegistrationResult({
        success: false,
        message: errorMessage,
      });

      toast.error(errorMessage);

      // Log detailed error for debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-primary mb-8 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
          </Link>

          <div className="bg-surface rounded-2xl p-6 md:p-10 shadow-xl">
            <div className="flex items-center justify-center mb-8">
              <Trophy className="w-10 h-10 text-primary mr-4" />
              <h1 className="text-3xl md:text-4xl font-heading font-bold">
                Daftarkan Tim Anda
              </h1>
            </div>

            <p className="text-center text-text-secondary mb-10 font-sans">
              Isi formulir di bawah ini untuk mendaftar ke Pekan Olahraga 2025
            </p>

            {registrationResult && (
              <div
                className={`bg-${
                  registrationResult.success ? "green" : "red"
                }-500/10 border border-${
                  registrationResult.success ? "green" : "red"
                }-500 rounded-xl p-4 mb-6`}
              >
                <div className="flex items-start">
                  <Info
                    className={`h-5 w-5 text-${
                      registrationResult.success ? "green" : "red"
                    }-500 mt-0.5 mr-2 flex-shrink-0`}
                  />
                  <div>
                    <p className="font-medium font-sans">
                      {registrationResult.success
                        ? "Pendaftaran Berhasil!"
                        : "Pendaftaran Gagal"}
                    </p>
                    <p className="text-sm text-text-secondary font-sans">
                      {registrationResult.message ||
                        (registrationResult.success
                          ? registrationResult.isExistingBranch
                            ? "Anda telah terdaftar ke cabang olahraga yang sudah ada."
                            : "Cabang olahraga baru telah dibuat untuk pendaftaran Anda."
                          : "Silakan coba lagi atau hubungi dukungan jika masalah berlanjut.")}
                    </p>
                    {registrationResult.success &&
                      registrationResult.emailsSent !== undefined && (
                        <p className="text-sm text-text-secondary font-sans mt-1">
                          {registrationResult.emailsSent}/
                          {registrationResult.totalEmails} email konfirmasi
                          telah dikirim.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 font-sans">
                    Pilih Cabang Olahraga
                  </h2>

                  <div className="radio-container">
                    {sports.map((sport) => {
                      const SportIcon = getSportIcon(sport.nama);
                      return (
                        <div
                          key={sport.id}
                          className="custom-radio w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
                        >
                          <input
                            type="radio"
                            id={`sport-${sport.id}`}
                            value={sport.nama}
                            {...register("nama")}
                          />
                          <label
                            htmlFor={`sport-${sport.id}`}
                            className="h-full font-sans"
                          >
                            <div className="radio-icon"></div>
                            <div className="font-semibold">{sport.nama}</div>
                            <div className="text-sm text-text-secondary mt-1">
                              {sport.participant} peserta
                            </div>
                            <div className="text-sm text-text-secondary">
                              Rp {sport.harga.toLocaleString()}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {errors.nama && (
                    <p className="text-red-500 text-sm font-sans">
                      {errors.nama.message}
                    </p>
                  )}
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 font-sans">
                    Informasi Peserta
                  </h2>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-6 border border-gray-700 rounded-xl space-y-4"
                    >
                      {/* <div className="flex justify-between items-center">
                        <h3 className="font-semibold font-sans">
                          Peserta #{index + 1}
                        </h3>
                      </div> */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 font-sans">
                            Nama Lengkap
                          </label>
                          <textarea
                            className="textarea-field font-sans"
                            placeholder="Cth: Nama Anda (NIM)"
                            {...register(`pesertaGroup.${index}.nama`)}
                          />
                          {errors.pesertaGroup?.[index]?.nama && (
                            <p className="text-red-500 text-sm mt-1 font-sans">
                              {errors.pesertaGroup[index]?.nama?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 font-sans">
                            Ketua Kelas (Komting)
                          </label>
                          <input
                            type="text"
                            className="input-field font-sans"
                            placeholder="Masukkan nama ketua kelas"
                            {...register(`pesertaGroup.${index}.komting`)}
                          />
                          {errors.pesertaGroup?.[index]?.komting && (
                            <p className="text-red-500 text-sm mt-1 font-sans">
                              {errors.pesertaGroup[index]?.komting?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 font-sans">
                            Email
                          </label>
                          <input
                            type="email"
                            className="input-field font-sans"
                            placeholder="Masukkan alamat email"
                            {...register(`pesertaGroup.${index}.email`)}
                          />
                          {errors.pesertaGroup?.[index]?.email && (
                            <p className="text-red-500 text-sm mt-1 font-sans">
                              {errors.pesertaGroup[index]?.email?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 font-sans">
                            Nomor Telepon (WhatsApp)
                          </label>
                          <input
                            type="text"
                            className="input-field font-sans"
                            placeholder="Masukkan nomor WhatsApp"
                            {...register(`pesertaGroup.${index}.nowa`)}
                          />
                          {errors.pesertaGroup?.[index]?.nowa && (
                            <p className="text-red-500 text-sm mt-1 font-sans">
                              {errors.pesertaGroup[index]?.nowa?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 font-sans">
                            Kelas
                          </label>
                          <input
                            type="text"
                            className="input-field font-sans"
                            placeholder="Masukkan kelas anda (Cth: 23S04)"
                            {...register(`pesertaGroup.${index}.kelas`)}
                          />
                          {errors.pesertaGroup?.[index]?.kelas && (
                            <p className="text-red-500 text-sm mt-1 font-sans">
                              {errors.pesertaGroup[index]?.kelas?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full font-sans"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Pendaftaran"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
