import { describe, it, expect } from "vitest"
import { generateCoffee } from "../src/utils/fakeGenerator.js"

describe("Fake Coffee Generator", () => {

it("should generate a coffee object", () => {


const coffee = generateCoffee()

expect(coffee).toHaveProperty("name")
expect(coffee).toHaveProperty("origin")
expect(coffee).toHaveProperty("process")
expect(coffee).toHaveProperty("price")
expect(coffee).toHaveProperty("quantity")
expect(coffee).toHaveProperty("status")

})

it("generated coffee should contain valid values", () => {

const coffee = generateCoffee()

expect(typeof coffee.name).toBe("string")
expect(typeof coffee.origin).toBe("string")
expect(coffee.price).toContain("RON")

})

})
