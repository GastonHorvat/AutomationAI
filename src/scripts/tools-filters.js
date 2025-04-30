// src/scripts/tools-filters.js - v4.2 FINAL CORREGIDA

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing tool filters v4.2...');

    // --- Selectores ---
    const filterContainer = document.querySelector('.new-filter-container');
    const categoriesContainer = document.querySelector('.categories-container');
    const noResultsMessage = document.getElementById('no-results-message');
    const searchInput = document.getElementById('tool-search-input');
    const activeFiltersArea = document.querySelector('.active-filters-area');
    const pillsPlaceholder = activeFiltersArea?.querySelector('.default-pill');
    const clearAllBtn = activeFiltersArea?.querySelector('.clear-all-filters');

    if (!filterContainer || !categoriesContainer || !noResultsMessage || !activeFiltersArea || !pillsPlaceholder || !clearAllBtn || !searchInput) {
        console.error('Filter elements missing. Filtering disabled.');
        return;
    }

    const allToolCardWrappers = categoriesContainer.querySelectorAll('.tool-card-wrapper');
    let activeFilters = { category: null, price: null, rating: null, search: '' };

    // --- Definiciones de Funciones Auxiliares ---

    function updateActivePills() {
        activeFiltersArea.querySelectorAll('.filter-pill:not(.default-pill)').forEach(pill => pill.remove());
        let hasActiveFilter = false;
        const placeholder = activeFiltersArea.querySelector('.default-pill'); // Busca píldora default

        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value && key !== 'search') {
                hasActiveFilter = true;
                const pill = document.createElement('span');
                pill.className = 'filter-pill active-pill';
                pill.dataset.filterType = key;
                pill.dataset.filterValue = value;
                let displayText = value;
                if (key === 'rating' && typeof value === 'string' && value.endsWith('+')) {
                    displayText = `${value.replace('+', '')}+ stars`;
                }
                pill.textContent = displayText;
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-pill';
                removeBtn.type = 'button'; // Buena práctica
                removeBtn.innerHTML = '×';
                removeBtn.setAttribute('aria-label', `Remove ${displayText} filter`);
                // El listener principal manejará el clic en este botón
                pill.appendChild(removeBtn);
                activeFiltersArea.insertBefore(pill, clearAllBtn);
            }
        });
        if (placeholder) placeholder.hidden = hasActiveFilter;
        if (clearAllBtn) clearAllBtn.hidden = !hasActiveFilter;
    }

    function applyFilters() {
        console.log('Applying filters:', activeFilters);
        let visibleCount = 0;
        const visibleCategories = new Set();
        const searchTerm = activeFilters.search.toLowerCase().trim();

        allToolCardWrappers.forEach(cardWrapper => {
            if (!(cardWrapper instanceof HTMLElement) || !cardWrapper.dataset) return;
            const cardCategory = cardWrapper.dataset.category || null;
            const cardPrice = cardWrapper.dataset.pricingModel || null;
            const cardRating = cardWrapper.dataset.rating ? parseInt(cardWrapper.dataset.rating, 10) : null;

            const categoryMatch = !activeFilters.category || cardCategory === activeFilters.category;
            // TODO: Ajustar lógica Price/Rating según necesites
            const priceMatch = !activeFilters.price || activeFilters.price === 'All' || (cardPrice && activeFilters.price === cardPrice);
            let ratingMatch = true;
            if(activeFilters.rating && activeFilters.rating !== 'All') {
                 if (cardRating !== null) {
                     const minRating = parseInt(activeFilters.rating.replace('+ stars',''), 10);
                     ratingMatch = cardRating >= minRating;
                 } else {
                     ratingMatch = false;
                 }
            }

            const toolName = cardWrapper.querySelector('.tool-name')?.textContent?.toLowerCase() || '';
            const toolDesc = cardWrapper.querySelector('.tool-description')?.textContent?.toLowerCase() || '';
            const searchMatch = !searchTerm || toolName.includes(searchTerm) || toolDesc.includes(searchTerm);

            const shouldShow = categoryMatch && priceMatch && ratingMatch && searchMatch;
            cardWrapper.classList.toggle('hidden-by-filter', !shouldShow);
            if (shouldShow) { visibleCount++; if (cardCategory) visibleCategories.add(cardCategory); }
        });

        const categorySections = categoriesContainer.querySelectorAll('section.category-section');
        categorySections.forEach(section => {
           if (!(section instanceof HTMLElement) || !section.dataset) return;
           const categoryName = section.dataset.category;
           section.style.display = (categoryName && visibleCategories.has(categoryName)) ? 'block' : 'none';
        });

        noResultsMessage.hidden = visibleCount > 0;
        updateActivePills();
        updateDropdownButtonText(document.getElementById('category-filter-btn'), activeFilters.category || 'Category');
        updateDropdownButtonText(document.getElementById('price-filter-btn'), activeFilters.price || 'Price');
        updateDropdownButtonText(document.getElementById('rating-filter-btn'), activeFilters.rating ? activeFilters.rating : 'Rating');
    }

    function updateDropdownButtonText(button, text) {
        if (!button) return;
        const span = button.querySelector('span');
        // Solo actualiza si span existe y el texto es diferente
        if (span && span.textContent !== text) span.textContent = text;
    }

    function clearAll() {
        console.log('Clear All triggered');
        activeFilters = { category: null, price: null, rating: null, search: '' };
        if (searchInput instanceof HTMLInputElement) searchInput.value = '';
        // Desmarcar opciones
         document.querySelectorAll('.dropdown-menu li.selected').forEach(li => li.classList.remove('selected'));
         document.querySelectorAll('.dropdown-menu li[data-value="all"]').forEach(li => {
             if (li instanceof HTMLElement) li.classList.add('selected');
         });
        closeAllDropdowns(); // Cierra por si acaso
        applyFilters();
    }

     function toggleDropdown(button, menu) {
         if (!button || !menu) { console.error('[toggleDropdown] Button or menu missing'); return; }
         const willOpen = menu.hidden;
         // console.log(`[toggleDropdown] Will open: ${willOpen}`);
         closeAllDropdowns(menu); // Cierra otros *antes* de abrir/cerrar este
         menu.hidden = !willOpen;
         button.setAttribute('aria-expanded', String(willOpen));
         const icon = button.querySelector('.dropdown-icon');
         if (icon instanceof HTMLElement) icon.style.transform = willOpen ? 'rotate(180deg)' : 'rotate(0deg)';
     }

    function closeAllDropdowns(exceptMenu = null) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== exceptMenu && menu instanceof HTMLElement && !menu.hidden) {
                menu.hidden = true;
                const buttonId = menu.id ? menu.id.replace('-options', '-btn') : null;
                const button = buttonId ? document.getElementById(buttonId) : null;
                if (button instanceof HTMLButtonElement) {
                    button.setAttribute('aria-expanded', 'false');
                    const icon = button.querySelector('.dropdown-icon');
                    if (icon instanceof HTMLElement) icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    }
    // --- FIN Funciones ---

    // --- Listener Principal en Contenedor ---
    filterContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        // console.log('Filter Container Clicked. Target:', target);

        // Prioridad 1: Clic en 'X' de píldora
        if (target.classList.contains('remove-pill')) {
            const pill = target.closest('.filter-pill');
            if (pill instanceof HTMLElement && pill.dataset.filterType) {
                console.log(`Remove Pill Clicked: Type=${pill.dataset.filterType}`);
                activeFilters[pill.dataset.filterType] = null;
                applyFilters();
            }
            return; // Manejado
        }

        // Prioridad 2: Clic en opción de menú
        const dropdownOption = target.closest('.dropdown-menu li[data-value]');
        if (dropdownOption instanceof HTMLElement && dropdownOption.dataset.value !== undefined) {
            const menu = dropdownOption.closest('.dropdown-menu');
            let filterType = null;
            if (menu?.id === 'category-filter-options') filterType = 'category';
            else if (menu?.id === 'price-filter-options') filterType = 'price';
            else if (menu?.id === 'rating-filter-options') filterType = 'rating';

            if (filterType) {
                const selectedValue = dropdownOption.dataset.value.toLowerCase() === 'all' ? null : dropdownOption.dataset.value;
                console.log(`Filter Update: Type=${filterType}, Value=${selectedValue}`);
                activeFilters[filterType] = selectedValue; // Asigna null si fue 'all'
                applyFilters();

                if (menu) { // Marcar opción seleccionada
                    menu.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                    dropdownOption.classList.add('selected');
                }
                closeAllDropdowns();
            } else {
                console.warn('Could not determine filter type from menu:', menu);
            }
            return; // Manejado
        }

        // Prioridad 3: Clic en botón para abrir/cerrar dropdown
        const dropdownButton = target.closest('.filter-dropdown-toggle');
        if (dropdownButton instanceof HTMLButtonElement) {
            // e.stopPropagation(); // No necesario si el document listener verifica el target
            console.log(`Dropdown Button Clicked: ${dropdownButton.id}`);
            const menuId = dropdownButton.id.replace('-btn', '-options');
            const menu = document.getElementById(menuId);

            if (menu instanceof HTMLElement && menu.classList.contains('dropdown-menu')) {
                console.log(`Calling toggleDropdown for button ${dropdownButton.id}`);
                toggleDropdown(dropdownButton, menu); // Llama a la función que abre/cierra
            } else {
                console.error(`Dropdown menu (${menuId}) not found or not correct element for button: ${dropdownButton.id}`);
            }
            return; // Manejado
        }

        // Prioridad 4: Clic en "Clear All"
        if (target.closest('.clear-all-filters')) {
            clearAll();
            return; // Manejado
        }

        // Si el clic fue en otra parte del filterContainer, no hacer nada específico aquí
    }); // Fin listener filterContainer

    // Listener para Búsqueda
    if (searchInput instanceof HTMLInputElement) {
        searchInput.addEventListener('input', (e) => {
            if (e.target instanceof HTMLInputElement) {
                activeFilters.search = e.target.value;
                applyFilters();
            }
        });
    }

    // Listeners globales
    document.addEventListener('click', (e) => { // Cerrar al hacer clic fuera
        if (e.target instanceof Node && !filterContainer.contains(e.target)) {
            closeAllDropdowns();
        }
    });
    document.addEventListener('keydown', (e) => { // Cerrar con Escape y navegación
        if (e.key === 'Escape') { closeAllDropdowns(); return; } // Cierra y termina

        const activeMenu = document.querySelector('.dropdown-menu:not([hidden])');
        if (!activeMenu) return; // Si no hay menú activo, no hacer nada más con teclas

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
             e.preventDefault();
             const options = Array.from(activeMenu.querySelectorAll('li[role="option"]'));
             if (!options.length) return;
             const currentFocusIndex = options.findIndex(opt => opt === document.activeElement);
             let nextFocusIndex = -1;
             if (e.key === 'ArrowDown') nextFocusIndex = (currentFocusIndex === -1 || currentFocusIndex >= options.length - 1) ? 0 : currentFocusIndex + 1;
             else nextFocusIndex = (currentFocusIndex <= 0) ? options.length - 1 : currentFocusIndex - 1;
             const nextOption = options[nextFocusIndex];
             if (nextOption instanceof HTMLElement) nextOption.focus();
        } else if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.matches('li[data-value]')) {
             e.preventDefault();
             if (document.activeElement instanceof HTMLElement) document.activeElement.click();
        }
    });

    // --- Inicialización ---
    if (pillsPlaceholder) pillsPlaceholder.textContent = pillsPlaceholder.dataset.defaultText || 'All Tools';
    // Marcar 'All' como seleccionado por defecto en los menús
    document.querySelectorAll('.dropdown-menu li[data-value="all"]').forEach(li => li.classList.add('selected'));
    applyFilters(); // Aplica estado inicial

}); // Fin DOMContentLoaded