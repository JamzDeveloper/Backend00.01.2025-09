# MODO DE USO #
### Para empezar desde cero: ### 
Usar el usuario "admin" y la contraseña "123" (ambos sin " "), accederá a la pantalla de Central que:
- Permite visualizar y crear Sucursales.

### A partir de las Sucursales, se podrán crear los demás tipos de usuarios: ###

- Técnico: 
    - Permite agregarle habilidades (marcas de Celulares).
    - Permite generar Cotizaciones para el servicio.
    - Permite declarar el Estado de Celular (como diagnóstico inicial).
    - Permite actualizar el estado del Ticket.
    - Permite finalizar el Ticket.
    - Visualiza habilidades, tickets y cotizaciones asignadas.
- Cliente:
    - Declara un nuevo celular (se le pide Nro.Serie, IMEI y Marca).
    - Autoriza atención (proceder de ticket).
    - Paga Cotizaciones.
    - Visualiza celulares, tickets y cotizaciones asignadas.
### También en las sucursales se podrán visualizar: ###
- Resument de Tickets
- Resumen de Técnicos
- Resumen de Cliente

# FLUJO DE TRABAJO #
1. Ingresar a la central, crear una Sucursal y cerrar sesión.
2. Ingresar a la sucursal, crear un Cliente y un Técnico. Cerrar sesión.
3. Ingresar a el técnico, cargar una habilidad y cerrar sesión.
4. Ingresar a el cliente, declarar un celular y cerrar sesión.
5. Volver a ingresar a la Sucursal, crear un ticket y cerrar sesión.
6. Volver a ingresar al Técnico y crear una Cotización del 50% del importe inicial por el servicio, adicionalmente, agregar un comentario al ticket indicando la ID de cotización y la espera de autorización por parte del cliente. Cerrar Sesión.
7. Volver a ingresar al Cliente, pagar la cotización y autorizar el Ticket. Cerrar sesión.
8. Volver a ingresar al Técnico, declarar el Estado Inicial del Celular y registrar anotaciones en el ticket sobre los distintos procesos llevados a cabo, en caso se requieran piezas, se generará nuevas Cotizaciones.
9. Una vez terminado, declarar el Estado Final del Celular, agregar una anotación final en el ticket y cerrar el Ticket.

# CONSIDERACIONES #
- La revisión de IMEI's reportados se genera automáticamente al crear el Ticket.
- La asignación del técnico se genera automáticamente al crear el Ticket considerando la carga de trabajo (tareas) y el conocimiento (Habilidades) de los técnicos.