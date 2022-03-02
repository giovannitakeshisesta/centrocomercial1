let inputs_element = document.querySelectorAll(".input-material");
inputs_element.forEach(element => {
    element.addEventListener("keyup", () => {
        element.setAttribute("value", element.value);
    })
});



// login eye toggler
document.addEventListener('DOMContentLoaded', () => {
  function onClickPasswordToggle(event) {
    const button = event.currentTarget;
    const input = button.previousElementSibling;
    const icon = button.querySelector('i');

    if (input.type === 'text') {
      input.type = 'password';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }

  document.querySelectorAll('.password-toggle')
    .forEach(button => button.addEventListener('click', onClickPasswordToggle));
})


// // // ----------------------------------------------

// document.addEventListener('DOMContentLoaded', () => {
//   function onClickAddRemoveOne(event) {
//     const button = event.currentTarget;
//     const icon = button.querySelector('i');
//     const p = button.querySelector('p');

//     if (icon.classList.contains("icon-liked") ){
//       console.log(Number(p.innerText)+1)
//       p.innerHTML   = (Number(p.innerText)-1)
//     } else {
//       p.innerHTML   = (Number(p.innerText)+1)
//     }
    
//   }

//   document.querySelectorAll('.like-button ')
//     .forEach(button => button.addEventListener('click', onClickAddRemoveOne));
// })

// // ----------------------------------------------

// // ----------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  function onClickAddRemoveOne(event) {
    const button = event.currentTarget;
    const p = button.querySelector('p');
    //console.log(button.classList)
    //console.log(p)
    if (button.classList.contains("icon-liked") ){
      //console.log(Number(p.innerText)+1)
      p.innerHTML   = (Number(p.innerText)-1)
    } else {
      p.innerHTML   = (Number(p.innerText)+1)
    }
    
  }

  document.querySelectorAll('.like-button')
    .forEach(button => button.addEventListener('click', onClickAddRemoveOne));

  document.querySelectorAll('.like-button p')
    .forEach(p => p.stopPropagation());


})

// ----------------------------------------------
