window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

     // Manejador del formulario de contacto
     let isTesting = true; // Cambia a "false" cuando quieras enviar los correos de verdad

     document.getElementById('contactForm').addEventListener('submit', function(event) {
         event.preventDefault(); // Evitar recargar la página
     
         if (isTesting) {
             // Modo de prueba: solo muestra el snackbar, sin enviar correos
             showSnackbar(MESSAGES.emailError + "(TEST MODE)", MESSAGES.errorColor);
             //showSnackbar(MESSAGES.emailSuccess + " (TEST MODE)", MESSAGES.successColor);
         } else {
             // Modo real: enviar el correo con EmailJS
             emailjs.sendForm('service_7zs67cd', 'template_avge4kb', this)
             .then(function() {
                 showSnackbar(MESSAGES.emailSuccess, MESSAGES.successColor);
             }, function(error) {
                 showSnackbar(MESSAGES.emailError + error.text, MESSAGES.errorColor);
             });
         }
     });
 
     // Función para mostrar el snackbar
     function showSnackbar(message, bgColor) {
         var snackbar = document.getElementById("snackbar");
         if (!snackbar) {
             console.error(MESSAGES.snackbarConsoleError); // Usa el mensaje correcto de MESSAGES
             return;
         }
         
         // Limpia cualquier clase "show" previa
         snackbar.className = snackbar.className.replace("show", "");
 
         snackbar.textContent = message;
         snackbar.style.backgroundColor = bgColor || '#333'; // Color por defecto
         snackbar.className = "show"; // Muestra el snackbar
 
         // Asegúrate de que se oculte después de 3 segundos
         setTimeout(function() { 
             snackbar.className = snackbar.className.replace("show", ""); 
         }, 3000); // Oculta después de 3 segundos
     }
 });