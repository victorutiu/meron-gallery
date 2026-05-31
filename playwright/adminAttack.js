import { chromium }
from "playwright"

async function attack(){

  const browser =
    await chromium.launch({
      headless:false
    })

  const page =
    await browser.newPage()

  // normal user login
  await page.goto(
    "http://localhost:5173/login"
  )

  await page.fill(
    'input[type="email"]',
    "vu@gmail.com"
  )

  await page.fill(
    'input[type="password"]',
    "1234"
  )

  await page.click("button")

  await page.waitForTimeout(
    1500
  )

  // try admin action
  for(let i=0;i<5;i++){

    console.log(
      `Admin abuse ${i+1}`
    )

    await page.goto(
      "http://localhost:5173/coffees"
    )

    await page.click(
      "text=Add Coffee"
    )

    await page.waitForTimeout(
      500
    )
  }

  console.log(
    "Attack finished"
  )
}

attack()