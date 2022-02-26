let inputs_element = document.querySelectorAll(".input-material");

console.log('Inputs elements', inputs_element)

inputs_element.forEach(element => {
    element.addEventListener("keyup", () => {
        element.setAttribute("value", element.value);
    })
});

