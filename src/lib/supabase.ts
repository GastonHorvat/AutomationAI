// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

// Validar que las variables existan (importante)
if (!supabaseUrl || !supabaseAnonKey) {
  // En desarrollo, lanza un error claro. En producción (build),
  // puede que quieras manejarlo diferente, pero fallar es a menudo lo más seguro.
  if (import.meta.env.DEV) {
    throw new Error("Supabase URL or Anon Key is missing. Check your .env file.");
  } else {
    // En producción, podríamos simplemente registrar un error y devolver un cliente nulo o similar,
    // aunque lo ideal es que estas variables SIEMPRE estén presentes en el entorno de build.
    console.error("Supabase URL or Anon Key missing in production environment!");
    // throw new Error("Supabase configuration error in production."); // Opcional: Fallar también en prod
  }
}

// Crear y exportar el cliente Supabase
// Usamos un chequeo para asegurarnos de que no falle si las variables faltan en producción (depende del manejo de errores arriba)
export const supabase = (supabaseUrl && supabaseAnonKey)
                         ? createClient(supabaseUrl, supabaseAnonKey)
                         : null; // O manejar el caso de cliente nulo en las páginas si puede ocurrir

// O, si prefieres que siempre falle si faltan variables (más seguro):
// export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);