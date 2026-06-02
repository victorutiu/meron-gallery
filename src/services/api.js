const API =
  import.meta.env.PROD
    ? "https://meron-gallery-api.onrender.com/api"
    : "/api"

export async function loginUser(
  credentials
){

  const res =
    await fetch(
      `${API}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            credentials
          )
      }
    )

  const data =
    await res.json()

  if(!res.ok){

    throw new Error(
      data.message ||
      "Login failed"
    )
  }

  return data
}

export async function verifyCode(
  email,
  code
){

  const res =
    await fetch(
      `${API}/auth/verify`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            email,
            code
          })
      }
    )

  const data =
    await res.json()

  if(!res.ok){

    throw new Error(
      data.message ||
      "Verification failed"
    )
  }

  return data
}

export async function forgotPassword(
  email
){

  const res =
    await fetch(
      `${API}/auth/forgot-password`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            email
          })
      }
    )

  const data =
    await res.json()

  if(!res.ok){

    throw new Error(
      data.message ||
      "Reset failed"
    )
  }

  return data
}

export async function resetPassword(
  email,
  code,
  newPassword
){

  const res =
    await fetch(
      `${API}/auth/reset-password`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            email,
            code,
            newPassword
          })
      }
    )

  const data =
    await res.json()

  if(!res.ok){

    throw new Error(
      data.message ||
      "Password reset failed"
    )
  }

  return data
}

export async function getCoffees(
  page = 1,
  limit = 50
){

  const res =
    await fetch(
      `${API}/coffees?page=${page}&limit=${limit}`
    )

  return res.json()
}

export async function getCoffee(
  id
){

  const res =
    await fetch(
      `${API}/coffees/${id}`
    )

  return res.json()
}

export async function createCoffee(
  coffee
){

  const token =
    localStorage.getItem(
      "token"
    )

  const res =
    await fetch(
      `${API}/coffees`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${token}`
        },

        body:
          JSON.stringify(
            coffee
          )
      }
    )

  return res.json()
}

export async function updateCoffeeAPI(
  id,
  coffee
){

  const token =
    localStorage.getItem(
      "token"
    )

  const res =
    await fetch(
      `${API}/coffees/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${token}`
        },

        body:
          JSON.stringify(
            coffee
          )
      }
    )

  return res.json()
}

export async function deleteCoffeeAPI(
  id
){

  const token =
    localStorage.getItem(
      "token"
    )

  const res =
    await fetch(
      `${API}/coffees/${id}`,
      {
        method: "DELETE",

        headers: {
          "Authorization":
            `Bearer ${token}`
        }
      }
    )

  return res.json()
}