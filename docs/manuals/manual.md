# Manual de uso de la aplicación

## Página de inicio de sesión

Al entrar a la página de Emotionfy, se le pedirá un usuario y contraseña. En caso de no tener un usuario activo con esa cuenta de correo electrónico, puede generar una nueva cuenta.

## Página principal

Se le presentará un resumen de los proyectos (videos analizados por el AWS Rekognition o el modelo de Python), si es que los tiene.
Al ser una SPA (Single Page Application), toda la información se despliega en la misma página, y el análisis de videos se obtiene de igual forma en la misma página.
En la página principal:

- Puede realizar el upload de un video con Drag & Drop, y escoger el servicio que va a utilizar (Premium o básico), y seleccionar intervalo de análisis (1 cuadro por segundo, 3 cuadros por segundo...) *NOTA* esto afectará el precio de procesamiento
- Esto lo llevará al checkout de pago en donde insertará la información de su tarjeta de crédito.
- Una vez pagado, puede monitorear el estado del procesamiento y almacenamiento del video que acaba de subir a la plataforma
- Cuando finaliza el proceso, puede analizar los datos que finalmente se regresan después del procesamiento de imagenes.
