import { chromium }
from "playwright"

async function attack(){

  const browser =
    await chromium.launch({
      headless:false
    })

  const page =
    await browser.newPage()

  for(let i=0;i<7;i++){

    console.log(
      `Attack ${i+1}`
    )

    await page.goto(
      "http://localhost:5173/login"
    )

    await page.fill(
      'input[type="email"]',
      "victim@gmail.com"
    )

    await page.fill(
      'input[type="password"]',
      "WRONG_PASSWORD"
    )

    const buttons =
      await page.locator(
        "button"
      ).all()

    await buttons[0].click()

    await page.waitForTimeout(
      500
    )
  }

  await browser.close()

  console.log(
    "Attack complete"
  )
}

attack()