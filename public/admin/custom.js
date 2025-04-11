const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Handler para cuando se guarda un post (sea como borrador o publicado)
window.CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    let data = entry.get('data');
    const title = data.get('title');
    const description = data.get('description');
    let slug = data.get('slug');
    let seoTitle = data.get('seoTitle');
    let seoDescription = data.get('seoDescription');

    // Generar slug basado en el título si no existe
    if (title) {
      slug = slugify(title);
      data = data.set('slug', slug);
    }

    // Auto-completar campos SEO si están vacíos
    if (!seoTitle && title) {
      data = data.set('seoTitle', title);
    }

    if (!seoDescription && description) {
      data = data.set('seoDescription', description);
    }
    
    return data;
  },
});

// Handler específico para cuando se publica un post
window.CMS.registerEventListener({
  name: 'postPublish',
  handler: ({ entry }) => {
    let data = entry.get('data');
    
    // Asegurarse que draft es false cuando se publica
    data = data.set('draft', false);
    
    return entry.set('data', data);
  }
});

// Mejora para auto-completar campos en tiempo real mientras escribes
window.addEventListener('load', function() {
  setTimeout(function() {
    // Dar tiempo a que el CMS cargue completamente
    const titleInput = document.querySelector('input[name="title"]');
    const slugInput = document.querySelector('input[name="slug"]');
    const seoTitleInput = document.querySelector('input[name="seoTitle"]');
    const descriptionInput = document.querySelector('textarea[name="description"]');
    const seoDescriptionInput = document.querySelector('textarea[name="seoDescription"]');

    if (titleInput) {
      titleInput.addEventListener('input', function() {
        const newTitle = titleInput.value;
        
        // Auto-completar el slug en tiempo real
        if (slugInput && (slugInput.value === '' || !slugInput.value)) {
          slugInput.value = slugify(newTitle);
          // Disparar un evento para que el CMS detecte el cambio
          slugInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Auto-completar el seoTitle en tiempo real
        if (seoTitleInput && (seoTitleInput.value === '' || !seoTitleInput.value)) {
          seoTitleInput.value = newTitle;
          seoTitleInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }

    if (descriptionInput) {
      descriptionInput.addEventListener('input', function() {
        const newDescription = descriptionInput.value;
        
        // Auto-completar el seoDescription en tiempo real
        if (seoDescriptionInput && (seoDescriptionInput.value === '' || !seoDescriptionInput.value)) {
          seoDescriptionInput.value = newDescription;
          seoDescriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }
  }, 1500); // Esperar 1.5 segundos para que el CMS cargue completamente
});