const result = document.getElementById('inputtext')
const answer = document.getElementById('output')

/* ================= UI FUNCTIONS ================= */

function appendValue(value) {
  const lastChar = result.value.slice(-1)

  if ('+-*/'.includes(value)) {
    if (result.value === "" && value !== "-") return
    if ('+-*/'.includes(lastChar))  if ('+-*/'.includes(lastChar)) {
      if (value === "-") return result.value += value
      return
    }
  }

  if (value === '.') {
    const parts = result.value.split(/[\+\-\*\/]/)
    if (parts[parts.length - 1].includes('.')) return
  }

  result.value += value
}

function deleteLast() { 
  result.value = result.value.slice(0, -1)
}

function clr() {
  result.value = ''
  answer.innerText = '0'
}

/* ================= TOKENIZER ================= */

function tokenize(expression) {
  const tokens = []
  let number = ''
  
  for (let i = 0; i < expression.length; i++) {
    let char = expression[i]

    if (!isNaN(char) || char === '.') {
      number += char
    }  else if (char === '-' && (i === 0 || '+-*/('.includes(expression[i - 1]))) {
      number += char   // unary minus
    }  else if ('+-*/()'.includes(char)) {
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

/* ================= INFIX → POSTFIX ================= */

function infixToPostfix (tokens) {
  const output = []
  const stack = []

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  }

  for (let token of tokens) {

    if (!isNaN(token)) {
      output.push(token)
    }  else if ('+-*/'.includes(token)) {
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

/* ================= POSTFIX EVALUATION ================= */

function evaluatePostfix (postfix) {
  const stack = []

  for (let token of postfix) {
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

/* ================= MAIN CALCULATE ================= */

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

/* ================= RESULT ================= */

function Result () {
  try {
    const output = calculate(result.value)
    answer.innerText = output
  } catch (error) {
    answer.innerText = 'Error'
  }
}
