const hbs = require('hbs')

hbs.registerPartials('./views/partials')

// check if ownerId === tiendaId
hbs.registerHelper('ifIsDueño', function (options) {
    const { tiendaOwnerId, dueñoId } = options.hash;
    if (tiendaOwnerId && dueñoId && tiendaOwnerId==dueñoId) {
        console.log("tienda id",tiendaOwnerId, "dueñoId", dueñoId)
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })