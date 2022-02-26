const hbs = require('hbs')

hbs.registerPartials('./views/partials')

// check if the key "ownerId" of the tienda  === currentUser Id
hbs.registerHelper('ifIsDueño', function (options) {
    const { tiendaOwnerId, dueñoId } = options.hash;
    if (tiendaOwnerId && dueñoId && tiendaOwnerId==dueñoId) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

  // check if the user key "dueño" has "on" value 
  hbs.registerHelper('ifDueñoisOn', function (options) {
    const { dueño } = options.hash;
    if (dueño && dueño === "on") {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

  // check if the user key "dueño" has "off" value 
  hbs.registerHelper('ifDueñoisOff', function (options) {
    const { dueño } = options.hash;
    if (dueño && dueño === "off") {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })