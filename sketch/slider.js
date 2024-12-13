let slider = document.querySelector('input');
let value = document.querySelector('.input-range-value');
value.textContent = slider.value;
if (slider.value < 10) {
    value.textContent = 0 + slider.value;
}
slider.addEventListener('input', (e) => { // MDN <input type="range"> 참고함
    value.textContent = slider.value;
    if (slider.value < 10) {
        value.textContent = 0 + slider.value;
    }
})

addEventListener("wheel", (e) => { // MDN Element: wheel event 참고함(휠로 인풋값 조절)
    let step = 1;
    if (e.deltaY > 0) {
        slider.value--;
    } else {
        slider.value++;
    }
    value.textContent = slider.value;
    if (slider.value < 10) {
        value.textContent = 0 + slider.value;
    }
});