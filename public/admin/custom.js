// public/admin/custom.js

// Convierte string a slug limpio
const slugify = (text) => {
    return text
      .toString()
      .normalize('NFD') // elimina tildes
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // solo letras, números y espacios
      .replace(/\s+/g, '-')         // espacios a guiones
      .replace(/-+/g, '-');         // quita guiones repetidos
  };
  
  window.CMS.registerEventListener({
    name: 'preSave',
    handler: ({ entry }) => {
      const data = entry.get('data');
      const title = data.get('title');
      let slug = data.get('slug');
  
      if (!slug && title) {
        slug = slugify(title);
        return entry.get('data').set('slug', slug);
      }

      if (!seoTitle && title) {
        data = data.set('seoTitle', title);
      }
  
      if (!seoDescription && description) {
        data = data.set('seoDescription', description);
      }
  
      return entry.get('data');
    },
  });
  