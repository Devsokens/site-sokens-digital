import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './lib/auth';
import { Phone, MapPin, Mail, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CardProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      if (!slug) return;
      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('slug', slug)
        .single();
      if (data) setEmployee(data);
      setLoading(false);
    }
    fetchEmployee();
  }, [slug]);

  const fullName = employee ? `${employee.first_name} ${employee.last_name}` : '';
  const nameSizeClass =
    fullName.length > 28
      ? 'text-xs sm:text-lg md:text-2xl'
      : fullName.length > 18
      ? 'text-sm sm:text-xl md:text-3xl'
      : 'text-base sm:text-2xl md:text-3xl';

  const handleDownloadVCard = () => {
    if (!slug) return;
    window.location.href = `/api/vcard/${slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d18] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white/40"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-[#080d18] flex items-center justify-center text-white">
        Carte introuvable.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d18] flex items-center justify-center p-4 overflow-hidden">

      {/* Subtle background texture glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-slate-800/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl"
      >

        {/* ===== BUSINESS CARD ===== */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0c1220 100%)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Subtle top-right shine */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/3 to-transparent rounded-tr-full pointer-events-none"></div>

          <div className="flex flex-row">

            {/* LEFT: Logo Area */}
            <div className="flex items-center justify-center p-3 sm:p-6 md:p-8 md:pr-8 border-r border-white/10 min-w-[90px] sm:min-w-[140px] md:min-w-[200px]">
              <img
                src="/assets/Logo_SOKENS_DIGITAL-removebg-preview.png"
                alt="Sokens Digital"
                className="w-16 sm:w-28 md:w-40 object-contain"
              />
            </div>

            {/* RIGHT: Contact Info */}
            <div className="flex-1 min-w-0 p-4 sm:p-8 md:p-10">
              {/* Name */}
              <h1 className={`text-white font-semibold tracking-wide mb-1 sm:mb-2 leading-tight break-words line-clamp-2 ${nameSizeClass}`}>
                {employee.first_name} {employee.last_name.toUpperCase()}
              </h1>
              {/* Role */}
              <p className="text-white/60 text-[11px] sm:text-sm leading-relaxed mb-3 sm:mb-6 md:mb-8 line-clamp-2 break-words">
                {employee.role}
              </p>

              {/* Contact Details */}
              <div className="space-y-2 sm:space-y-4">
                {employee.phone && (
                  <a href={`tel:${employee.phone}`} className="flex items-center gap-2 sm:gap-3 group">
                    <Phone size={13} className="text-white/50 group-hover:text-white transition-colors flex-shrink-0 sm:w-[15px] sm:h-[15px]" />
                    <span className="text-white/80 text-[11px] sm:text-sm group-hover:text-white transition-colors truncate">
                      {employee.phone}
                    </span>
                  </a>
                )}
                {employee.address && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin size={13} className="text-white/50 flex-shrink-0 sm:w-[15px] sm:h-[15px]" />
                    <span className="text-white/80 text-[11px] sm:text-sm truncate">{employee.address}</span>
                  </div>
                )}
                {employee.email && (
                  <a href={`mailto:${employee.email}`} className="flex items-center gap-2 sm:gap-3 group">
                    <Mail size={13} className="text-white/50 group-hover:text-white transition-colors flex-shrink-0 sm:w-[15px] sm:h-[15px]" />
                    <span className="text-white/80 text-[11px] sm:text-sm group-hover:text-white transition-colors truncate">
                      {employee.email}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ===== END BUSINESS CARD ===== */}

        {/* Save Contact Button (below the card) */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={handleDownloadVCard}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]"
        >
          <Download size={18} />
          Enregistrer le contact
        </motion.button>
      </motion.div>
    </div>
  );
}
