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

window.CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    let data = entry.get('data');
    const title = data.get('title');
    const description = data.get('description');
    let slug = data.get('slug');
    let seoTitle = data.get('seoTitle');
    let seoDescription = data.get('seoDescription');

    if (!slug && title) {
      slug = slugify(title);
      data = data.set('slug', slug);
    }

    if (!seoTitle && title) {
      data = data.set('seoTitle', title);
    }

    if (!seoDescription && description) {
      data = data.set('seoDescription', description);
    }

    return data;
  },
});

// Auto-fill slug, seoTitle, seoDescription in real time (better UX)
window.CMS.registerPreviewStyle('', { raw: true });

window.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.querySelector('input[name="title"]');
  const slugInput = document.querySelector('input[name="slug"]');
  const seoTitleInput = document.querySelector('input[name="seoTitle"]');
  const descriptionInput = document.querySelector('textarea[name="description"]');
  const seoDescriptionInput = document.querySelector('textarea[name="seoDescription"]');

  if (titleInput) {
    titleInput.addEventListener('input', () => {
      const newTitle = titleInput.value;

      if (slugInput && slugInput.value === '') {
        slugInput.value = slugify(newTitle);
      }

      if (seoTitleInput && seoTitleInput.value === '') {
        seoTitleInput.value = newTitle;
      }
    });
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('input', () => {
      const newDescription = descriptionInput.value;

      if (seoDescriptionInput && seoDescriptionInput.value === '') {
        seoDescriptionInput.value = newDescription;
      }
    });
  }
});
