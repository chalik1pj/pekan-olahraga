"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  Award,
  Calendar,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import SportsCard from "@/components/SportsCard";

const sportsCategories = [
  {
    id: 1,
    name: "Futsal",
    imagePath: "/images/sports/futsal.jpg",
    participants: 7,
    price: 100000,
  },
  {
    id: 2,
    name: "Badminton Ganda Putra",
    imagePath: "/images/sports/bg-putra.jpg",
    participants: 2,
    price: 60000,
  },
  {
    id: 3,
    name: "Badminton Ganda Putri",
    imagePath: "/images/sports/bg-putri.jpg",
    participants: 2,
    price: 60000,
  },
  {
    id: 4,
    name: "Badminton Single Putra",
    imagePath: "/images/sports/bs-putra.jpg",
    participants: 1,
    price: 40000,
  },
  {
    id: 5,
    name: "Badminton Single Putri",
    imagePath: "/images/sports/bs-putri.jpg",
    participants: 1,
    price: 40000,
  },
  {
    id: 6,
    name: "Tenis Meja",
    imagePath: "/images/sports/tm.jpg",
    participants: 2,
    price: 60000,
  },
  {
    id: 7,
    name: "E-Sport MLBB",
    imagePath: "/images/sports/mlbb.jpg",
    participants: 7,
    price: 100000,
  },
  {
    id: 8,
    name: "Vocal Solo",
    imagePath: "/images/sports/vs.jpg",
    participants: 1,
    price: 60000,
  },
  {
    id: 9,
    name: "Blind System Typewriter",
    imagePath: "/images/sports/ketik-cepat.jpg",
    participants: 1,
    price: 30000,
  },
  {
    id: 10,
    name: "Pemrograman Web",
    imagePath: "/images/sports/coding.jpg",
    participants: 1,
    price: 30000,
  },
  {
    id: 11,
    name: "Desain Poster",
    imagePath: "/images/sports/poster.jpg",
    participants: 1,
    price: 30000,
  },
  {
    id: 12,
    name: "Pidato Bahasa Inggris",
    imagePath: "/images/sports/pidato.jpg",
    participants: 1,
    price: 30000,
  },
];

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/header-dash-bg.jpg"
            alt="Game On! Pekan Olahraga"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-white">
              <span className="text-primary">PEKAN</span> OLAHRAGA!
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Mengasah Kreativitas, Mengukir Prestasi di Era Digital
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn btn-primary">
                Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#about" className="btn btn-outline">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-10 left-0 right-0">
            <CountdownTimer targetDate="2025-07-15T16:30:00" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Tentang Event</h2>
          <p className="section-subtitle">
            Pekan Olahraga 2025 adalah kompetisi utama yang mempertemukan
            mahasiswa dari seluruh sesi kampus untuk menjalin silaturahmi.
          </p>

          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
          >
            <motion.div variants={fadeInVariants} custom={0} className="card">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">15-20 Mei 2025</h3>
              <p className="text-text-secondary">
                Lima hari kompetisi yang intens dan penuh sportivitas
              </p>
            </motion.div>

            <motion.div variants={fadeInVariants} custom={1} className="card">
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Kampus STIKOM</h3>
              <p className="text-text-secondary">
                Fasilitas modern untuk semua cabang olahraga
              </p>
            </motion.div>

            <motion.div variants={fadeInVariants} custom={2} className="card">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">50+ Peserta</h3>
              <p className="text-text-secondary">
                Mahasiswa dari semua jurusan berkompetisi untuk kemenangan
              </p>
            </motion.div>

            <motion.div variants={fadeInVariants} custom={3} className="card">
              <Trophy className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Hadiah Menarik</h3>
              <p className="text-text-secondary">
                Trofi, medali, dan sertifikat untuk para pemenang
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sports Categories */}
      <section id="sports" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Cabang Olahraga</h2>
          <p className="section-subtitle">
            Pilih dari berbagai cabang olahraga dan tunjukkan kemampuanmu
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {sportsCategories.map((sport, index) => (
              <SportsCard key={sport.id} sport={sport} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="btn btn-primary">
              Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Apa Kata Peserta Sebelumnya</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4">
                  AS
                </div>
                <div>
                  <h4 className="font-bold">Anto Sucipto</h4>
                  <p className="text-sm text-text-secondary">
                    Panitia Penyelengara
                  </p>
                </div>
              </div>
              <p className="text-text-secondary">
                "Berpartisipasi dalam Pekan Olahraga adalah pengalaman luar
                biasa. Organisasinya sempurna dan kompetisinya ketat tapi adil."
              </p>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold mr-4">
                  KR
                </div>
                <div>
                  <h4 className="font-bold">Alfin Kikir</h4>
                  <p className="text-sm text-text-secondary">
                    MVP E-Sport MLBB
                  </p>
                </div>
              </div>
              <p className="text-text-secondary">
                "Event ini mempertemukan mahasiswa dari semua jurusan. Saya
                mendapatkan teman baru dan meningkatkan keterampilan saya dengan
                berkompetisi melawan yang terbaik."
              </p>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold mr-4">
                  AS
                </div>
                <div>
                  <h4 className="font-bold">Anas Aji</h4>
                  <p className="text-sm text-text-secondary">
                    Juara Vocal Solo
                  </p>
                </div>
              </div>
              <p className="text-text-secondary">
                "Fasilitasnya sangat bagus dan staf eventnya sangat membantu.
                Tidak sabar menunggu kompetisi tahun depan!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/cta-bg.jpg"
            alt="Bergabunglah dengan kami"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Siap Bertanding?
            </h2>
            <p className="text-xl mb-8">
              Jangan lewatkan kesempatan untuk menjadi bagian dari event
              olahraga tahunan 2025. Daftarkan tim Anda hari ini!
            </p>
            <Link href="/register" className="btn btn-primary text-lg">
              Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
