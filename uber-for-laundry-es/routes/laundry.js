var express = require('express');


const withAuth = require("../helpers/middleware");

const User = require('../models/user');
const LaundryPickup = require('../models/laundry-pickup');

var router = express.Router();

router.get("/dashboard", withAuth, async (req, res, next) => {

    // si existe req.user, quiere decir que el middleware withAuth ha devuelto el control a esta ruta y renderizamos la vista secret con los datos del user
  
    if (req.userID) {
  
      try {
  
        // actualizamos la variable res.locals.currentUserInfo con los datos actualizados del usuario
  
        const userUpdated = await User.findById({ _id: req.userID});/* busqueda del User por Id */;
  
        // ... y actualizamos nuestro 'currentUserInfo' con el usuario actualizado
  
        res.locals.currentUserInfo = userUpdated;

        // definimos una variable query (iteración 7)
        let query;

        //definimos si el usuario es o no lauderer (iteración 7)
        if (res.locals.currentUserInfo.isLaunderer) {
            query = {launderer: res.locals.currentUserInfo._id};
        } else {
            query = {user: res.locals.currentUserInfo._id};
        }

        const pickupDocs = await LaundryPickup.find(query)
        .populate("user", "name")
        .populate("launderer", "name")
        .sort("pickupDate")
        .exec()


        // renderizamos nuestra vista de 'dashboard'
        res.render("laundry/dashboard", {
            pickups: pickupDocs,
          });
  
      } catch (error) {
        next(error);
        return;
      }
    } else {
  
      // en caso contrario (si no hay token) redirigimos a la home
      res.redirect("/");
      // otra opción es definir la respuesta con status 401, y renderizamos nuestra vista 'home' con un errorMessage ('Unauthorized: No token provided')
    }
  });

//Deberemos actualizar los datos de nuestro usuario, concretamnte isLaunderer y fee

router.post("/launderers", withAuth, async (req, res, next) => {

    // declaramos userId trayendolo desde el request.userID
    const userId = req.userID; // Obtiene el _id del usuario actual

    // definimos una variable con el fee y el isLaunderer a partir del formulario (prepara la información actualizada)
    const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true,
  };

  try {
      // hacemos una búsqueda de User por ID para modificarlo, y le pasamos la información que acabamos de definir, y lo guardamos en una variable...

      const theUser = await User.findByIdAndUpdate(userId, laundererInfo, {/* busqueda y actualización de nuestro usuario */
        new: true
      });
	// ... y definimos a nuestro req.user como ese valor (es decir, nuestro usuario encontrado y actualizado)

      req.user = theUser;

    // redirigimos a nuestro '/dashboard' al finalizar
      res.redirect('/dashboard');
  } catch (error) {
    next(err);
    return;
  }
});

// Creamos ruta para lauderers list
router.get("/launderers", withAuth, async (req, res, next) => {
    try {
      const launderersList = await User.find({ $and: [{isLaunderer: true }, {_id:{ $ne: req.userID}},],});
        /* buscamos User y filtramos por aquellos que son launderers*/
        
        // renderizamos nuestra vista 'launderers' con el resultado de nuestra búsqueda
        res.render('laundry/launderers', {
            launderers: launderersList,
        })
    } catch (error) {
      next(err);
      return;
    }
  });

  //Creamos la ruta para entrar en cada uno de los perfiles de cada lavandero:
  
router.get("/launderers/:id", async (req, res, next) => {
    
    const laundererId = req.params.id/* traemos nuestro id desde la ruta */;

  try {
    const theUser = await User.findById(laundererId); /* realizamos una búsqueda de User a partir de ese id*/ 
	
    //... y renderizamos nuestra vista 'launderer-profile' con el resultado de dicha búsqueda
    res.render("laundry/launderer-profile", {
      theLaunderer: theUser,
    });
  } catch (error) {
    next(err);
    return;
  }
});

router.post("/laundry-pickups", withAuth, (req, res, next) => {
    const {pickupDate, laundererId } = req.body;

    const pickupInfo = {
      pickupDate: pickupDate/* valor traido del form */,
      launderer: laundererId/* valor traido del form */,
      user: req.userID,
    };
  
    const thePickup = new LaundryPickup(pickupInfo);/* thePickup debería ser una nueva instancia de nuestro modelo 'laundry-pickup' con la información de pinkupInfo */;
  
    // utilizamos el método 'save' para guardar la información en BDD
    thePickup.save((err) => {
      if (err) {
        next(err);
        return;
      }
      // redirigimos a '/dashboard' una vez terminado
      res.redirect('/dashboard');
    });
  });
  


module.exports = router;