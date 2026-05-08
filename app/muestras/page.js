import { redirect } from 'next/navigation';

export default function MuestrasPage() {
  // Redirigir al configurador donde el cliente puede crear su propio diseño.
  // Cuando exista una galería pública con muestras reales, apuntar aquí.
  redirect('/stickers/designer');
}
