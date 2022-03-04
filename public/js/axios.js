
const httpClient = axios.create({
  baseURL: 'http://localhost:3000'
})

const likeProduct = (id, icon) => httpClient.post(`/like/${id}`)
  .then(() => {
    icon.classList.toggle('icon-liked');
  })
  .catch(err => console.error(err))
  .finally(() => icon.classList.remove('icon-events-none'))

document.querySelectorAll('.like-button ')
.forEach(btn => {
  btn.onclick = (event) => {
    //console.log(btn)
    btn.classList.add('icon-events-none')
    likeProduct(event.target.dataset.id, event.target)
  }
})

