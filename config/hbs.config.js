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
  if (dueño && dueño === 'on') {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})


// check if the user key "dueño" has "off" value
hbs.registerHelper('ifDueñoisOff', function (options) {
  const { dueño } = options.hash;
  if (dueño && dueño === 'off') {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})


// show in red the likes of the current user
hbs.registerHelper('userLikedProduct', function (options) {
  const { producto, likes } = options.hash;
  if (producto && likes && likes.some(like => like.producto == producto)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})


// count all likes of each product
hbs.registerHelper('countLikes', function (options) {
  const { producto , allLikes} = options.hash;
  if (producto && allLikes) {
    const sum = allLikes.filter(el=> el.producto==producto).length
    return sum
  }
})


// check if the comment is of the current User
hbs.registerHelper('ifCommentOfTheCurrentUser', function (options) {
  const { idUserWhoCommented , currentUserId} = options.hash;
  if (idUserWhoCommented && currentUserId && idUserWhoCommented===currentUserId){
      return options.fn(this);
    } else {
      return options.inverse(this);
    }  
})


// chek if the current User has already posted a comment, if so, dont show the link
hbs.registerHelper('ifNoCommentOfCurrenUser', function (options) {
  const { allInfo , currentUser} = options.hash;
  let ccc = allInfo.map (el => el.user.id).some(el => el===currentUser)
  if (!ccc){
    return options.fn(this);
  } else {
    return options.inverse(this);
  } 
})



// chek if the current User has logged with socials, if so, dont show the link
hbs.registerHelper('ifLoginSocial', function (options) {
  const { social} = options.hash;
  if (!social){
    return options.fn(this);
  } else {
    return options.inverse(this);
  } 
})