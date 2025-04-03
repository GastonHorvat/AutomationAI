document.addEventListener('DOMContentLoaded', function() {

    // --- Element References ---
    const emailForm = document.getElementById('emailForm');
    const userEmailInput = document.getElementById('userEmail');
    const emailError = document.getElementById('emailError');
    const calculatorWrapper = document.getElementById('calculatorWrapper');
    const calculatorForm = document.getElementById('calculatorForm');
    const elementTypeSelect = document.getElementById('elementType');
    const materialTypeSelect = document.getElementById('materialType');
    const dimensionInput = document.getElementById('dimensions');
    const dimensionUnitSpan = document.getElementById('dimensionUnit');
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');
    const totalCostElement = document.getElementById('totalCost');

    // --- Data Definitions ---

    // Material options based on element type
    const materialOptions = {
        pared: [
            { value: 'ladrillo_comun', text: 'Ladrillo Común (Pared 15cm)' },
            { value: 'ladrillo_hueco_8', text: 'Ladrillo Hueco Portante 8cm' },
            { value: 'ladrillo_hueco_12', text: 'Ladrillo Hueco Portante 12cm' },
            { value: 'ladrillo_hueco_18', text: 'Ladrillo Hueco Portante 18cm' },
            { value: 'bloque_hormigon_13', text: 'Bloque Hormigón 13x19x39' },
            { value: 'bloque_hormigon_19', text: 'Bloque Hormigón 19x19x39' },
        ],
        losa: [
            { value: 'hormigon_h21', text: 'Hormigón H21 (Losa 10cm)' },
            { value: 'viguetas_std', text: 'Viguetas y Ladrillo Telgopor (Estándar)' },
        ],
        revoque_grueso: [
            { value: 'revoque_grueso_std', text: 'Estándar (Cemento, Cal, Arena)' }
        ],
        revoque_fino: [
             { value: 'revoque_fino_std', text: 'Estándar a la cal' }
        ],
        contrapiso: [
             { value: 'contrapiso_std', text: 'Hormigón Pobre H4 (Cascote)' },
             { value: 'contrapiso_liviano', text: 'Hormigón Liviano (Telgopor)' }
        ],
        carpeta: [
            { value: 'carpeta_std', text: 'Mortero Cemento y Arena' }
        ]
        // Add more options for other element types
    };

    // Define units for element types (true = m², false = m lineal)
     const elementUnits = {
        pared: 'm²',
        losa: 'm²',
        revoque_grueso: 'm²',
        revoque_fino: 'm²',
        contrapiso: 'm²',
        carpeta: 'm²',
        // Add others like 'zócalo': 'm'
    };

    // --- !!! PLACEHOLDER PRICES !!! ---
    // ** IMPORTANT: Replace these with accurate, up-to-date local prices **
    const materialPrices = {
        cemento: 3500,          // Bolsa 50kg
        cal_hidratada: 1800,    // Bolsa 25kg
        arena: 15000,           // m³
        piedra_partida: 20000,  // m³
        cascote_molido: 8000,   // m³
        ladrillo_comun: 150,    // Unidad
        ladrillo_hueco_8: 200,  // Unidad
        ladrillo_hueco_12: 250, // Unidad
        ladrillo_hueco_18: 300, // Unidad
        bloque_hormigon_13: 400,// Unidad
        bloque_hormigon_19: 550,// Unidad
        hierro_barra_8: 8000,   // Barra 12m (Estimado por kg o ml luego)
        hierro_barra_10: 11000, // Barra 12m
        hierro_barra_12: 15000, // Barra 12m
        malla_sim_15x15_4: 15000,// Rollo o m²
        // Add prices for all materials used in calculations
    };

    // --- Event Listeners ---

    // Email Form Submission (Unlock Calculator)
    emailForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateEmail(userEmailInput.value)) {
            emailError.style.display = 'none';
            emailForm.style.display = 'none'; // Oculta el form de email
            document.getElementById('emailPrompt').style.display = 'none'; // Oculta el contenedor del prompt
            calculatorWrapper.classList.remove('calculator-locked'); // Remueve el overlay visual
            // Opcional: aquí podrías enviar el email a tu backend/CRM
            console.log('Email válido:', userEmailInput.value);
        } else {
            emailError.style.display = 'block';
        }
    });

    // Element Type Change (Update Material Options & Unit)
    elementTypeSelect.addEventListener('change', function() {
        const selectedElementType = this.value;
        updateMaterialOptions(selectedElementType);
        updateDimensionUnit(selectedElementType);
    });

    // Calculator Form Submission
    calculatorForm.addEventListener('submit', function(event) {
        event.preventDefault();
         if (calculatorWrapper.classList.contains('calculator-locked')) {
             alert('Por favor, ingresa un email válido para activar la calculadora.');
             return;
         }

        // Get Input Values
        const constructionType = document.getElementById('constructionType').value;
        const elementType = elementTypeSelect.value;
        const materialType = materialTypeSelect.value;
        const dimensions = parseFloat(dimensionInput.value);

        if (!constructionType || !elementType || !materialType || isNaN(dimensions) || dimensions <= 0) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        // --- !!! PLACEHOLDER CALCULATION LOGIC !!! ---
        // ** IMPORTANT: This needs to be replaced with accurate construction calculation formulas **
        const results = calculateMaterials(elementType, materialType, dimensions);

        // Display Results
        displayResults(results);
    });

    // --- Helper Functions ---

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function updateMaterialOptions(elementType) {
        materialTypeSelect.innerHTML = '<option selected disabled value="">Selecciona...</option>'; // Clear previous options
        materialTypeSelect.disabled = true; // Disable initially

        if (materialOptions[elementType]) {
            materialOptions[elementType].forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                materialTypeSelect.appendChild(opt);
            });
            materialTypeSelect.disabled = false; // Enable if options exist
        } else {
             materialTypeSelect.innerHTML = '<option selected disabled value="">No aplicable</option>';
        }
    }

     function updateDimensionUnit(elementType) {
        dimensionUnitSpan.textContent = elementUnits[elementType] || 'm²'; // Default to m² if not specified
        dimensionInput.placeholder = `Ej: 50.5 (${elementUnits[elementType] || 'm²'})`;
    }

    // --- !!! PLACEHOLDER CALCULATION FUNCTION !!! ---
    function calculateMaterials(elementType, materialType, dimensions) {
        console.log(`Calculating for: ${elementType}, ${materialType}, ${dimensions}`);
        let calculatedMaterials = [];
        // ** THIS IS WHERE THE CORE LOGIC GOES - REPLACE WITH REAL FORMULAS **
        // Example structure - these formulas are illustrative and likely inaccurate
        switch (elementType) {
            case 'pared':
                // Example: Simplified common brick wall (15cm) calculation per m²
                if (materialType === 'ladrillo_comun') {
                    calculatedMaterials.push({ name: 'Ladrillo Común', unit: 'un', quantity: dimensions * 58, price: materialPrices.ladrillo_comun }); // ~58 units/m²
                    calculatedMaterials.push({ name: 'Cemento', unit: 'kg', quantity: dimensions * 6.5, price: materialPrices.cemento / 50 }); // ~6.5 kg/m² (Price per kg)
                    calculatedMaterials.push({ name: 'Cal Hidratada', unit: 'kg', quantity: dimensions * 1.5, price: materialPrices.cal_hidratada / 25 }); // ~1.5 kg/m² (Price per kg)
                    calculatedMaterials.push({ name: 'Arena', unit: 'm³', quantity: dimensions * 0.05, price: materialPrices.arena }); // ~0.05 m³/m²
                } else if (materialType === 'ladrillo_hueco_12') {
                     calculatedMaterials.push({ name: 'Ladrillo Hueco 12x18x33', unit: 'un', quantity: dimensions * 16, price: materialPrices.ladrillo_hueco_12 }); // ~16 units/m²
                    calculatedMaterials.push({ name: 'Cemento', unit: 'kg', quantity: dimensions * 5, price: materialPrices.cemento / 50 });
                    calculatedMaterials.push({ name: 'Cal Hidratada', unit: 'kg', quantity: dimensions * 1, price: materialPrices.cal_hidratada / 25 });
                    calculatedMaterials.push({ name: 'Arena', unit: 'm³', quantity: dimensions * 0.03, price: materialPrices.arena });
                }
                // Add calculations for other brick/block types
                break;
            case 'losa':
                 if (materialType === 'hormigon_h21') { // Simple 10cm thick slab
                     calculatedMaterials.push({ name: 'Cemento', unit: 'kg', quantity: dimensions * 0.1 * 300, price: materialPrices.cemento / 50 }); // ~300kg/m³ cemento * 0.1m³ concrete/m²
                     calculatedMaterials.push({ name: 'Arena', unit: 'm³', quantity: dimensions * 0.1 * 0.6, price: materialPrices.arena }); // ~0.6 m³ arena/m³ concrete
                     calculatedMaterials.push({ name: 'Piedra Partida', unit: 'm³', quantity: dimensions * 0.1 * 0.6, price: materialPrices.piedra_partida }); // ~0.6 m³ piedra/m³ concrete
                     calculatedMaterials.push({ name: 'Hierro (Estimado Ø8mm)', unit: 'kg', quantity: dimensions * 4, price: materialPrices.hierro_barra_8 / (12 * 0.395) }); // ~4 kg/m² (Price per kg)
                 }
                 // Add calculations for viguetas type
                 break;
             case 'revoque_grueso':
                 if (materialType === 'revoque_grueso_std') { // ~1.5cm thick
                     calculatedMaterials.push({ name: 'Cemento', unit: 'kg', quantity: dimensions * 1.5, price: materialPrices.cemento / 50 });
                     calculatedMaterials.push({ name: 'Cal Hidratada', unit: 'kg', quantity: dimensions * 8, price: materialPrices.cal_hidratada / 25 });
                     calculatedMaterials.push({ name: 'Arena', unit: 'm³', quantity: dimensions * 0.02, price: materialPrices.arena });
                 }
                 break;
            // Add cases for 'revoque_fino', 'contrapiso', 'carpeta' with their formulas
        }

         // Add waste factor (e.g., 5-10%) - IMPORTANT
         const wasteFactor = 1.07; // 7% waste
         calculatedMaterials = calculatedMaterials.map(mat => ({
            ...mat,
            quantity: mat.quantity * wasteFactor
         }));

        // Calculate partial costs
        calculatedMaterials = calculatedMaterials.map(mat => ({
            ...mat,
            partialCost: mat.quantity * mat.price
        }));

        console.log("Calculated:", calculatedMaterials);
        return calculatedMaterials;
    }

    function displayResults(results) {
        resultsBody.innerHTML = ''; // Clear previous results
        let currentTotalCost = 0;

        if (!results || results.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="5" class="text-center">No se pudieron calcular materiales para la selección actual. Verifique las fórmulas.</td></tr>';
            totalCostElement.textContent = formatCurrency(0);
             resultsSection.style.display = 'block'; // Show section even if empty
            return;
        }


        results.forEach(material => {
            const row = document.createElement('tr');
                row.innerHTML = `
                <td>${material.name}</td>
                <td>${material.unit}</td>
                <td>${material.quantity.toFixed(2)}</td>
                <td>${formatCurrency(material.price)}</td>
                <td class="partial-cost">${formatCurrency(material.partialCost)}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-material-btn" data-cost="${material.partialCost}">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            resultsBody.appendChild(row);
            currentTotalCost += material.partialCost;
        });

        totalCostElement.textContent = formatCurrency(currentTotalCost);
        resultsSection.style.display = 'block'; // Show results section
        resultsSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to results
    }

    function formatCurrency(amount) {
        // Simple ARS formatting, adjust as needed
        return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    // --- Event Listener for Deleting Materials ---
    resultsBody.addEventListener('click', function(event) {
        // Check if the clicked element is a delete button or its icon
        const deleteButton = event.target.closest('.delete-material-btn');

        if (deleteButton) {
            const rowToRemove = deleteButton.closest('tr');
            const costToRemove = parseFloat(deleteButton.getAttribute('data-cost'));

            // Get current total cost
            const currentTotalText = totalCostElement.textContent.replace(/[^0-9.-]+/g,""); // Remove currency symbols and commas
            let currentTotal = parseFloat(currentTotalText);

            // Subtract the cost and update the total
            if (!isNaN(costToRemove) && !isNaN(currentTotal)) {
                const newTotal = currentTotal - costToRemove;
                totalCostElement.textContent = formatCurrency(newTotal);
            }

            // Remove the row from the table
            rowToRemove.remove();

            // Optional: Check if table body is empty after removal
            if (resultsBody.rows.length === 0) {
                resultsBody.innerHTML = '<tr><td colspan="6" class="text-center">No quedan materiales en la lista.</td></tr>'; // Updated colspan to 6
                totalCostElement.textContent = formatCurrency(0);
            }
        }
    });

}); // End DOMContentLoaded