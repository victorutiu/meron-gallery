import { faker } from "@faker-js/faker"

const coffeeNames = [
  "Ethiopia Guji",
  "Colombia Supremo",
  "Kenya AA",
  "Brazil Santos",
  "Panama Duncan",
  "Costa Rica Tarrazu",
  "Guatemala Antigua",
  "Peru Cajamarca",
  "Rwanda Nyamasheke",
  "Honduras Marcala"
]

const origins = [
  "Ethiopia",
  "Colombia",
  "Kenya",
  "Brazil",
  "Panama",
  "Costa Rica",
  "Guatemala",
  "Peru",
  "Rwanda",
  "Honduras"
]

const processes = [
  "Washed",
  "Natural",
  "Honey",
  "Anaerobic",
  "Carbonic"
]

const quantities = [
  "250g",
  "500g",
  "1kg"
]

const statuses = [
  "Available",
  "Low stock",
  "Out of stock"
]

export function generateCoffee(){

  return {

    name: faker.helpers.arrayElement(coffeeNames),

    origin: faker.helpers.arrayElement(origins),

    process: faker.helpers.arrayElement(processes),

    price: faker.number.int({ min: 60, max: 140 }) + " RON",

    quantity: faker.helpers.arrayElement(quantities),

    status: faker.helpers.arrayElement(statuses)

  }

}