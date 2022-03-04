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


// ----------------------------------------------
// when like button is pressed the number increase or decrease(not in the database)
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
})

// ----------------------------------------------
// when the page product is loaded, we receive from the controller, the averageRating
// here we convert the number in stars
function numberToStars(rating) {

  // Round to nearest half
  rating = Math.round(rating * 2) / 2;
  let output = [];

  // Append all the filled whole stars
  for (var i = rating; i >= 1; i--)
    output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  // If there is a half a star, append it
  if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  // Fill the empty stars
  for (let i = (5 - rating); i >= 1; i--)
    output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  return output.join('');
}


// average rating of the product displayed on product page comments
const averageRating = document.getElementById("avRatingToIndexJs").innerHTML 
document.getElementById("averageStars").innerHTML = numberToStars(averageRating);


// each user rating displayed on product page comments
const elements = document.querySelectorAll(".userRatingToIndexJs");

elements.forEach(element => {
      let userRating = element.innerText 
      element.innerHTML = numberToStars(userRating)
});

