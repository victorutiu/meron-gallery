import { coffees } from "../data/store.js"

export const typeDefs = `

  type Coffee {
    id: Int
    name: String
    origin: String
    process: String
    price: String
    quantity: String
    status: String
  }

  type OriginGroup {
    origin: String
    coffees: [Coffee]
  }

  type Query {
    coffees: [Coffee]
    coffee(id: Int): Coffee
    coffeesByOrigin: [OriginGroup]
  }

  type Mutation {

    createCoffee(
      name: String
      origin: String
      process: String
      price: String
      quantity: String
      status: String
    ): Coffee

    updateCoffee(
      id: Int
      name: String
      origin: String
      process: String
      price: String
      quantity: String
      status: String
    ): Coffee

    deleteCoffee(id: Int): Boolean

  }

`

export const resolvers = {

  Query: {

    coffees: () => coffees,

    coffee: (_, { id }) => coffees.find(c => c.id === id),

    // 1-to-many relationship demonstration
    coffeesByOrigin: () => {

      const grouped = {}

      coffees.forEach(coffee => {

        if (!grouped[coffee.origin]) {
          grouped[coffee.origin] = []
        }

        grouped[coffee.origin].push(coffee)

      })

      return Object.keys(grouped).map(origin => ({
        origin,
        coffees: grouped[origin]
      }))

    }

  },

  Mutation: {

    createCoffee: (_, args) => {

      const newCoffee = {
        id: coffees.length + 1,
        ...args
      }

      coffees.push(newCoffee)

      return newCoffee
    },

    updateCoffee: (_, args) => {

      const index = coffees.findIndex(c => c.id === args.id)

      if (index === -1) return null

      coffees[index] = { ...coffees[index], ...args }

      return coffees[index]
    },

    deleteCoffee: (_, { id }) => {

      const index = coffees.findIndex(c => c.id === id)

      if (index === -1) return false

      coffees.splice(index, 1)

      return true
    }

  }

}