# Documentación del proyecto

## 1. Justificación de los modelos de Bases de Datos

Los tres principales modelos de almacenamiento son MongoDB, junto con Google Cloud Storage; Firebase, para el manejo de usuarios y autenticaciones y Redis, para el desacoplamiento del servicio y mejorar la calidad de la experiencia de usuario al enseñar información relevante al estado del cálculo de emociones.

Al tratarse de un modelo NoSQL, MongoDB permite la flexibilidad de manejar la metadata de los videos como nos convenga. En el ejemplo de los videos "Premium", y los videos "Básicos", podemos modificar la estructura del documento, omitiendo el campo de análisis a detalle de los videos "Básicos".

Por otro lado, utilizamos Firebase como modelo de almacenamiento de usuarios, por que es un framework que se ocupa del hashing de las credenciales de los usuarios, y hace que su administración sea muy sencilla.

Finalmente, utilizamos Redis como modelo de desacoplamiento para mejorar la experiencia del usuario, ya que el proceso de subir el video a la plataforma, dividirlo en frames en un intervalo dado de segundos, mandarlo a alguno de los modelos de Machine Learning, y finalmente guardarlos en Google Cloud Storage es un proceso que toma tiempo, por lo que el usuario podría llegar a frustrarse, ya que no recibiría información en el intermedio.
Para evitar esto, Redis nos permite obtener el estado en el que se encuentra el sistema, y regresárselo al usuario, para que pueda monitorear el proceso.

## 2. Datasets

Los datasets que utilizamos para hacer nuestras pruebas fueron realizados por nosotros (webcam, celular...), pero también tomamos algunos ejemplos de videos con personas de una plataforma llamada [pexels](https://www.pexels.com/), en donde subimos de forma manual los videos que fuimos analizando.
