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

// Guardar la función original de inicialización de CMS
const originalInit = window.CMS && window.CMS.init;

// Sobreescribir la función init si existe
if (originalInit) {
  window.CMS.init = function(...args) {
    // Iniciar el CMS como normalmente lo haría
    const result = originalInit.apply(this, args);
    
    // Ejecutar nuestro código después
    setTimeout(setupFieldListeners, 2000); // Dar tiempo para que la UI se cargue completamente
    
    return result;
  };
} else {
  // Si CMS aún no está disponible, esperar a que se cargue
  window.addEventListener('load', function() {
    setTimeout(function() {
      if (window.CMS) {
        setupFieldListeners();
        registerEventListeners();
      } else {
        console.warn('CMS no disponible después de cargar la página');
      }
    }, 2000);
  });
}

function setupFieldListeners() {
  console.log('Configurando event listeners para campos del CMS');
  
  // Función para buscar elementos periódicamente hasta que aparezcan
  function waitForElement(selector, callback, maxAttempts = 15, interval = 500) {
    let attempts = 0;
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Elemento encontrado: ${selector}`);
        callback(element);
        return true;
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkElement, interval);
        return false;
      }
      console.warn(`No se encontró el elemento: ${selector} después de ${maxAttempts} intentos`);
      return false;
    };
    
    checkElement();
  }
  
  // Buscar campos e instalar listeners
  waitForElement('input[name="title"]', (titleInput) => {
    console.log('Campo de título encontrado, configurando evento');
    
    waitForElement('input[name="slug"]', (slugInput) => {
      console.log('Campo de slug encontrado');
      
      // Configurar listener para autocompletar el slug basado en el título
      titleInput.addEventListener('input', function() {
        const newTitle = titleInput.value;
        
        if (slugInput && (!slugInput.value || slugInput.value === '')) {
          console.log('Autocompletando slug con:', slugify(newTitle));
          slugInput.value = slugify(newTitle);
          slugInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
    
    waitForElement('input[name="seoTitle"]', (seoTitleInput) => {
      console.log('Campo de seoTitle encontrado');
      
      // Configurar listener para autocompletar el título SEO basado en el título
      titleInput.addEventListener('input', function() {
        const newTitle = titleInput.value;
        
        if (seoTitleInput && (!seoTitleInput.value || seoTitleInput.value === '')) {
          console.log('Autocompletando seoTitle con:', newTitle);
          seoTitleInput.value = newTitle;
          seoTitleInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
  });
  
  waitForElement('textarea[name="description"]', (descriptionInput) => {
    console.log('Campo de descripción encontrado');
    
    waitForElement('textarea[name="seoDescription"]', (seoDescriptionInput) => {
      console.log('Campo de seoDescription encontrado');
      
      // Configurar listener para autocompletar la descripción SEO
      descriptionInput.addEventListener('input', function() {
        const newDescription = descriptionInput.value;
        
        if (seoDescriptionInput && (!seoDescriptionInput.value || seoDescriptionInput.value === '')) {
          console.log('Autocompletando seoDescription');
          seoDescriptionInput.value = newDescription;
          seoDescriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
  });
}

function registerEventListeners() {
  if (!window.CMS) {
    console.warn('No se puede registrar eventos: CMS no disponible');
    return;
  }
  
  // Handler para cuando se guarda un post (ya sea como borrador o publicado)
  window.CMS.registerEventListener({
    name: 'preSave',
    handler: ({ entry }) => {
      console.log('Evento preSave activado');
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
        console.log('Slug generado:', slug);
      }

      // Auto-completar campos SEO si están vacíos
      if (title && (!seoTitle || seoTitle === '')) {
        data = data.set('seoTitle', title);
        console.log('seoTitle establecido:', title);
      }

      if (description && (!seoDescription || seoDescription === '')) {
        data = data.set('seoDescription', description);
        console.log('seoDescription establecido desde descripción');
      }
      
      return data;
    },
  });

  // Handler específico para cuando se publica un post
  window.CMS.registerEventListener({
    name: 'postPublish',
    handler: ({ entry }) => {
      console.log('Evento postPublish activado - Cambiando draft a false');
      let data = entry.get('data');
      
      // Asegurarse que draft es false cuando se publica
      data = data.set('draft', false);
      
      // Esto garantiza que se publique realmente
      console.log('El post ha sido marcado como publicado (draft=false)');
      
      return entry.set('data', data);
    }
  });
  
  // Opcionalmente, añadir un evento cuando se completa la inicialización del CMS
  window.CMS.registerEventListener({
    name: 'init',
    handler: () => {
      console.log('CMS inicializado completamente');
      setupFieldListeners();
    }
  });
}

// Registrar los event listeners cuando se cargue el script
if (window.CMS) {
  console.log('CMS ya disponible, registrando eventos');
  registerEventListeners();
  
  // Si CMS ya está inicializado, configurar los listeners ahora
  if (document.querySelector('iframe')) {
    console.log('CMS parece estar ya cargado, configurando listeners inmediatamente');
    setupFieldListeners();
  }
} else {
  // Si CMS aún no está disponible, esperar a que se cargue
  window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, esperando CMS...');
    
    // Intentar periódicamente registrar los eventos hasta que CMS esté disponible
    const checkCMS = setInterval(function() {
      if (window.CMS) {
        console.log('CMS disponible, registrando eventos');
        clearInterval(checkCMS);
        registerEventListeners();
      }
    }, 500);
    
    // Establecer un tiempo máximo de espera
    setTimeout(function() {
      clearInterval(checkCMS);
      if (!window.CMS) {
        console.error('CMS no disponible después de esperar');
      }
    }, 10000);
  });
}

// Para asegurarnos de que el script se ejecuta una vez cargado el CMS
document.addEventListener("DOMContentLoaded", function() {
  console.log('DOM cargado, configurando observador del CMS');
  
  // Observar cuando se añade el iframe del CMS al DOM
  const observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        for (let node of mutation.addedNodes) {
          if (node.tagName === 'IFRAME' && node.id === 'nc-root') {
            console.log('iframe del CMS detectado');
            setTimeout(setupFieldListeners, 2000);
            observer.disconnect();
            break;
          }
        }
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Como respaldo, intentar configurar después de un tiempo fijo
  setTimeout(function() {
    if (window.CMS) {
      console.log('Intentando configurar listeners después de timeout');
      setupFieldListeners();
    }
  }, 5000);
});