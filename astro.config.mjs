// @ts-check
import { defineConfig } from "astro/config";
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  base: '/AutomationAI/', // importante si el repo no es del tipo "usuario.github.io"
});
