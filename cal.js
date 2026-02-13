const result = document.getElementById('inputtext')
const answer = document.getElementById('output');
const appendValue = (number) => {
    result.value += number;
}

let Result = () => {
    try {
        answer.innerText = eval(result.value);
    } catch (error) {
      alert("error");
    }
}

let deleteLast= () => {
    result.value = result.value.slice(0, -1);
}

function clr() {
    result.value = '';
    answer.innerText = '0';
}
