const characters = '-abcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length

function generateId(length) {
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export default generateId