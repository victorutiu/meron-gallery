import { faker }
from "@faker-js/faker"

import prisma
from "../data/prisma.js"

async function main(){

    await prisma.review.deleteMany()

await prisma.coffee.deleteMany()

  console.log(
    "Generating fake data..."
  )

  const adminRole =
    await prisma.role.findFirst({
      where:{
        name:"admin"
      }
    })

  const userRole =
    await prisma.role.findFirst({
      where:{
        name:"user"
      }
    })

  // ------------------
  // USERS
  // ------------------

  const users = []

  for(let i = 0; i < 1000; i++){

    users.push({

      email:
        `user${i}_${Date.now()}
        @gmail.com`,

      password:
        "$2b$10$abcdabcdabcdabcdabcdabcdabcdabcd",

      roleId:
        userRole.id
    })
  }

  await prisma.user.createMany({
    data: users
  })

  console.log(
    "Users created"
  )

  // ------------------
  // COFFEES
  // ------------------

  
  const coffees = []

const origins = [
  "Brazil",
  "Colombia",
  "Ethiopia",
  "Panama",
  "Kenya",
  "Costa Rica"
]

const processes = [
  "Natural",
  "Washed",
  "Honey"
]

const coffeeNames = [
  "El Sendero",
  "Finca Aurora",
  "La Esperanza",
  "Cerro Azul",
  "Los Nogales",
  "Fazenda Santa",
  "Monte Verde",
  "Volcan Valley",
  "Casa Negra",
  "Red Bourbon",

  "Panama Geisha",
  "Ethiopian Bloom",
  "Kenya Sunrise",
  "Colombia Reserve",
  "Brazil Santos",
  "Guatemala Huehuetenango",
  "Costa Rica Honey",
  "Rwanda Natural",
  "Sumatra Mandheling",
  "Yirgacheffe Classic",

  "Espresso House Blend",
  "Morning Roast",
  "Golden Crema",
  "Velvet Espresso",
  "Black Honey",
  "Cherry Blossom",
  "Citrus Bloom",
  "Wild Forest",
  "Velvet Sunset",
  "Midnight Roast"
]

for(let i = 0; i < 100; i++){

  coffees.push({

    name:
      faker.helpers.arrayElement(
        coffeeNames
      ),

    origin:
      faker.helpers.arrayElement(
        origins
      ),

    process:
      faker.helpers.arrayElement(
        processes
      ),

    price:
      faker.number.int({
        min:50,
        max:250
      }).toString(),

    quantity:
      faker.number.int({
        min:250,
        max:1000
      }).toString(),

    status:
      "Available"
  })
}

await prisma.coffee.createMany({
  data: coffees
})

console.log(
  "Coffees created"
)

  await prisma.coffee.createMany({
    data: coffees
  })

  console.log(
    "Coffees created"
  )

  // ------------------
  // REVIEWS
  // ------------------

  const allUsers =
    await prisma.user.findMany()

  const allCoffees =
    await prisma.coffee.findMany()

  const reviews = []

  for(let i=0;i<50000;i++){

    const randomUser =
      faker.helpers
        .arrayElement(
          allUsers
        )

    const randomCoffee =
      faker.helpers
        .arrayElement(
          allCoffees
        )

    reviews.push({

      rating:
        faker.number.int({
          min:1,
          max:5
        }),

      comment:
        faker.lorem.sentence(),

      userId:
        randomUser.id,

      coffeeId:
        randomCoffee.id
    })
  }

  await prisma.review.createMany({
    data: reviews
  })

  console.log(
    "50k reviews created"
  )

  console.log("DONE")
}

main()
.catch(console.error)
.finally(() =>
  prisma.$disconnect()
)