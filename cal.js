const result = document.getElementById('inputtext')
const answer = document.getElementById('output')
 function appendValue (number) {
    result.value += number
}

const Result = () => {
    try {
    answer.innerText = eval(result.value)
  } catch (error) {
    alert('error')
  }
}

const deleteLast = () => {
  result.value = result.value.slice(0, -1)
}

function clr () {
  result.value = ''
  answer.innerText = '0'
}
