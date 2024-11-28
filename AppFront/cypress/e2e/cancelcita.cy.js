describe('Prueba de inicio de sesión y navegación', () => {
  it('Modificar cita', () => {
    // Visitar la ruta de login
    cy.visit('/login');

    // Llenar los campos de inicio de sesión
    cy.get('input[id="email"]').type('admin@test.com');
    cy.get('input[id="password"]').type('123123123');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verificar que navega a /home
    cy.url().should('include', '/home');

    // Navegar a la ruta específica de citas
    cy.visit('/citas/6744e0be7924e6e0bc12f801');

    // Verificar que se encuentra en la ruta correcta
    cy.url().should('include', '/citas/6744e0be7924e6e0bc12f801');

    cy.get('button[id="cancel-button"]').click();

    // Asegúrate de trabajar dentro del modal
    cy.get('.alert-dialog').within(() => {
      cy.get('button[id="confirm-button"]').click();
    });
  });
});