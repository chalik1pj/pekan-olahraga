"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users } from "lucide-react";

type Sport = {
  id: number;
  name: string;
  imagePath: string;
  participants: number;
  price: number;
};

type SportsCardProps = {
  sport: Sport;
  index: number;
};

export default function SportsCard({ sport, index }: SportsCardProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
      className="card group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 relative w-24 h-24">
          <Image
            src={sport.imagePath || "/placeholder.svg"}
            alt={sport.name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-bold mb-2">{sport.name}</h3>

        <div className="flex items-center justify-center text-text-secondary mb-2">
          <Users className="h-4 w-4 mr-1" />
          <span>{sport.participants} peserta</span>
        </div>

        <div className="text-primary font-semibold mb-4">
          Rp {sport.price.toLocaleString()}
        </div>

        <Link
          href={`/register?sport=${sport.id}`}
          className="mt-auto inline-flex items-center text-primary hover:underline"
        >
          Daftar Sekarang
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
