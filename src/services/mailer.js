import nodemailer from "nodemailer"

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS
    }
  })

export async function sendCodeEmail(
  email,
  code
){

  await transporter.sendMail({

    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      "Meron Gallery Verification Code",

    html: `
      <h2>
        Login verification
      </h2>

      <p>
        Your verification
        code is:
      </p>

      <h1>${code}</h1>

      <p>
        This expires
        in 10 minutes.
      </p>
    `
  })
}

export async function sendResetEmail(
  email,
  code
){

  await transporter.sendMail({

    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      "Meron Gallery Password Reset",

    html: `
      <h2>
        Password reset
      </h2>

      <p>
        Your reset
        code is:
      </p>

      <h1>${code}</h1>

      <p>
        This expires
        in 10 minutes.
      </p>
    `
  })
}