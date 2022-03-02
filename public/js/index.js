let inputs_element = document.querySelectorAll(".input-material");
inputs_element.forEach(element => {
    element.addEventListener("keyup", () => {
        element.setAttribute("value", element.value);
    })
});



