import { redirect } from 'next/navigation';

export default function MuestrasPage() {
  // Redirigir a la galería de stickers donde están los ejemplos
  redirect('/stickers/gallery');
}