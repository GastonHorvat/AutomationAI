document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores ---
    const allToolCardWrappers = document.querySelectorAll('.tool-card-wrapper');
    const categorySections = document.querySelectorAll('section.category-section');
    const filterControlDiv = document.querySelector('.filter-controls');
    const noResultsMessage = document.getElementById('no-results-message');
    
    // --- Comprobación Inicial ---
    if (!filterControlDiv) return; // Salir si no hay controles

    // --- Estado ---
    let selectedTags = [];
    let selectedCategories = [];

    // --- SISTEMA DE ACORDEÓN SIMPLIFICADO ---
    const tagFilterSection = document.querySelector('.filter-section[data-filter-type="tags"]');
    const categoryFilterSection = document.querySelector('.filter-section[data-filter-type="categories"]');
    
    // 1. Función simple para abrir/cerrar un acordeón
    function toggleAccordion(section) {
        if (!section) return;
        
        const wrapper = section.querySelector('.filter-options-wrapper');
        const button = section.querySelector('.toggle-filters');
        const icon = button ? button.querySelector('.toggle-icon svg') : null;
        
        if (!wrapper || !button) return;
        
        // Si tiene la clase 'is-closed', lo vamos a abrir
        const willBeVisible = wrapper.classList.contains('is-closed');
        
        // Si lo vamos a hacer visible, primero cerramos TODOS los demás
        if (willBeVisible) {
            // Cerrar todos los acordeones
            document.querySelectorAll('.filter-section.collapsible').forEach((otherSection) => {
                if (otherSection !== section) {
                    const otherWrapper = otherSection.querySelector('.filter-options-wrapper');
                    const otherButton = otherSection.querySelector('.toggle-filters');
                    const otherIcon = otherButton ? otherButton.querySelector('.toggle-icon svg') : null;
                    
                    if (otherWrapper) {
                        otherWrapper.classList.add('is-closed');
                        otherWrapper.style.display = 'none';
                    }
                    
                    if (otherButton) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }
                    
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                    
                    otherSection.classList.remove('is-open');
                }
            });
        }
        
        // Configuramos este acordeón
        if (willBeVisible) {
            wrapper.classList.remove('is-closed');
            wrapper.style.display = 'block';
            button.setAttribute('aria-expanded', 'true');
            if (icon) icon.style.transform = 'rotate(180deg)';
            section.classList.add('is-open');
        } else {
            wrapper.classList.add('is-closed');
            wrapper.style.display = 'none';
            button.setAttribute('aria-expanded', 'false');
            if (icon) icon.style.transform = 'rotate(0deg)';
            section.classList.remove('is-open');
        }
        
        console.log(`Acordeón ${section.getAttribute('data-filter-type')} ahora está ${willBeVisible ? 'visible' : 'oculto'}`);
    }
    
    // 2. Event listeners para los botones de acordeón
    if (tagFilterSection) {
        const tagToggleBtn = tagFilterSection.querySelector('.toggle-filters');
        if (tagToggleBtn) {
            tagToggleBtn.addEventListener('click', () => toggleAccordion(tagFilterSection));
        }
        
        // Event listener para el header (clicks fuera del botón)
        const tagHeader = tagFilterSection.querySelector('.filter-header');
        if (tagHeader) {
            tagHeader.addEventListener('click', (e) => {
                if (e.target.closest('.toggle-filters')) return; // Ignorar si el clic fue en el botón
                toggleAccordion(tagFilterSection);
            });
        }
    }
    
    if (categoryFilterSection) {
        const categoryToggleBtn = categoryFilterSection.querySelector('.toggle-filters');
        if (categoryToggleBtn) {
            categoryToggleBtn.addEventListener('click', () => toggleAccordion(categoryFilterSection));
        }
        
        // Event listener para el header (clicks fuera del botón)
        const categoryHeader = categoryFilterSection.querySelector('.filter-header');
        if (categoryHeader) {
            categoryHeader.addEventListener('click', (e) => {
                if (e.target.closest('.toggle-filters')) return; // Ignorar si el clic fue en el botón
                toggleAccordion(categoryFilterSection);
            });
        }
    }

    // --- SISTEMA DE FILTRADO ---
    function applyAllFilters() {
        let visibleCategories = new Set();
        let hasVisibleTools = false;

        allToolCardWrappers.forEach(cardWrapper => {
            if (!(cardWrapper instanceof HTMLElement)) return;
            const card = cardWrapper.querySelector('.tool-card');
            if (!card) return;

            const cardTags = card.getAttribute('data-tags')?.split(',') || [];
            const cardCategory = cardWrapper.closest('section.category-section')?.getAttribute('data-category') || 'Uncategorized';

            const tagMatch = selectedTags.length === 0 || cardTags.some(tag => selectedTags.includes(tag));
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(cardCategory);
            const shouldShow = tagMatch && categoryMatch;

            cardWrapper.classList.toggle('hidden-by-filter', !shouldShow);
            if (shouldShow) {
                visibleCategories.add(cardCategory);
                hasVisibleTools = true;
            }
        });

        // Ocultar/Mostrar Secciones de Categoría (<section>)
        categorySections.forEach(section => {
             if (!(section instanceof HTMLElement)) return;
             const categoryName = section.getAttribute('data-category');
             const shouldShowSection = categoryName ? visibleCategories.has(categoryName) : false;
             section.style.display = shouldShowSection ? 'block' : 'none';
        });

        // Mensaje "No Results"
        if (noResultsMessage) noResultsMessage.hidden = hasVisibleTools;

        // Actualizar UI de ambos filtros
        updateFilterUI('tags', selectedTags);
        updateFilterUI('categories', selectedCategories);
    }

    function updateFilterUI(filterType, selectedItems) {
        const filterSectionElement = filterControlDiv.querySelector(`.filter-section[data-filter-type="${filterType}"]`);
        if (!filterSectionElement) return;
        const summarySpan = filterSectionElement.querySelector('.selected-items-summary');
        const filterButtons = filterSectionElement.querySelectorAll('.filter-button');

        if (summarySpan) {
             summarySpan.textContent = selectedItems.length === 0 ? 'Show All' : selectedItems.join(', ');
        }
        filterButtons.forEach(button => {
            if (!button) return;
            const value = button.getAttribute('data-filter-value');
            button.classList.toggle('active', (value === 'all' && selectedItems.length === 0) || (value !== 'all' && value !== null && selectedItems.includes(value)));
        });
    }

    function handleFilterButtonClick(event, filterType) {
        const button = event.currentTarget;
        if (!(button instanceof HTMLButtonElement)) return;
        const value = button.getAttribute('data-filter-value');
        if (value === null) return;

        let selectedArray = (filterType === 'tags') ? selectedTags : selectedCategories;
        if (value === 'all') { 
            // Resetear el array en lugar de solo vaciar
            if (filterType === 'tags') selectedTags = [];
            else selectedCategories = [];
        }
        else {
            const index = selectedArray.indexOf(value);
            if (index > -1) { 
                selectedArray.splice(index, 1); 
            } else { 
                selectedArray.push(value); 
            }
        }
        applyAllFilters();
    }

    // --- Event listeners para botones de filtro ---
    document.querySelectorAll('.filter-section[data-filter-type="tags"] .filter-button').forEach(button => {
        button.addEventListener('click', (e) => handleFilterButtonClick(e, 'tags'));
    });

    document.querySelectorAll('.filter-section[data-filter-type="categories"] .filter-button').forEach(button => {
        button.addEventListener('click', (e) => handleFilterButtonClick(e, 'categories'));
    });
});