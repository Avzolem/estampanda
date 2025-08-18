import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Redirigir a home por ahora ya que no hay sistema de login implementado
  redirect('/');
}