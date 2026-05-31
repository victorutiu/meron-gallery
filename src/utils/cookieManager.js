export function setCookie(name, value, days = 7) {

  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)

  const expires = "expires=" + date.toUTCString()

  document.cookie = `${name}=${value}; ${expires}; path=/`
}


export function getCookie(name) {

  const cookies = document.cookie.split(";")

  for (let cookie of cookies) {

    cookie = cookie.trim()

    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1)
    }
  }

  return null
}