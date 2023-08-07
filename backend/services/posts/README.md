# Microservicio Post y Comentario

# Estilos de Programación

## Cook Book - Un enfoque modular y reutilizable en programación

El Cook Book (Libro de Cocina) es un enfoque en programación que se basa en crear recetas o patrones predefinidos para resolver problemas específicos de manera modular y reutilizable. Es similar a tener un conjunto de instrucciones paso a paso que puedes seguir para abordar situaciones comunes. Al aplicar el Cook Book, se promueve la legibilidad del código, se evita la repetición y se fomenta la reutilización de soluciones ya probadas.

### Aplicación en la función "handleErrors"

La función "handleErrors" es una implementación del Cook Book en `posts_controller.js`. El segmento de código es el siguiente:

```javascript
const handleErrors = async (promise) => {
  try {
    const result = await promise;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
};
```

La función "handleErrors" es una implementación del Cook Book en el código que se proporcionó. Veamos cómo se aplica este enfoque en la función "handleErrors":

1. **Receta definida**: Se crea una función llamada "handleErrors" que toma una promesa como argumento.

2. **Patrón común**: La función envuelve una promesa con un bloque `try-catch` para manejar errores de manera consistente.

3. **Reutilización**: La función "handleErrors" se puede reutilizar en varias partes del código para manejar errores de manera uniforme. En lugar de repetir el bloque `try-catch` en cada función, simplemente llamamos a esta función y la pasamos la promesa que deseamos ejecutar.

4. **Modularidad**: La función "handleErrors" se puede exportar desde un módulo y se puede utilizar en otros archivos del proyecto para manejar errores de una manera coherente en todo el microservicio.

### Beneficios de aplicar el Cook Book en handleErrors:

- **Legibilidad**: La función "handleErrors" encapsula la lógica de manejo de errores en un solo lugar, lo que facilita la lectura y comprensión del código.

- **Reutilización**: Al tener una función separada para manejar errores, podemos reutilizarla en todas las funciones del controlador donde necesitamos manejar promesas y errores.

- **Mantenibilidad**: Si en el futuro necesitamos cambiar la forma en que manejamos los errores, solo necesitamos hacerlo en un solo lugar (en la función "handleErrors") en lugar de modificar múltiples bloques `try-catch` en todo el código.

- **Centralización**: Al centralizar el manejo de errores en una sola función, tenemos un lugar central donde podemos agregar registros o realizar acciones adicionales para el manejo de errores, si es necesario, en el futuro.

En resumen, aplicar el Cook Book en la función "handleErrors" proporciona un enfoque más estructurado y modular para manejar errores en el código, lo que mejora la legibilidad, reutilización y mantenibilidad del microservicio.

## Pipeline

El estilo pipeline es un enfoque de programación que consiste en dividir el flujo de trabajo en etapas o pasos conectados, donde cada etapa procesa los datos y los pasa al siguiente paso. Cada paso toma la salida del paso anterior y realiza una operación adicional o transformación. Este enfoque mejora la legibilidad y la modularidad del código, ya que cada paso se puede comprender de manera aislada y se pueden reutilizar funciones y operaciones comunes en diferentes partes del flujo de trabajo.

## Cómo se aplica el estilo pipeline en el código dado

En el fragmento de código dado, se aplica el estilo pipeline en la función `getTimelinePosts`. A continuación, se detalla cómo se divide el proceso en etapas conectadas:

1. **Paso 1**: Obtener las publicaciones del usuario actual.

```javascript
    const currentUserPostsQuery = PostModel.find({ userId: userId }).exec();
    const currentUserPosts = await currentUserPostsQuery;
```

2. **Paso 2**: Obtener las publicaciones de los usuarios a los que sigue el usuario actual mediante una agregación de MongoDB utilizando `aggregate`.

```javascript
const followingPosts = await UserModel.aggregate([
  {
    $match: {
      _id: new mongoose.Types.ObjectId(userId),
    },
  },
  {
    $lookup: {
      from: "posts",
      localField: "following",
      foreignField: "userId",
      as: "followingPosts",
    },
  },
  {
    $project: {
      followingPosts: 1,
      _id: 0,
    },
  },
]).exec();

```

3. **Paso 3**: Combinar las publicaciones obtenidas del usuario actual y los usuarios a los que sigue, y ordenarlas por fecha de creación descendente para obtener la línea de tiempo de publicaciones.

```javascript
const timelinePosts = currentUserPosts.concat(
  ...followingPosts[0].followingPosts
);

timelinePosts.sort((a, b) => {
  return new Date(b.createdAt) - new Date(a.createdAt);
});

```

4. **Paso 4**: Responder con el resultado final, que es la línea de tiempo de publicaciones.

```javascript
res.status(200).json(timelinePosts);
```

En este código, cada paso del proceso se realiza de manera secuencial, tomando la salida del paso anterior y realizando operaciones adicionales para obtener el resultado final, que es la línea de tiempo de publicaciones. De esta manera, se aplica el estilo pipeline, dividiendo el flujo de trabajo en etapas bien definidas y conectadas para obtener un código más legible y mantenible.

## Estilo Monolithic (Monolítico)

El estilo Monolithic es una arquitectura de software en la cual todas las funcionalidades y componentes de una aplicación se encuentran agrupados en un solo bloque o unidad. En otras palabras, todas las partes de la aplicación, como el backend, el frontend y la base de datos, están interconectadas y funcionan como una sola entidad monolítica.

En el contexto de una aplicación web, el estilo Monolithic implica que todas las operaciones, como el manejo de peticiones HTTP, la lógica de negocio y la interacción con la base de datos, se encuentran en un único y extenso bloque de código. No hay una clara separación de responsabilidades y cada funcionalidad está fuertemente acoplada con las demás. Esto puede llevar a una falta de modularidad, lo que dificulta la reutilización y la escalabilidad del código.

### Características del Estilo Monolithic:

1. **Centralización**: Todas las funcionalidades se encuentran en un solo lugar, lo que facilita el acceso y la comprensión, pero también puede hacer que el código sea difícil de mantener y extender a medida que la aplicación crece.

2. **Comunicación interna**: Las diferentes partes de la aplicación se comunican entre sí directamente, ya que están todas presentes en el mismo entorno. Esto puede simplificar la comunicación, pero también puede llevar a un acoplamiento excesivo y dificultar el cambio o actualización de una funcionalidad específica sin afectar a otras.

3. **Rendimiento**: Debido a que todas las funcionalidades están presentes en un solo bloque de código, las llamadas internas son generalmente más rápidas en comparación con las llamadas a través de una red, como en una arquitectura de microservicios.

### Uso del Estilo Monolithic en el Código

En el fragmento de `posts_controller.js`, podemos observar la aplicación del estilo Monolithic en el controlador para las operaciones relacionadas con los posts (publicaciones). Todas las funciones que manejan las operaciones CRUD, así como la obtención de la línea de tiempo de publicaciones, se encuentran dentro del mismo archivo de controlador.

```javascript
module.exports = {
    createPost,
    getPost,
    updatePost,
    deletePost,
    likePost,
    getTimelinePosts,
};
```

Aunque el código es legible y claro, presenta algunas características propias del estilo Monolithic:

- **Funciones en un solo archivo**: Todas las funciones, desde la creación de un post hasta la obtención de la línea de tiempo, están definidas en el mismo archivo. Esto puede hacer que el archivo sea largo y más difícil de navegar a medida que se agregan más funcionalidades.

- **Centralización de operaciones**: Todas las operaciones de base de datos, como crear, leer, actualizar y eliminar posts, se realizan en este controlador. Si la aplicación crece y más funcionalidades son añadidas, esto podría resultar en un archivo de controlador bastante grande y complejo.

- **Complejidad**: A medida que se agregan más características a la aplicación, la complejidad del archivo de controlador podría aumentar considerablemente. Esto puede dificultar el mantenimiento y la comprensión del código a largo plazo.

En general, si bien el estilo Monolithic puede ser adecuado para aplicaciones más pequeñas y sencillas, puede volverse problemático a medida que la aplicación crece y se vuelve más compleja. Para proyectos más grandes y escalables, se recomienda considerar enfoques de diseño más modulares, como la arquitectura de microservicios o la organización en componentes independientes, que permitan una mejor estructuración del código y faciliten el mantenimiento y la escalabilidad.




## Prácticas de Codificación Legible (SonarLint) en `posts_controller.js`

1. **Nombres descriptivos de funciones y variables**: Los nombres de las funciones y variables son descriptivos y reflejan claramente su propósito y función. Por ejemplo, `createPost`, `getPost`, `updatePost`, `deletePost`, `likePost` y `getTimelinePosts` son nombres claros y concisos que indican la acción que realiza cada función.

2. **Uso de comentarios**: Aunque el código no contiene muchos comentarios, en las funciones más complejas se incluyen comentarios breves para explicar el propósito del bloque de código. Por ejemplo, en la función `getTimelinePosts`, se utiliza un comentario para describir la secuencia de operaciones realizadas para obtener las publicaciones de la línea de tiempo.

3. **Manejo de errores con función auxiliar**: El código utiliza una función auxiliar `handleErrors` para manejar los errores generados por las operaciones asincrónicas. Esto mejora la legibilidad del código al evitar la repetición de código de manejo de errores en cada función.

4. **Formato y estilo de código consistente**: El código sigue un formato y estilo consistente en todo el archivo. Las indentaciones, espacios y llaves se mantienen de manera uniforme, lo que facilita la lectura y comprensión del código.

5. **Uso adecuado de promesas y `async/await`**: El código utiliza correctamente promesas y `async/await` para manejar operaciones asincrónicas. Esto mejora la legibilidad y evita el anidamiento excesivo de callbacks.

En general, el código muestra buenas prácticas de codificación legible, como el uso de nombres descriptivos, el manejo adecuado de errores y la consistencia en el formato y estilo del código. Estas prácticas contribuyen a un código más claro y fácil de mantener.


## Aplicación de Principios SOLID

1. S - Single Responsibility:
Cada función parece tener una responsabilidad clara y única. Por ejemplo, `createPost` solo maneja la creación de una nueva publicación, `getPost` maneja la obtención de una publicación por su ID, `updatePost` actualiza una publicación, `deletePost` elimina una publicación, `likePost` maneja el gusto/no me gusta de una publicación y `getTimelinePosts` obtiene publicaciones para la línea de tiempo de un usuario.

2. O — Open-Closed:
El principio establece que las entidades de software (clases, módulos, funciones) deben estar abiertas para la extensión pero cerradas para la modificación. Esto se puede lograr mediante el uso de abstracción y polimorfismo para permitir que se agreguen nuevas funciones sin modificar el código existente. Se creo una separación entre las acciones principales de publicación y su ejecución en `postActions.js`, lo que facilita agregar nuevas acciones sin modificar el código existente en `posts_controller.js`.
