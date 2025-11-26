// src/app/login/page.tsx

"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Cuando el usuario inicie sesión, redirigirlo al inicio
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
        router.refresh(); // Refresca la página para que el server vea la sesión
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        Accede a tu cuenta
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google']} // Puedes añadir 'github', 'facebook', etc.
          localization={{
            variables: {
              sign_in: { email_label: 'Email', password_label: 'Contraseña', button_label: 'Iniciar sesión' },
              sign_up: { email_label: 'Email', password_label: 'Contraseña', button_label: 'Registrarse' },
            },
          }}
        />
      </div>
    </div>
  );
}