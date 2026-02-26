const result = document.getElementById('inputtext')
const answer = document.getElementById('output')

function appendValue (value) {
  const operators = '+-*/'
  const lastChar = result.value.slice(-1)

  if (operators.includes(value)) {
    if (result.value === '' && value !== '-') return
    if (operators.includes(lastChar) && value !== '-') return
    result.value += value
    return
  }

  if (value === '.') {
    const parts = result.value.split(/[+\-*/]/)
    const lastPart = parts[parts.length - 1]
    if (lastPart.includes('.')) return
  }

  result.value += value
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => appendValue(btn.textContent));
})

function deleteLast () {
  result.value = result.value.slice(0, -1)
}

function clr () {
  result.value = ''
  answer.innerText = '0'
}

function tokenize (expression) {
  const tokens = []
  let number = ''
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i]

    if (!isNaN(char) || char === '.') {
      number += char
    } else if (char === '-' && (i === 0 || '+-*/('.includes(expression[i - 1]))) {
      number += char
    } else if ('+-*/()'.includes(char)) {
      if (number !== '') {
        tokens.push(number)
        number = ''
      }
      tokens.push(char)
    }
  }

  if (number !== '') tokens.push(number)

  return tokens
}

function infixToPostfix (tokens) {
  const output = []
  const stack = []

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  }
  for (const token of tokens) {
    if (!isNaN(token)) {
      output.push(token)
    } else if ('+-*/'.includes(token)) {
      while (
        stack.length &&
        '+-*/'.includes(stack[stack.length - 1]) &&
        precedence[stack[stack.length - 1]] >= precedence[token]
      ) {
        output.push(stack.pop())
      }
      stack.push(token)
    } else if (token === '(') {
      stack.push(token)
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop())
      }
      stack.pop()
    }
  }

  while (stack.length) {
    output.push(stack.pop())
  }

  return output
}

function evaluatePostfix (postfix) {
  const stack = []

  for (const token of postfix) {
    if (!isNaN(token)) {
      stack.push(parseFloat(token))
    } else {
      const b = stack.pop()
      const a = stack.pop()

      if (a === undefined || b === undefined) {
        throw new Error('Invalid Expression')
      }

      switch (token) {
        case '+': stack.push(a + b); break
        case '-': stack.push(a - b); break
        case '*': stack.push(a * b); break
        case '/':
          if (b === 0) throw new Error('Divide by zero')
          stack.push(a / b)
          break
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid Expression')
  }

  return stack[0]
}

function calculate (expression) {
  if (!expression) throw new Error('Empty')

  expression = expression.replace(/\s+/g, '')
  expression = expression.replace(/%/g, '/100')

  const validPattern = /^[0-9+\-*/().]+$/
  if (!validPattern.test(expression)) {
    throw new Error('Invalid Characters')
  }

  const tokens = tokenize(expression)
  const postfix = infixToPostfix(tokens)
  return evaluatePostfix(postfix)
}

function showResult () {
  try {
    const output = calculate(result.value)
    answer.innerText = output
  } catch (error) {
    answer.innerText = 'Error'
  }
}
document.getElementById('equals').addEventListener('click', showResult)
document.getElementById('clear').addEventListener('click', clr)
document.getElementById('delete').addEventListener('click', deleteLast)
