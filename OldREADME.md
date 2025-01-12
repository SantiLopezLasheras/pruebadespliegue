<img src="https://img.shields.io/badge/test-failure-red" />

# Introducción teórica

En esta práctica vamos a trabajar con GitHub Actions. Antes de empezar, tenemos que conocer qué engloban las siglas CI/CD.

## ¿Qué es CI/CD?

<img src="/assets/images/image2.png" width="500" />

Son las siglas de integración continua y distribución y despliegue continuos y representan los siguientes 3 conceptos:

- Continuous Integration (CI)

  En el proceso de desarrollo de software, los desarrolladores se enfrentan a la tarea diaria de integrar el código que están escribiendo (por ejemplo, nuevas features, correciones de errores, etc.) en un repositorio compartido con el resto del equipo. Con cada integración de nuevo código en el repositorio, se ejecutan tests para detectar errores en el código (por ejemplo, pruebas de linter y tests de la funcionalidad del código) y ayudar así en la detección de errores en una etapa temprana que permite una corrección rápida de errores y problemas. Esta tarea que es bastante frecuente resta tiempo a los desarrolladores para dedicar a tareas más importantes.

- Continuous Delivery (CD)

  Se trata del proceso que se asegura de que el código integrado en un repositorio esté listo para ser implementado en producción. Cada vez que se produce una integración de código y se realizan con éxito los tests de la fase de CI, el proceso de CD prepara y deja el código en un estado listo para ser desplegado, de manera que los desarrolladores puedan liberar nuevas versiones con mayor rapidez.

- Continuous Deployment (CD)

  La fase de continuous delivery prepara el código y lo deja listo para el despliegue, pero lo despliega automáticamente. El proceso de continuous deployment es una práctica avanzada del continuous delivery que se encarga de desplegar automáticamente cada integración de código que haya sido verificada y validada en las fases anteriores (CI y CD).

## ¿Qué es GitHub Actions?

<img src="/assets/images/image1.png" width="500" />

GitHub Actions es una plataforma que nos ofrece GitHub para automatizar las fases de integración y despliegue continuos (CI/CD) de nuestro proyecto. Gracias a esta plataforma, podemos crear archivos personalizados para automatizar nuestras pruebas del código (linting, testing), la compilación y el despliegue del mismo.

### GitHub Actions realiza la automatización gracias a los siguientes componentes:

- workflow

  Se trata de un procedimiento (workflow) automatizado que agregamos a nuestro repositorio y que contiene una lista de instrucciones (jobs) para que la plataforma de GitHub Actions realice la automatización de CI/CD. Los workflow se activan mediante un evento que nosotros le indiquemos, por ejemplo, cuando hagamos un push a una determinada rama de nuestro repositorio.

- Jobs

  Es cada una de las instrucciones de nuestro workflow y que contiene una serie de pasos o steps a realizar. Por defecto, los jobs de un workflow se ejecutan en paralelo, pero podemos indicar que se ejecuten uno después de otro mediante la directiva requires.

- Steps

  Se trata de cada tarea individual que se ejecuta dentro un un job. Los steps pueden ser dos tipos, o bien un action (por ejemplo uses: actions/checkout@v4), o bien un comando shell (por ejemplo sh “npm install”).

- Actions

  Las actions son comandos independientes formados por steps. Se trata del bloque de construcción portátil más pequeño de un flujo de trabajo. En GitHub Actions encontramos diversas actions ya disponibles para hacer uso de ellas (por ejemplo, Actions/checkout@v4), pero también podemos crear nuestras actions personalizadas en una carpeta actions y utilizarlas en nuestro workflow.

- Runner

  Se trata del servidor que tiene instalada la aplicación de ejecución de GitHub actions

A la hora de crear nuestro workflow, deberemos crear un archivo con el nombre de nuestro workflow y almacenarlo en la carpeta .github/workflows de nuestro repositorio. Es importante que nuestro workflow sea un fichero .yml que utilice la sintaxis YAML

## Para la práctica se requiere:

- Linter_job
  - se encargará de ejecutar el linter del proyecto para verificar la sintaxis utilizada
  - si existen errores, se deberán corregir hasta que el linter se ejecute sin problemas
- Cypress_job
  - se encargará de ejecutar los tests de cypress que contiene el proyecto mediante la action oficial de Cypress
  - Estará compuesto de los siguientes steps:
    - checkout del código
    - ejecución de tests cypress que continuará también en caso de error
    - creación de un artefacto (result.txt) con el output del step anterior
- Add_badge_job
  - se encargará de publicar en el README.md del proyecto una insignia que indicará el resultado de los tests cypress
  - Estará compuesto de los siguientes steps:
    - checkout del código
    - obtención de los artefactos almacenados en el job anterior
    - generación de un output a partir de la lectura del artefacto anterior (result.txt)
    - action personalizada que recibirá el output anterior como parámetro de entrada(‘failure’ o ‘success’) y modificará el REAMDE.md
    - publicación del README.md en el repositorio
- Deploy_job
  - se encargará de desplegar el código en la plataforma de Vercel utilizando la action amondnet/vercel-action@v20
  - se ejecutará después del Cypress_job y estará compuesto por los siguientes steps:
    - checkout del código
    - despliegue de la aplicación en Vercel
- Notification_job
  - se encargará de enviar una notificación al usuario
    - destinatario: correo electrónico del usuario
    - asunto: resultado del workflow ejecutado
    - cuerpo del mensaje
      - nombre del contenedor: backend_contenidor
      - utilizará la imagen php:8.1-alpine
      - arrancará una vez el servicio de MySQL esté disponible (wait-for-it)
- Configuration_readme_job
  - se encargará de configurar el readme personal mediante una action que mostrará una métrica de los lenguajes más utilizados en los proyectos de nuestro perfil de GitHub.

# Documentación de la práctica

## Introducción

Partiendo del proyecto de Next.js del repositorio https://github.com/antoni-gimenez/nodejs-blog-practica.git, he creado un nuevo repositorio en mi cuenta de GitHub donde he clonado el proyecto.

A continuación, he creado un archivo .yml donde se incluye los distintos jobs a automatizar por GitHub Actions.

Está configurado para que se ejecute cada vez que se haga un push a la rama main:

## Linter_job

Para el linting, se ha utilizado el linter que viene instalado: "eslint-config-next": "12.0.7".

El comando para realizar el linting es "npm run lint", como viene especificado en el package.json.

La configuración del Linter_job es la siguiente:

- El comando runs-on indica que funcionará en una máquina de Ubuntu
- Cuenta con los siguientes steps:
  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Setup node version - utiliza la action actions/setup-node@v3 para establece la versión de Nodejs 20
  - Step 3: Instalación de dependencias necesarias (incluidas en el package.json) mediante el comando npm install
  - Step 4: Ejecuta el linter con el comando npm run lint

En este paso, el linter nos lanza varios errores, que tendremos que corregir.

Una vez corregidos los errores, hacemos commit y push al repositorio, y vemos que el linter ya no nos da más errores y continúa al siguiente job

## Cypress_job

Para los tests, vamos a utilizar Cypress, que correrá también en Ubuntu e indicaremos que necesita que termine el job anterior antes de ejecutarse mediante la keyword needs.

- Cuenta con los siguientes steps:
  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Setup node version - utiliza la action actions/setup-node@v3 para establece la versión de Nodejs 20
  - Step 3: Instalación de dependencias necesarias mediante el comando npm install
  - Step 4: Ejecución de los tests de Cypress utilizando la action cypress-io/github-action@v6, para lo que primero haremos un build (npm run build) y arrancaremos el proyecto (npm start) para que se puedan realizar los tests.
    En caso de error en este job, indicamos a GitHub que continue al siguiente job mediante continue-on-error.
  - Step 5: Creación de un artefacto con los resultados de los test, para lo cual creamos una carpeta primero (mkdir -p artifacts) y después guardamos el resultado en un archivo texto result.txt con el comando echo
  - Step 6: Upload del artefacto - subimor el artefacto creado para poder descargarlo en próximo job. Utilizamos la action actions/upload-artifact@v4

## Add_badge_job

En este paso, queremos publicar en el README.md del proyecto una badge que dependerá del resultado del test del paso anterior (success o failure).

También necesitará que termine el job anterior (needs: Cypress_job) y correrá en Ubuntu (runs-on: ubuntu-latest).

- Cuenta con los siguientes steps:

  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Obtención del artefacto del Cypress_job con el resultado del test - utiliza la action actions/download-artifact@v4 para descargarse el artefacto
  - Step 3: Instalación de dependencias necesarias mediante el comando npm install
  - Step 4: Leer el contenido del artefacto con el comando run: echo "::set-output name=resultado::$resultado"
  - Step 5: Generación del output con una custom action que hemos creado y que se encuentra en la carpeta ./.github/actions/badges (uses: ./.github/actions/badges) a la cual le pasamos el resultado del artefacto que hemos leído en el step anterior (resultado: ${{ steps.resultado_artefacto.outputs.resultado }})
  - Step 6: Commit and Push Changes para actualizar el README.md del repositorio con la badge creada

  El contenido de la custom action es el siguiente:

  Y utiliza un archivo de JavaScript con el siguiente código:

## Deploy_Job

Finalmente, vamos a desplegar el proyecto en Vercel.

- Cuenta con los siguientes steps:
  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Creación del build a desplegar en Vercel mediante el comando npm install && npm run build
  - Step 3: Deploy Vercel - utilizamos la action de amondnet/vercel-action@v20 para desplegar la aplicación en Vercel. Para ellos tenemos que configurar el repositorio y linkearlo con Vercel, para lo cual guardaremos los tokens necesarios en los secrets del repositorio

## Notification_job

Una vez concluidos los jobs anteriores, enviaremos una notificación al usuario con los resultados de todos los jobs. Como no he conseguido encontrar un proveedor de Email que funcionase, he implementado esta parte con un bot de Telegram.

Los steps son los siguientes:

- Checkout del código mediante la action actions/checkout@v4
- Instalación de dependencias necesarias con npm install (donde se instalará la api del bot de telegram)
- Enviar el mensaje a Telegram usando una custom action que he guardado en la carpeta ./.github/actions/telegram y a la que le paso las variables que contienen los resultados de los jobs anteriores, y otros parámetros necesarios como el token de telegram y el ID del usuario de telegram

La custom action:

El fichero JavaScript:

## Personalización del repositorio con nuestro nombre para incluir estadísticas
