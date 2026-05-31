import { describe, test, expect, beforeEach } from "vitest"
import request from "supertest"

import app from "../server.js"
import prisma from "../data/prisma.js"

describe("Coffee API (Database)", () => {

  // clean DB before each test
  beforeEach(async () => {
    await prisma.coffee.deleteMany()
  })

  // -----------------------
  // GET ALL
  // -----------------------
  test("GET /coffees should return coffees", async () => {

    await prisma.coffee.create({
      data: {
        name: "Seed Coffee",
        origin: "Brazil",
        process: "Natural",
        price: "50 RON",
        quantity: "250g",
        status: "Available"
      }
    })

    const res = await request(app).get("/coffees")

    expect(res.statusCode).toBe(200)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  // -----------------------
  // CREATE
  // -----------------------
  test("POST /coffees should create coffee", async () => {

    const res = await request(app)
      .post("/coffees")
      .send({
        name: "Test Coffee",
        origin: "Colombia",
        process: "Natural",
        price: "70 RON",
        quantity: "250g",
        status: "Available"
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.name).toBe("Test Coffee")
  })

  // -----------------------
  // UPDATE
  // -----------------------
  test("PUT /coffees/:id should update coffee", async () => {

    const created = await prisma.coffee.create({
      data: {
        name: "Update Test",
        origin: "Kenya",
        process: "Natural",
        price: "60 RON",
        quantity: "250g",
        status: "Available"
      }
    })

    const res = await request(app)
      .put(`/coffees/${created.id}`)
      .send({ price: "80 RON" })

    expect(res.statusCode).toBe(200)
    expect(res.body.price).toBe("80 RON")
  })

  // -----------------------
  // DELETE
  // -----------------------
  test("DELETE /coffees/:id should delete coffee", async () => {

    const created = await prisma.coffee.create({
      data: {
        name: "Delete Test",
        origin: "Panama",
        process: "Natural",
        price: "80 RON",
        quantity: "250g",
        status: "Available"
      }
    })

    const res = await request(app)
      .delete(`/coffees/${created.id}`)

    expect(res.statusCode).toBe(200)
  })

  // -----------------------
  // NOT FOUND
  // -----------------------
  test("PUT should return 404 if coffee does not exist", async () => {

    const res = await request(app)
      .put("/coffees/9999")
      .send({ price: "100 RON" })

    expect(res.statusCode).toBe(404)
  })

  test("DELETE should return 404 if coffee does not exist", async () => {

    const res = await request(app)
      .delete("/coffees/9999")

    expect(res.statusCode).toBe(404)
  })

})

test("GET /statistics/origins should return correct aggregation", async () => {

     await prisma.coffee.deleteMany()
  await prisma.coffee.createMany({
    data: [
      {
        name: "Coffee1",
        origin: "Brazil",
        process: "Natural",
        price: "50 RON",
        quantity: "250g",
        status: "Available"
      },
      {
        name: "Coffee2",
        origin: "Brazil",
        process: "Natural",
        price: "60 RON",
        quantity: "250g",
        status: "Available"
      },
      {
        name: "Coffee3",
        origin: "Colombia",
        process: "Washed",
        price: "70 RON",
        quantity: "500g",
        status: "Available"
      }
    ]
  })

  const res = await request(app).get("/statistics/origins")

  expect(res.statusCode).toBe(200)

  // 🔥 FIX HERE
  expect(res.body["Brazil"]).toBe(2)
  expect(res.body["Colombia"]).toBe(1)

})


test("GET /statistics/quantities should return correct aggregation", async () => {

     await prisma.coffee.deleteMany()
  await prisma.coffee.createMany({
    data: [
      {
        name: "Q1",
        origin: "Kenya",
        process: "Natural",
        price: "50 RON",
        quantity: "250g",
        status: "Available"
      },
      {
        name: "Q2",
        origin: "Kenya",
        process: "Natural",
        price: "60 RON",
        quantity: "250g",
        status: "Available"
      }
    ]
  })

  const res = await request(app).get("/statistics/quantities")

  expect(res.statusCode).toBe(200)

  // 🔥 FIX HERE
  expect(res.body["250g"]).toBe(2)

})


test("GET /coffees/:id should return a coffee", async () => {

    await prisma.coffee.deleteMany()
  const created = await prisma.coffee.create({
    data: {
      name: "Single Coffee",
      origin: "Brazil",
      process: "Natural",
      price: "50 RON",
      quantity: "250g",
      status: "Available"
    }
  })

  const res = await request(app).get(`/coffees/${created.id}`)

  expect(res.statusCode).toBe(200)
  expect(res.body.name).toBe("Single Coffee")

})


test("GET /coffees/:id should return 404 if not found", async () => {

  const res = await request(app).get("/coffees/9999")

  expect(res.statusCode).toBe(404)

})



test("POST /coffees should fail if fields missing", async () => {

    
  const res = await request(app)
    .post("/coffees")
    .send({
      name: "Incomplete Coffee"
    })

  expect(res.statusCode).toBe(400)

})



test("GET /coffees should filter by origin", async () => {

    await prisma.coffee.deleteMany()
  await prisma.coffee.createMany({
    data: [
      {
        name: "Brazil Coffee",
        origin: "Brazil",
        process: "Natural",
        price: "50 RON",
        quantity: "250g",
        status: "Available"
      },
      {
        name: "Kenya Coffee",
        origin: "Kenya",
        process: "Natural",
        price: "60 RON",
        quantity: "250g",
        status: "Available"
      }
    ]
  })

  const res = await request(app).get("/coffees?origin=Brazil")

  expect(res.statusCode).toBe(200)
  expect(res.body.data.length).toBe(1)
  expect(res.body.data[0].origin).toBe("Brazil")

})



test("GET /coffees should filter by quantity", async () => {

    await prisma.coffee.deleteMany()
  await prisma.coffee.createMany({
    data: [
      {
        name: "Q1",
        origin: "Brazil",
        process: "Natural",
        price: "50 RON",
        quantity: "250g",
        status: "Available"
      },
      {
        name: "Q2",
        origin: "Brazil",
        process: "Natural",
        price: "60 RON",
        quantity: "500g",
        status: "Available"
      }
    ]
  })

  const res = await request(app).get("/coffees?quantity=250g")

  expect(res.statusCode).toBe(200)
  expect(res.body.data.length).toBe(1)
  expect(res.body.data[0].quantity).toBe("250g")

})


test("GET /coffees should paginate results", async () => {

    await prisma.coffee.deleteMany()
  await prisma.coffee.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Coffee ${i}`,
      origin: "Brazil",
      process: "Natural",
      price: "50 RON",
      quantity: "250g",
      status: "Available"
    }))
  })

  const res = await request(app).get("/coffees?page=2&limit=3")

  expect(res.statusCode).toBe(200)
  expect(res.body.data.length).toBe(3)
  expect(res.body.page).toBe(2)

})


