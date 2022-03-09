
const httpClient = axios.create({})



const likeProduct = (id, icon) => httpClient.post(`/like/${id}`)
  .then(() => {
    icon.classList.toggle('icon-liked');
  })
  .catch(err => console.log(err))
  .finally(() => icon.classList.remove('icon-events-none'))




document.querySelectorAll('.like-button')
.forEach(btn => {
  console.log(btn)
  btn.onclick = (event) => {
    //console.log(btn)
    btn.classList.add('icon-events-none')
    likeProduct(event.target.dataset.id, event.target)
  }
})

