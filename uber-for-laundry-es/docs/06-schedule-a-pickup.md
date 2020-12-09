# Iteración #6: programar una recolección

Ahora que podemos ver la lista de lavanderos, seleccionemos un lavandero y programemos una recolección. En la lista de lavanderos, cada lavandero tiene un link para programar una recogida. Se supone que ese link lo llevará a una página de perfil del lavandero donde puede programar su recolección. ¡Hagamos una ruta para esa página!

La ruta en cuestión es /launderers/:id. Lo agregaremos después de las demás rutas en routes/laundry.js:

```js
// ... inside of routes/laundry.js
    res.render("laundry/launderers", {
      launderers: launderersList,
    });
  } catch (error) {
    next(err);
    return;
  }
});

router.get("/launderers/:id", async (req, res, next) => {
  const laundererId = req.params.id;

  try {
    const theUser = await User.findById(laundererId);

    res.render("laundry/launderer-profile", {
      theLaunderer: theUser,
    });
  } catch (error) {
    next(err);
    return;
  }
});

module.exports = router;
```

Aspectos destacados de la ruta /launderers/:id

    Línea 64: toma el id del parámetro del URL.
    
    Líneas 67: llama al método findById() de Mongoose para recuperar los detalles del lavador.
    
    Líneas 70-72: renderiza la plantilla views/laundry/launderer-profile.hbs
    
    Líneas 71: pasa la información del perfil del lavandero (theUser) como la variable local theLaunderer.

Visite la página /launderers/:id (link de Schedule a Pickup) y verá un formulario para programar una recolección con ese usuario. Cuando se envíe ese formulario, debemos guardar la recolección de ropa en la base de datos. Ya tenemos el código para el modelo LaundryPickup en models/laundry-pickup.js. Solo necesitamos requerirlo y usarlo en nuestra ruta POST.

Agregamos esta línea en routes/laundry.js:

```js
// routes/laundry.js
const User = require('../models/user');
const LaundryPickup = require('../models/laundry-pickup'); // <= AÑADIR

// ...
```

Ahora agreguemos nuestra ruta POST /laundry-pickups, en nuestras líneas 74-91 en routes/laundry.js:

```js
// ... inside of routes/laundry.js
router.get("/launderers/:id", async (req, res, next) => {
  const laundererId = req.params.id;

  try {
    const theUser = await User.findById(laundererId);

    res.render("laundry/launderer-profile", {
      theLaunderer: theUser,
    });
  } catch (error) {
    next(err);
    return;
  }
});


router.post("/laundry-pickups", withAuth, (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.userID,
  };

  const thePickup = new LaundryPickup(pickupInfo);

  thePickup.save((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect("/dashboard");
  });
});


module.exports = router;
```

Aspectos destacados de la ruta POST /laundry-pickups:

    Líneas 81-85: crea una instancia del modelo LaundryPickup con las propiedades correctas.
    
    Líneas 82-83: las propiedades pickupDate y launderer provienen del formulario. El input del launderer es una etiqueta <input> con type="hidden". ¡Comprueba el HTML!
    
    Línea 84: toma nuevamente el _id del usuario de req.userID.
    
    Línea 89: llama al método modelo save() de Mongoose para guardar realmente la recogida en la base de datos.
    
    Línea 95: si todo sale según lo planeado, redirige nuevamente al dashboard.


¡Ahora podemos programar una recogida! Podemos verificar que funcionó yendo a MongoDB Compass y consultando la base de datos.

Siguiente - recogidas pendientes.
