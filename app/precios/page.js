import { redirect } from 'next/navigation';

export default function PreciosPage() {
  // Redirigir al diseñador donde está la calculadora de precios
  redirect('/stickers/designer');
}