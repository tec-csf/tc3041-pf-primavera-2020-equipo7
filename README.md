# TC3041 Proyecto Final Primavera 2020

# Emotionfy

##### Integrantes:

1. *Roberto Gervacio Guendulay* - *A01025780* - *Campus Santa Fe*
2. *Isaac Harari Masri* - *A01024688* - *Campus Santa Fe*
3. *Alejandra Nissan Leizorek* - *A01024682* - *Campus Santa Fe*
4. *Yann Le Lorier Bárcena* - *A01025977* - *Campus Santa Fe*

## 1. Aspectos generales

Las orientaciones del proyecto se encuentran disponibles en la plataforma **Canvas**.

Este documento es una guía sobre qué información debe entregar como parte del proyecto, qué requerimientos técnicos debe cumplir y la estructura que debe seguir para organizar su entrega.

### 1.1 Requerimientos técnicos

A continuación se mencionan los requerimientos técnicos mínimos del proyecto, favor de tenerlos presente para que cumpla con todos.

* El equipo tiene la libertad de elegir las tecnologías de desarrollo a utilizar en el proyecto, sin embargo, debe tener presente que la solución final se deberá ejecutar en una plataforma en la nube. Puede ser  [Google Cloud Platform](https://cloud.google.com/?hl=es), [Azure](https://azure.microsoft.com/en-us/) o [AWS](https://aws.amazon.com/es/free/).
* El proyecto debe utilizar al menos dos modelos de bases de datos diferentes, de los estudiados en el curso.
* La solución debe utilizar una arquitectura de microservicios. Si no tiene conocimiento sobre este tema, le recomiendo la lectura [*Microservices*](https://martinfowler.com/articles/microservices.html) de [Martin Fowler](https://martinfowler.com).
* La arquitectura debe ser modular, escalable, con redundancia y alta disponibilidad.
* La arquitectura deberá estar separada claramente por capas (*frontend*, *backend*, *API RESTful*, datos y almacenamiento).
* Los diferentes componentes del proyecto (*frontend*, *backend*, *API RESTful*, bases de datos, entre otros) deberán ejecutarse sobre contenedores [Docker](https://www.docker.com/) y utilizar [Kubernetes](https://kubernetes.io/) como orquestador.
* Todo el código, *datasets* y la documentación del proyecto debe alojarse en este repositorio de GitHub siguiendo la estructura que aparece a continuación.

### 1.2 Estructura del repositorio

El proyecto debe seguir la siguiente estructura de carpetas:
```
- / 			        # Raíz de todo el proyecto
    - README.md			# Archivo con los datos del proyecto (este archivo)
    - frontend			# Carpeta con la solución del frontend (Web app)
    - backend			# Carpeta con la solución del backend (CMS)
    - api			# Carpeta con la solución de la API
    - datasets		        # Carpeta con los datasets y recursos utilizados (csv, json, audio, videos, entre otros)
    - dbs			# Carpeta con los modelos, catálogos y scripts necesarios para generar las bases de datos
    - docs			# Carpeta con la documentación del proyecto
        - stage_f               # Documentos de la entrega final
        - manuals               # Manuales y guías
```

### 1.3 Documentación  del proyecto

Como parte de la entrega final del proyecto, se debe incluir la siguiente información:

* Justificación de los modelo de *bases de datos* que seleccionaron.
* Descripción del o los *datasets* y las fuentes de información utilizadas.
* Guía de configuración, instalación y despliegue de la solución en la plataforma en la nube  seleccionada.
* Documentación de la API. Puede ver un ejemplo en [Swagger](https://swagger.io/). 
* El código debe estar documentado siguiendo los estándares definidos para el lenguaje de programación seleccionado.

## 2. Descripción del proyecto

El proyecto seleccionado es una plataforma que permite el análisis de emociones de individuos dentro de un video, usando modelos de Machine Learning. La solución se divide en dos grandes modelos: Face Rekognition de AWS, y un modelo que creamos usando CNNs.

- El modelo de AWS, está ligado con una cuenta "premium": el modelo regresa un video junto con un análisis detallado de las emociones, en diferentes puntos del tiempo
- El modelo de CNN, está ligado con una cuenta "básica": permite subir un video, el análisis se hace cada segundo, pero solo regresa un arreglo de imágenes dibujadas, junto con algunas emociones detectadas.

## 3. Solución
Nuestra solución resuelve los siguientes procesos de negocio:
•	Subir videos, almacenar y poder recuperarlos videos
•	División del video en frames 
•	Subir, almacenar y poder recuperar imágenes 
•	Uso de dos modelos para calcular los sentimientos predominantes
•	Desplegar información de sentimientos del video en gráficas
•	Sesiones de usuario
•	Linea de tiempo para mostrar un frame específico y ver qué emociones había en ese momento
•	Manejo de pagos

Decidimos implementar la solución del problema dividido en dos partes: la administración de videos e imágenes, y la segunda parte, la de usuarios.

### 3.1 Modelos de *bases de datos* utilizados

Los tres principales modelos de almacenamiento son MongoDB, junto con Google Cloud Storage; Firebase, para el manejo de usuarios y autenticaciones y Redis, para el desacoplamiento del servicio y mejorar la calidad de la experiencia de usuario al enseñar información relevante al estado del cálculo de emociones.

Al tratarse de un modelo NoSQL, MongoDB permite la flexibilidad de manejar la metadata de los videos como nos convenga. En el ejemplo de los videos "Premium", y los videos "Básicos", podemos modificar la estructura del documento, omitiendo el campo de análisis a detalle de los videos "Básicos".

Por otro lado, utilizamos Firebase como modelo de almacenamiento de usuarios, por que es un framework que se ocupa del hashing de las credenciales de los usuarios, y hace que su administración sea muy sencilla.

Finalmente, utilizamos Redis como modelo de desacoplamiento para mejorar la experiencia del usuario, ya que el proceso de subir el video a la plataforma, dividirlo en frames en un intervalo dado de segundos, mandarlo a alguno de los modelos de Machine Learning, y finalmente guardarlos en Google Cloud Storage es un proceso que toma tiempo, por lo que el usuario podría llegar a frustrarse, ya que no recibiría información en el intermedio.
Para evitar esto, Redis nos permite obtener el estado en el que se encuentra el sistema, y regresárselo al usuario, para que pueda monitorear el proceso.

### 3.2 Arquitectura de la solución

![Arquitectura de la solución](./docs/stage_f/arch.png)

### 3.3 Frontend

#### 3.3.1 Lenguaje de programación

El lenguaje de programación utilizado para la solución es JavaScript, ya que tiene muchas opciones para generar páginas estéticamente agradables, con una gran funcionalidad de peticiones, y de despliegue de la información.

#### 3.3.2 Framework

El framework utilizado es React, el cual permite generar interfaces gráficas interactivas, de forma adaptable y escalable.

#### 3.3.3 Librerías de funciones o dependencias

~~~json
"dependencies": {
    "@coreui/coreui": "^2.1.12",
    "@coreui/coreui-plugin-chartjs-custom-tooltips": "^1.3.1",
    "@coreui/react": "^2.5.1",
    "@stripe/react-stripe-js": "^1.1.2",
    "@stripe/stripe-js": "^1.5.0",
    "axios": "^0.19.2",
    "bootstrap": "^4.3.1",
    "chart.js": "^2.8.0",
    "core-js": "^3.1.4",
    "enzyme": "^3.10.0",
    "enzyme-adapter-react-16": "^1.14.0",
    "filepond": "^4.13.5",
    "filepond-plugin-file-validate-type": "^1.2.5",
    "firebase": "^7.14.5",
    "font-awesome": "^4.7.0",
    "node-sass": "^4.12.0",
    "prop-types": "^15.7.2",
    "react": "^16.8.6",
    "react-chartjs-2": "^2.7.6",
    "react-dom": "^16.8.6",
    "react-filepond": "^7.0.1",
    "react-hook-form": "^5.7.2",
    "react-router-config": "^5.0.1",
    "react-router-dom": "^5.0.1",
    "react-test-renderer": "^16.8.6",
    "react-videoplayer": "^0.6.4",
    "reactstrap": "^8.0.0",
    "simple-line-icons": "^2.4.1",
    "video-react": "^0.14.1"
},
"devDependencies": {
    "react-scripts": "^3.0.1"
}
~~~


### 3.4 Backend

#### 3.4.1 Lenguaje de programación

El lenguaje de programación utilizado para el backend es JavaScript, ya que su amplio soporte con librerías de comunicación con bases de datos, Google Cloud Platform, y Amazon Web Services es útil para integrar todo en un solo proyecto.

#### 3.4.2 Framework

En el frontend utilizamos React. Se encarga de actualizar y renderizar de manera eficiente los componentes correctos cuando los datos cambian. Esta librería es una de las más utilizadas en el mundo del desarrollo web y nos ayuda a entregar una mejor experiencia del usuario al trabajar con el modelo de Single Page Application (SPA).

La forma en la que se trabajó el proyecto fue con la utilización del desarrollo MERN (principalmente), junto con otros servicios utilizados.

#### 3.4.3 Librerías de funciones o dependencias

~~~json
  "dependencies": {
    "@firebase/app-types": "^0.6.1",
    "@google-cloud/storage": "^5.0.0",
    "aws-sdk": "^2.684.0",
    "axios": "^0.19.2",
    "canvas": "^2.6.1",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-fileupload": "^1.1.7-alpha.3",
    "express-validator": "^6.5.0",
    "ffmpeg": "0.0.4",
    "firebase-admin": "^8.12.1",
    "form-data": "^3.0.0",
    "global": "^4.4.0",
    "mongoose": "^5.9.14",
    "ngrok": "^3.2.7",
    "redis": "^3.0.2",
    "stripe": "^8.55.0"
  },
  "devDependencies": {
    "dotenv": "^8.2.0",
    "nodemon": "^2.0.4"
  }
~~~

### 3.5 API

*[Incluya aquí una explicación de la solución utilizada para implementar la API del proyecto. No olvide incluir las ligas o referencias donde se puede encontrar información de los lenguajes de programación, frameworks y librerías utilizadas.]*

#### 3.5.1 Lenguaje de programación

El lenguaje de programación utilizado para el backend es JavaScript, ya que su amplio soporte con librerías de comunicación con bases de datos, Google Cloud Platform, y Amazon Web Services es útil para integrar todo en un solo proyecto.

#### 3.5.2 Framework

El framework se desarrolló con el método de MERN, entre otros servicios como Google Cloud Storage, Google Firebase, Amazon Web Services (Rekognition) y Stripe.

#### 3.5.3 Librerías de funciones o dependencias

~~~json
  "dependencies": {
    "@firebase/app-types": "^0.6.1",
    "@google-cloud/storage": "^5.0.0",
    "aws-sdk": "^2.684.0",
    "axios": "^0.19.2",
    "canvas": "^2.6.1",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-fileupload": "^1.1.7-alpha.3",
    "express-validator": "^6.5.0",
    "ffmpeg": "0.0.4",
    "firebase-admin": "^8.12.1",
    "form-data": "^3.0.0",
    "global": "^4.4.0",
    "mongoose": "^5.9.14",
    "ngrok": "^3.2.7",
    "redis": "^3.0.2",
    "stripe": "^8.55.0"
  },
  "devDependencies": {
    "dotenv": "^8.2.0",
    "nodemon": "^2.0.4"
  }
~~~

A continuación están resumidos los endpoints que se utilizaron:

*[Por cada endpoint debe incluir lo siguiente:]*

* **Descripción**:La carga de videos a la plataforma
* **URL**: ```/videos/```
* **Verbos HTTP**: ```POST```
* **Headers**: Authorization = Bearer + Token
* **Formato JSON del cuerpo de la solicitud**:
```json
{
    "user":String,
    "video":File
}
```
* **Formato JSON de la respuesta**:
```json
{
  "video_id":String,
  "duration":Number
}
```
* **Códigos de error**:
    - 500
    - 422

* **Descripción**:La carga del análisis del video a la plataforma
* **URL**: ```/videos/:id```
* **Verbos HTTP**: ```POST```
* **Headers**: Authorization = Bearer + Token
* **Formato JSON del cuerpo de la solicitud**:
```json
{
    "user":String,
    "seconds":Number
}
```
* **Formato JSON de la respuesta**:
```json
{
  'Analysis done'
}
```
* **Códigos de error**:
    - 403


* **Descripción**: Obtención de los videos subidos por el usuario de la sesión activa
* **URL**: ```/videos/```
* **Verbos HTTP**: ```GET```
* **Headers**: Authorization = Bearer + Token
* **Formato JSON del cuerpo de la solicitud**:

~~~json
{
  "user": "String"
}
~~~

* **Formato JSON de la respuesta**:
```json
"payed": {
    "name": "String",
    "path": "String",
    "user": "String",
    "payment_id": "String",
    "local_link": "String",
    "instant": "Number",
    "sequence_id": "Number",
    "bucket_link": "String",
    "analysis": [
    {
      "AgeRange": {
        "High": "Number",
        "Low": "Number"
      },
      "Beard": {
        "Confidence": "Number",
        "Value": "Boolean"
      },
      "BoundingBox": {
        "Height": "Number",
        "Left": "Number",
        "Top": "Number",
        "Width": "Number"
      },
      "Confidence": "Number",
      "Emotions": [
        {
          "Confidence": "Number",
          "Type": {
            "type": "String",
            enum: [ 'HAPPY', 'SURPRISED', 'ANGRY', 'CONFUSED', 'CALM', 'SAD', 'FEAR', 'DISGUSTED' ]
          }
        }
      ],
      Eyeglasses: {
        "Confidence": "Number",
        "Value": "Boolean"
      },
      "EyesOpen": {
        "Confidence": "Number",
        "Value": "Boolean"
      },
      "Gender": {
        "Confidence": "Number",
        "Value": "String"
      },
      "Landmarks": [
      {
        "Type": {
          "type": "String",
          enum: [
            'eyeLeft',
            'eyeRight',
            'mouthLeft',
            'mouthRight',
            'nose',
            'leftEyeBrowLeft',
            'leftEyeBrowRight',
            'leftEyeBrowUp',
            'rightEyeBrowLeft',
            'rightEyeBrowRight',
            'rightEyeBrowUp',
            'leftEyeLeft',
            'leftEyeRight',
            'leftEyeUp',
            'leftEyeDown',
            'rightEyeLeft',
            'rightEyeRight',
            'rightEyeUp',
            'rightEyeDown',
            'noseLeft',
            'noseRight',
            'mouthUp',
            'mouthDown',
            'leftPupil',
            'rightPupil',
            'upperJawlineLeft',
            'midJawlineLeft',
            'chinBottom',
            'midJawlineRight',
            'upperJawlineRight'
          ]
        },
        "X": "Number",
        "Y": "Number"
        }
      ],
      "MouthOpen": {
        "Confidence": "Number",
        "Value": "Boolean"
      },
      "Mustache": {
        "Confidence": "Number",
        "Value": "Boolean"
      },
      "Pose": {
        "Pitch": "Number",
        "Roll": "Number",
        "Yaw": "Number"
      },
      "Quality": {
        "Brightness": "Number",
        "Sharpness": "Number"
      },
      "Smile": {
        "Confidence": "Number",
        "Value": "Boolean"
      },
      "Sunglasses": {
        "Confidence": "Number",
        "Value": "Boolean"
      }
    }
  ]
},
  "free": {
    "user": "String",
    "name": "String",
    "payment_id": "String",
    "metadata": {
    "local_link": "String",
    "bucket_link": "String",
    "video_size": ["Number", "Number"],
    "frame_rate": "Number",
    "duration": "Number"
    },
    "applied_seconds": "Number",
    "frames": [frameSchema],
    "general": {
    "name": "String",
    "emotion": {
    "type": "String",
    "enum": ['HAPPY', 'SURPRISED', 'ANGRY', 'CONFUSED', 'CALM', 'SAD', 'FEAR', 'DISGUSTED']
    },
    "gestures": "Number",
    "link": "String",
    "duration": "Number"
    },
    "gestures": []
  },
  "pending": [
    "id_video" :"String",
    "duration": "Number"
  ],
  "processing": {
    "id_video": {
      "user_id":"String",
      "status":"String"
    } //puede tener varios de estos documentos
  }
}
```

* **Códigos de error**:

- 500

* **Descripción**: Obtención de un video en específico
* **URL**: ```/videos/:id```
* **Verbos HTTP**: ```GET```
* **Headers**: Authorization = Bearer + Token
* **Formato JSON del cuerpo de la solicitud**:

~~~json
{
  "user": String
}
~~~

* **Formato JSON de la respuesta**:
```json
{
  "link": "String", //liga al bucket de GCS
  "name": "String"
}
```
* **Códigos de error**:

- 500
- 404

* **Descripción**: Borrado de un video en específico
* **URL**: ```/videos/:id```
* **Verbos HTTP**: ```DELETE```
* **Headers**: Authorization = Bearer + Token
* **Formato JSON del cuerpo de la solicitud**:

~~~json
{}
~~~

* **Formato JSON de la respuesta**:
```json
{
  'OK'
}
```
* **Códigos de error**:

- 500

* **Descripción**: Checkout de la compra de un video
* **URL**: ```/checkout/```
* **Verbos HTTP**: ```POST```
* **Headers**: Authorization = Bearer + Token
* **Formato JSON del cuerpo de la solicitud**:

~~~json
{
  "payment_intent"
}
~~~

* **Formato JSON de la respuesta**:

```json
{'received'}
```

* **Códigos de error**:

- 500
- 422

## 3.6 Pasos a seguir para utilizar el proyecto

### 3.6.1 Clonación del proyecto

```sh
git clone git@github.com:tec-csf/tc3041-pf-primavera-2020-equipo7.git
```

### 3.6.2 backend

Descargar .env https://www.mediafire.com/file/ne0t1ncmoq6kohi/.env/file

```sh
yarn install
yarn run dev
sudo apt install ffmpeg
```

### 3.6.3 frontend

Descargar .env http://www.mediafire.com/file/dj3cl5dfnc6bs4g/.env%25282%2529/file

```
yarn install
yarn start
```

### 3.6.4 Deploy

```sh
firebase init
firebase deploy
```

## 4. Referencias

- [Firebase Docs](https://firebase.google.com/docs/)
- [Storage Docs](https://cloud.google.com/storage/)
- [Stripe Docs](https://stripe.com/docs)
