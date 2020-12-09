# Iteración # 1: Sign up

Lo primero que debemos hacer es permitir que nuestros usuarios se puedan registrar. La ruta que usaremos para registrarnos es /signup.

Cree un archivo de ruta en la carpeta /routes llamada routes/auth.js. Este archivo de ruta tendrá todas las rutas relacionadas con el registro y la autenticación de usuarios. En otras palabras, este archivo contendrá todas las rutas necesarias para registrarse e iniciar sesión.

```
$ touch routes/auth.js
```

Tenemos que asegurarnos de conectar routes/auth.js con app.js. Podemos hacer esto con *require* en app.js:

```js
// ... inside of app.js

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth'); // <<<< ESTA LINEA

const app = express();
// ...
```

También necesitamos configurar nuestra variable en app para usar esas rutas en app.js:

```js
// ... inside of app.js

app.use('/', indexRouter);
app.use('/', authRouter); // <<<< ESTA LINEA
```

Ahora que las rutas están en su lugar, podemos agregar el contenido en routes/auth.js:

```js
// routes/auth.js
const express = require('express');

const router = express.Router();


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});


module.exports = router;
```

La ruta /signup renderiza la vista de views/auth/signup.hbs. Observe la variable local errorMessage. Está ahí para mostrar mensajes o feedback al usuario. Cuando visita la página por primera vez, el mensaje está en blanco (empty string).

La ruta GET /signup renderiza un formulario que el usuario completará para registrarse en la aplicación. En otras palabras, el formulario se enviará a una ruta POST que requerirá que guardemos la información del usuario en la base de datos. Ya tenemos el código para nuestro modelo User en models/user.js.

Además de guardar cosas en la base de datos, el registro en nuestra aplicación requerirá que encriptemos la contraseña del usuario.

Instale el paquete bcryptjs en la terminal:

```
$ npm install --save bcryptjs
```

Ahora podemos finalizar nuestra ruta POST la cual recibirá el envío del formulario de registro. Aquí está nuestro archivo routes/auth.js actualizado:

```js
// routes/auth.js
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs'); // <<<< ESTA LINEA
const bcryptSalt = 10; // <<<< ESTA LINEA

const User = require('../models/user'); // <<<< ESTA LINEA

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.post("/signup", async (req, res, next) => { // <<<< ESTA RUTA
  const { name, email, password } = req.body;

  if (email === "" || password === "" || name === "") {
    res.render("auth/signup", {
      errorMessage: "Enter name, email and password to sign up.",
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser !== null) {
      res.render("auth/signup", {
        errorMessage: `The email ${email} is already in use.`,
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);

    const userSubmission = {
      name: name,
      email: email,
      password: hashedPass,
    };

    const theUser = new User(userSubmission);

    theUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong. Try again later.",
        });
        return;
      }

      res.redirect("/");
    });
  } catch (error) {
    next(error);
    return;
  }
});

module.exports = router;
```

Señalemos algunas cosas interesantes sobre el código que hemos agregado:

    Líneas 4 y 7: se requieren bcryptjs y el modelo User para usar en nuestra ruta POST.
    
    Línea 15: define nuestra ruta POST con el URL /signup. Puede tener el mismo URL porque usa un verbo HTTP diferente (GET vs. POST).
    
    Línea 16: crea variables para los inputs enviados por el formulario (almacenados en req.body).
    
    Líneas 35-36: utiliza los métodos bcrypt genSaltSync() y hashSync() para encriptar la contraseña enviada.
    
    Líneas 38-44: crea una instancia del modelo User con las propiedades correctas (valores del envío del formulario).
    
    Línea 46: llama al método modelo save() de Mongoose para realmente guardar al nuevo usuario en la base de datos.
    
    Línea 54: si todo sale según lo planeado, redirige nuevamente a la página de inicio.


Todo eso asumiendo de que no había ningún problema con el envío. Nuestro código verifica las diferentes situaciones en las que no queremos guardar a un nuevo usuario. En esos casos, volvemos a renderizar el formulario de registro con un mensaje de error. Para eso estaba la variable local errorMessage. Estos son los problemas que estamos buscando:

    Líneas 18-23: Lo primero que verificamos es si el email o la contraseña están en blanco.
    Líneas 28-33: Comprueba si ya hay un usuario con el email enviado.
    Líneas 56-59: Verifica los errores de la base de datos cuando guardemos.

Ahora que el código de registro está en su lugar, intente registrarse. Podemos verificar que el registro funcionó yendo a MongoDB Compass y consultando la base de datos:

Siguiente - Inicio de sesión.