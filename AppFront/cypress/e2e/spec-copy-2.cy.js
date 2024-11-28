describe('Pruebas de modificación de citas', () => {
  beforeEach(() => {
    // Iniciar sesión o navegar a la página de citas
    cy.visit('http://localhost:5173/login') // Ajusta la URL de acuerdo a tu flujo
    cy.get('input[name="email"]').type('usuario@correo.com')
    cy.get('input[name="password"]').type('contraseña')
    cy.get('button[type="submit"]').click()

    // Asegúrate de que el login sea exitoso
    cy.url().should('include', '/home') // Ajusta la URL según el flujo
  })

  it('debería permitir a un paciente modificar una cita existente', () => {
    // Paso 1: Navegar a la página de citas
    cy.visit('/home') // Ajusta la URL según tu aplicación

    // Paso 2: Seleccionar una cita previamente agendada (puedes usar un selector o buscarla por fecha)
    cy.get('.cita-lista') // Ajusta el selector de acuerdo a tu aplicación
      .first() // Selecciona la primera cita o busca por ID si es necesario
      .click()

    // Paso 3: Elegir un nuevo horario (puedes simular la interacción con un selector de fechas o inputs)
    cy.get('input[name="nuevo-horario"]').click() // Ajusta el selector de acuerdo a tu formulario
    cy.get('.calendar-day') // Selecciona el día deseado (ajusta el selector)
      .contains('15') // Selecciona una fecha específica
      .click()

    // Paso 4: Confirmar la modificación de la cita
    cy.get('button[type="submit"]').click() // Ajusta el botón de confirmación de la cita

    // Paso 5: Verificar que la cita fue modificada correctamente (puedes verificar el cambio en la UI o la base de datos)
    cy.get('.cita-lista')
      .first()
      .should('contain', '15 de noviembre 2024') // Verifica que la nueva fecha esté reflejada

    // Verificar que las notificaciones fueron enviadas (puedes usar mocks o comprobar la UI)
    // Si las notificaciones se envían por email o SMS, puedes verificar que se haya realizado la acción (por ejemplo, verificar un mensaje en la UI o mockear el envío de la notificación)
    cy.get('.notificacion').should('contain', 'Tu cita ha sido modificada') // Ajusta este selector según sea necesario
  })
})