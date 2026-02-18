const result = document.getElementById('inputtext')
const answer = document.getElementById('output')

function appendValue(number) {
  result.value += number
}

function calculateExpression(expression) {
  // Allow only numbers and math operators
  const validPattern = /^[0-9+\-*/%.() ]+$/

  if (!validPattern.test(expression)) {
    throw new Error('Invalid characters')
  }

  // Replace % with /100
  const safeExpression = expression.replace(/%/g, '/100')

  // Evaluate safely after validation
  return Function('"use strict"; return (' + safeExpression + ')')()
}

calculateExpression ()

function Result () {
  try {
    const output = math.evaluate(result.value)
    answer.innerText = output
  } catch (error) {
    answer.innerText = 'Error'
  }
}

Result()

function deleteLast () {
  result.value = result.value.slice(0, -1)
}

deleteLast()

function clr () {
  result.value = ''
  answer.innerText = '0'
}

clr()
