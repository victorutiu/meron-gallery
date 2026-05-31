import { test, expect } from "@playwright/test"


// Landing page -> Coffees page navigation
test("navigate from landing page to coffees page", async ({ page }) => {

  await page.goto("http://localhost:5173")

  await page.click("text=Coffees")

  await expect(page.locator("text=Manage coffees")).toBeVisible()

})


// Open coffee detail page
test("open coffee detail page", async ({ page }) => {

  await page.goto("http://localhost:5173/coffees")

  await page.locator("tbody tr").first().click()

  await expect(page.locator("text=Origin")).toBeVisible()

})


test("pagination buttons are visible", async ({ page }) => {

  await page.goto("http://localhost:5173/coffees")

  await expect(page.locator("text=Prev")).toBeVisible()
  await expect(page.locator("text=Next")).toBeVisible()

})