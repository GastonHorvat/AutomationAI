// src/types.ts (Ejemplo)
export interface PostFromView {
    post_id: string;
    post_slug: string;
    post_title: string;
    post_description: string | null;
    author_name: string | null;
    published_at: string | null; // Sigue siendo string desde la DB/Vista
    category_name: string | null;
    category_slug: string | null;
    tag_names: string[] | null;
    tag_slugs: string[] | null;
    post_image_url: string | null;
    is_featured?: boolean; // Dejamos opcional por si acaso
    estimated_read_time: number | null; // <<< --- ¡¡AÑADIDO AQUÍ!!
    post_content?: string | null; // Si trajiste el contenido a la vista
    // ...
  }
  
export interface PostFromView {
    post_id: string;
    post_slug: string;
    post_title: string;
    post_description: string | null;
    author_name: string | null;
    published_at: string | null;
    category_name: string | null;
    category_slug: string | null;
    tag_names: string[] | null;
    tag_slugs: string[] | null;
    post_image_url: string | null;
    is_featured?: boolean;
    estimated_read_time: number | null;
  }

  export interface ToolFromView { // ¡ASEGÚRATE QUE ESTOS CAMPOS COINCIDAN CON TU VISTA tools_view!
    tool_id: string;
    tool_name: string;
    tool_slug: string;
    tool_description: string | null;
    tool_link: string | null;
    tool_image_url: string | null;
    tool_rating: number | null;
    tool_pricing_model: string | null;
    category_name: string | null; // Nombre de categoría de tool
    category_slug: string | null; // Slug de categoría de tool
    subcategory_name: string | null;
    subcategory_slug: string | null;
    tag_names: string[] | null; // Nombres de tags (de la tabla tags)
    tag_slugs: string[] | null; // Slugs de tags (de la tabla tags)
    // created_at, updated_at si los necesitas
  }
  
  // Puedes añadir otros tipos globales aquí
  export interface TagInfo { name: string; color: string; }
  export interface GroupedTools { [category: string]: ToolFromView[]; }