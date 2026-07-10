import React, { useEffect, useState } from 'react';
import { supabase, useAuth } from './lib/auth';
import { QRCodeSVG } from 'qrcode.react';
import { LogOut, ExternalLink, Download } from 'lucide-react';

export default function Admin() {
  const { user, signOut } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Base URL for the frontend application (where the QR points)
  const baseUrl = window.location.origin;

  function slugify(text: string) {
    return text
      .normalize('NFD')
      .replace(new RegExp('[̀-ͯ]', 'g'), '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function generateUniqueSlug(first: string, last: string) {
    const base = slugify(`${first}-${last}`);
    let slug = base;
    let counter = 2;
    while (employees.some(emp => emp.slug === slug)) {
      slug = `${base}-${counter}`;
      counter++;
    }
    return slug;
  }

  async function fetchEmployees() {
    setLoading(true);
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      setEmployees(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('employees')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          role,
          email,
          phone,
          linkedin_url: linkedin,
          address,
          slug: generateUniqueSlug(firstName, lastName)
        }
      ]);

    if (error) {
      alert("Erreur lors de la création : " + error.message);
    } else {
      // Reset form
      setFirstName('');
      setLastName('');
      setRole('');
      setEmail('');
      setPhone('');
      setLinkedin('');
      setAddress('');
      // Refresh list
      fetchEmployees();
    }
    
    setIsSubmitting(false);
  };

  const handleDownloadQR = (empId: string, firstName: string, lastName: string) => {
    const svg = document.getElementById(`qr-${empId}`)?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const scale = 4;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = `qrcode-${firstName}-${lastName}.png`.toLowerCase();
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white p-8 lg:p-24">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Admin - Cartes de Visite
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden md:block">{user?.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-2 bg-white/5 border border-gray-700 hover:border-red-500/50 hover:text-red-400 text-gray-400 px-4 py-2 rounded-lg transition-all text-sm"
          >
            <LogOut size={16} />
            Déconnecter
          </button>
        </div>
      </div>

      {/* Create Form */}
      <div className="bg-white/5 border border-gray-800 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Ajouter un employé</h2>
        <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Prénom *</label>
            <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nom *</label>
            <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Rôle / Poste *</label>
            <input required type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email *</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Téléphone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">URL LinkedIn</label>
            <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Adresse</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="ex: Libreville, Belle vue 2" className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button disabled={isSubmitting} type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50">
              {isSubmitting ? 'Création...' : 'Créer la carte'}
            </button>
          </div>
        </form>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4">Cartes existantes</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white/5 border border-gray-800 rounded-2xl p-6 flex flex-col items-center">
              <h2 className="text-xl font-bold mb-2">{emp.first_name} {emp.last_name}</h2>
              <p className="text-gray-400 mb-6">{emp.role}</p>
              
              <div id={`qr-${emp.id}`} className="bg-white p-4 rounded-xl mb-4">
                <QRCodeSVG
                  value={`${baseUrl}/card/${emp.slug}`}
                  size={150}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"Q"}
                  marginSize={4}
                />
              </div>

              <div className="flex flex-col gap-2 w-full mt-2">
                <a
                  href={`${baseUrl}/card/${emp.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  <ExternalLink size={15} />
                  Ouvrir la page de profil
                </a>
                <button
                  onClick={() => handleDownloadQR(emp.id, emp.first_name, emp.last_name)}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-gray-700 hover:border-purple-500/50 hover:text-purple-400 text-gray-300 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  <Download size={15} />
                  Télécharger le QR code
                </button>
              </div>
            </div>
          ))}
          
          {employees.length === 0 && (
            <div className="col-span-full text-center text-gray-500 bg-white/5 p-12 rounded-2xl border border-gray-800">
              Aucun employé pour le moment. Remplissez le formulaire ci-dessus !
            </div>
          )}
        </div>
      )}
    </div>
  );
}
