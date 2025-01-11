# Introducción teórica

En esta práctica vamos a trabajar con GitHub Actions. Antes de empezar, tenemos que conocer qué engloban las siglas CI/CD.

## ¿Qué es CI/CD?

Son las siglas de integración continua y distribución y despliegue continuos y representan los siguientes 3 conceptos:

    • Continuous Integration (CI)

    En el proceso de desarrollo de software, los desarrolladores se enfrentan a la tarea diaria de integrar el código que están escribiendo (por ejemplo, nuevas features, correciones de errores, etc.) en un repositorio compartido con el resto del equipo. Con cada integración de nuevo código en el repositorio, se ejecutan tests para detectar errores en el código (por ejemplo, pruebas de linter y tests de la funcionalidad del código) y ayudar así en la detección de errores en una etapa temprana que permite una corrección rápida de errores y problemas. Esta tarea que es bastante frecuente resta tiempo a los desarrolladores para dedicar a tareas más importantes.

    • Continuous Delivery (CD)

    Se trata del proceso que se asegura de que el código integrado en un repositorio esté listo para ser implementado en producción. Cada vez que se produce una integración de código y se realizan con éxito los tests de la fase de CI, el proceso de CD prepara y deja el código en un estado listo para ser desplegado, de manera que los desarrolladores puedan liberar nuevas versiones con mayor rapidez.

    • Continuous Deployment (CD)

    La fase de continuous delivery prepara el código y lo deja listo para el despliegue, pero lo despliega automáticamente. El proceso de continuous deployment es una práctica avanzada del continuous delivery que se encarga de desplegar automáticamente cada integración de código que haya sido verificada y validada en las fases anteriores (CI y CD).

## ¿Qué es GitHub Actions?

GitHub Actions es una plataforma que nos ofrece GitHub para automatizar las fases de integración y despliegue continuos (CI/CD) de nuestro proyecto. Gracias a esta plataforma, podemos crear archivos personalizados para automatizar nuestras pruebas del código (linting, testing), la compilación y el despliegue del mismo.

### GitHub Actions realiza la automatización gracias a los siguientes componentes:

    • workflow

    Se trata de un procedimiento (workflow) automatizado que agregamos a nuestro repositorio y que contiene una lista de instrucciones (jobs) para que la plataforma de GitHub Actions realice la automatización de CI/CD. Los workflow se activan mediante un evento que nosotros le indiquemos, por ejemplo, cuando hagamos un push a una determinada rama de nuestro repositorio.

    • Jobs

    Es cada una de las instrucciones de nuestro workflow y que contiene una serie de pasos o steps a realizar. Por defecto, los jobs de un workflow se ejecutan en paralelo, pero podemos indicar que se ejecuten uno después de otro mediante la directiva requires.

    • Steps

    Se trata de cada tarea individual que se ejecuta dentro un un job. Los steps pueden ser dos tipos, o bien un action (por ejemplo uses: actions/checkout@v4), o bien un comando shell (por ejemplo sh “npm install”).

    • actions

    Las actions son comandos independientes formados por steps. Se trata del bloque de construcción portátil más pequeño de un flujo de trabajo. En GitHub Actions encontramos diversas actions ya disponibles para hacer uso de ellas (por ejemplo, Actions/checkout@v4), pero también podemos crear nuestras actions personalizadas en una carpeta actions y utilizarlas en nuestro workflow.

    • runner

    Se trata del servidor que tiene instalada la aplicación de ejecución de GitHub actions

A la hora de crear nuestro workflow, deberemos crear un archivo con el nombre de nuestro workflow y almacenarlo en la carpeta .github/workflows de nuestro repositorio. Es importante que nuestro workflow sea un fichero .yml que utilice la sintaxis YAML

## Para la práctica se requiere:

    • Linter_job
        ◦ se encargará de ejecutar el linter del proyecto para verificar la sintaxis utilizada
        ◦ si existen errores, se deberán corregir hasta que el linter se ejecute sin problemas
    • Cypress_job
        ◦ se encargará de ejecutar los tests de cypress que contiene el proyecto mediante la action oficial de Cypress
        ◦ Estará compuesto de los siguientes steps:
            ▪ checkout del código
            ▪ ejecución de tests cypress que continuará también en caso de error
            ▪ creación de un artefacto (result.txt) con el output del step anterior
    • Add_badge_job
        ◦ se encargará de publicar en el README.md del proyecto una insignia que indicará el resultado de los tests cypress
        ◦ Estará compuesto de los siguientes steps:
            ▪ checkout del código
            ▪ obtención de los artefactos almacenados en el job anterior
            ▪ generación de un output a partir de la lectura del artefacto anterior (result.txt)
            ▪ action personalizada que recibirá el output anterior como parámetro de entrada(‘failure’ o ‘success’) y modificará el REAMDE.md
            ▪ publicación del README.md en el repositorio
    • Deploy_job
        ◦ se encargará de desplegar el código en la plataforma de Vercel utilizando la action amondnet/vercel-action@v20
        ◦ se ejecutará después del Cypress_job y estará compuesto por los siguientes steps:
            ▪ checkout del código
            ▪ despliegue de la aplicación en Vercel
    • Notification_job
        ◦ se encargará de enviar una notificación al usuario
            ▪ destinatario: correo electrónico del usuario
            ▪ asunto: resultado del workflow ejecutado
            ▪ cuerpo del mensaje
        ◦ nombre del contenedor: backend_contenidor
        ◦ utilizará la imagen php:8.1-alpine
        ◦ arrancará una vez el servicio de MySQL esté disponible (wait-for-it)
    • Configuration_readme_job
        ◦ se encargará de configurar el readme personal mediante una action que mostrará una métrica de los lenguajes más utilizados en los proyectos de nuestro perfil de GitHub.
