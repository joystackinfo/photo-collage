import { supabase } from '../lib/supabase';

/**
 * Generate a random short ID for the share link
 * e.g. "a1b2c3d4e"
 */
const generateShareId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Upload a collage image to Supabase Storage and create a share link
 * @param imageBlob - the collage image as a Blob (from canvas.toBlob())
 * @returns the shareable URL, or throws an error if it fails
 */
export const createShareLink = async (imageBlob: Blob): Promise<string> => {
  const shareId = generateShareId();
  const fileName = `${shareId}.png`;

  //  Upload the image to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('collage_images')
    .upload(fileName, imageBlob, {
      contentType: 'image/png',
      cacheControl: '3600',
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  //  Get the public URL for that uploaded image
  const { data: publicUrlData } = supabase.storage
    .from('collage_images')
    .getPublicUrl(fileName);

  const imagePath = publicUrlData.publicUrl;

  //  Save a record in the share_links table
  const { error: insertError } = await supabase.from('share_links').insert({
    id: shareId,
    image_path: imagePath,
  });

  if (insertError) {
    throw new Error(`Could not save share link: ${insertError.message}`);
  }

  //. Return the shareable URL (this app's own /share/:id route)
  return `${window.location.origin}/share/${shareId}`;
};

/**
 * Fetch a shared image's URL by its share ID
 * @param shareId - the id from the URL (e.g. /share/abc123xyz)
 * @returns the image URL, or null if not found
 */
export const getSharedImage = async (shareId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('share_links')
    .select('image_path')
    .eq('id', shareId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.image_path;
};