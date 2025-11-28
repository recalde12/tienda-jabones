// src/components/ProfileForm.tsx

"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

export function ProfileForm({ user }: { user: any }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Estado para la subida de imagen
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone: '',
    avatar_url: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Cargar datos al iniciar
  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          address: data.address || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [user, supabase]);

  // --- FUNCIÓN PARA SUBIR LA IMAGEN ---
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`; // Nombre único
      const filePath = `${fileName}`;

      // 1. Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars') // Nombre de tu bucket
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Obtener la URL pública
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // 3. Actualizar el estado local (para que se vea la foto nueva al instante)
      setFormData({ ...formData, avatar_url: data.publicUrl });
      
      setMessage({ type: 'success', text: 'Imagen subida correctamente. No olvides guardar cambios.' });

    } catch (error: any) {
      console.error('Error subiendo imagen:', error);
      setMessage({ type: 'error', text: 'Error al subir la imagen.' });
    } finally {
      setUploading(false);
    }
  };
  // ------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...formData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
      <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Tus Datos</h2>
      
      {/* Sección de Avatar Mejorada */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-4 bg-stone-50 rounded-lg">
        {/* Círculo de la foto */}
        <div className="relative w-24 h-24 rounded-full bg-stone-200 overflow-hidden border-2 border-stone-300 shadow-inner flex-shrink-0">
          {formData.avatar_url ? (
            <Image 
              src={formData.avatar_url} 
              alt="Avatar" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-stone-400">
              👤
            </div>
          )}
        </div>

        {/* Botón de subir */}
        <div className="flex-grow text-center sm:text-left">
          <label className="block text-sm font-semibold text-stone-600 mb-2">
            Foto de Perfil
          </label>
          
          {/* Input oculto + Botón estilizado */}
          <div className="relative">
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className={`inline-block px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              uploading 
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'
            }`}>
              {uploading ? 'Subiendo...' : '📷 Seleccionar imagen'}
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-2">Formatos: JPG, PNG. Máx 2MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">Nombre</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-2 border border-stone-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">Apellidos</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-2 border border-stone-300 rounded" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-stone-600 mb-1">Dirección de Envío</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-stone-300 rounded" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-600 mb-1">Teléfono</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-stone-300 rounded" />
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <button 
        disabled={loading || uploading}
        className="w-full bg-stone-700 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  );
}