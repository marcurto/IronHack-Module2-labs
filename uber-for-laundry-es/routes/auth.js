const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

const jwt = require('jsonwebtoken');

const withAuth = require("../helpers/middleware");

const User = require('../models/user');



// Renderización vista signup

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', { // Usamos el método render para mostrar la vista 'signup'
    errorMessage: '' // Declaramos la variable 'errorMessage' y la dejamos vacía por el momento
  });
});

//Definición ruta POST para el signup

router.post("/signup", async (req, res, next) => { // Definimos ruta POST de signup
    const { name, email, password } = req.body //Información que pasaremos para crear nuestro usuario des del body del request

    // Validamos qué pasa si algunos datos no se completan correctamente y le añadimos el mensaje de error en la misma vista signup
    if (name === '' || email === '' || password === ''){
        res.render('auth/signup', {
            errorMessage: 'Enter name, email and password to continue.',
        });
        return;
    }

    //Validamos si ya existe algún user con el mismo email y que esté ya registrado. Lo buscamos en la BD y, si ya existe, añadimos un mensaje de error en la misma vista
    try {
        const existingUser = await User.findOne({email});

        if (existingUser !== null) {
            res.render('auth/signup', {
                errorMessage: `The email ${email} is already in use`
            });
            return; //Si existe, continuamos
        }

    // Si no existe y podemos continuar, definiremos un valor para salt y generaremos el hash del password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);

    // Después, creamos un nuevo documento en nuestra BD de nuestro nuevo user usando el método save
    const userSubmission = {
        name: name,
        email: email,
        password: hashedPass,
      };
  
      const theUser = new User(userSubmission);
  
      theUser.save((err) => {
          //Si algo falla, renderizamos en la misma página el error
        if (err) {
          res.render("auth/signup", {
            errorMessage: "Something went wrong. Try again later.",
          });
          return;
        }
        //Si todo funciona, continuamos en la home
        res.redirect("/");
      });
    }catch (error) { // Definimos nuestro catch para recoger posibles errores
      next(error);
      return;
    }
  });

  //Renderización del Log In
  router.get('/login', (req, res, next) => {
    res.render('auth/login', { // Usamos el método render para mostrar la vista 'login'
      errorMessage: '' // Declaramos la variable 'errorMessage' y la dejamos vacía por el momento
    });
  });

  //Definición ruta POST para el login
  router.post('/login', async (req, res, next) => {
    const { email, password } = req.body; // Desestructuramos el email y el password que pasaremos por el body

    if (email === "" || password === "") {
      res.render('/auth/login', {
        errorMessage: 'Please enter username and password to sign up.',
      });
      return;
    }

    try{ //Revisamos que el usuario no exista en nuestra BD
       const user = await User.findOne({ email });

       if ( user === null){
         res.render('/auth/login', {
           errorMessage: "This email doesn't exist",
         });
         return;
       }
       else if (bcrypt.compareSync(password, user.password)){
        const userWithoutPass = await User.findOne({ email }).select("-password");
        const payload = { userID: userWithoutPass._id };
        //console.log('payload', payload);
        // si coincide, creamos el token usando el método sign, el string de secret session y el expiring time
        const token = jwt.sign(payload, process.env.SECRET_SESSION, {
          expiresIn: "1h",
        });
        // enviamos en la respuesta una cookie con el token y luego redirigimos a la home
        res.cookie("token", token, { httpOnly: true });
        res.status(200).redirect("/");

       } else {
         res.render("auth/login", {
           errorMessage: "Incorrect password",
         });
       }

    } catch(error) {
      console.log(error);
    }
  });

  // Definimos la ruta del Log Out
  router.get('/logout', withAuth, (req, res) => {
    //Seteamos el token con un valor vacío y una fecha de expiración
    res.cookie("token", "", { expires: new Date(0) });
    res.redirect("/");
  });



module.exports = router;