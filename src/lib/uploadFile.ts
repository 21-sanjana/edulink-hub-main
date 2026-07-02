import { supabase } from './supabase';

export const uploadFile = async (file: File, folder: string) => {
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from('edulink-files')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('edulink-files')
    .getPublicUrl(fileName);

  return data.publicUrl;
};