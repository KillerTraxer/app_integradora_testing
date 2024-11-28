describe('Prueba de inicio de sesión y navegación', () => {
  it('FULL APP', () => {
    // Visitar la ruta de login
    cy.visit('/register');

    // Llenar los campos de inicio de sesión
    cy.get('input[id="name"]').type('Test');
    cy.get('input[id="lastNames"]').type('One');
    cy.get('input[id="phone"]').type('6188234488');
    cy.get('input[id="email"]').type('testone@gmail.com');
    cy.get('input[id="password"]').type('123123123');
    cy.get('input[id="confirmPassword"]').type('123123123');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verificar que navega a /home
    cy.url().should('include', '/login');

    // Llenar los campos de inicio de sesión
    cy.get('input[id="email"]').type('testone@gmail.com');
    cy.get('input[id="password"]').type('123123123');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verificar que navega a /home
    cy.url().should('include', '/home');

    cy.get('button[id="agendar"]').click();

    // Asegúrate de trabajar dentro del modal
    cy.get('.modal-create-cita').within(() => {

      // Abre el DatePicker
      cy.get('.ant-picker').click();

      // Selecciona la fecha (29/11/2024)
      cy.get('[data-testid="date-picker-modal"]').type('{selectAll}28/11/2024 13:00');

      // Confirma la selección
      cy.get('.ant-picker-ok').click();

      // // Verifica que el campo tenga la fecha seleccionada
      // cy.get('.ant-picker-input input').should('have.value', '30/11/2024 13:00');
    });
  });
});