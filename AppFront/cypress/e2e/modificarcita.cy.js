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

    cy.get('button[id="edit-cita"]').click();

    // Asegúrate de trabajar dentro del modal
    cy.get('.modal-update-cita').within(() => {
      // Abre el DatePicker
      cy.get('.ant-picker').click();

      // Selecciona la fecha (29/11/2024)
      cy.get('[data-testid="date-picker-modal"]').type('{selectAll}29/11/2024 13:00');

      // Confirma la selección
      cy.get('.ant-picker-ok').click();

      // // Verifica que el campo tenga la fecha seleccionada
      // cy.get('.ant-picker-input input').should('have.value', '30/11/2024 13:00');

      cy.get('button[id="save-changes"]').click();
    });
  });
});