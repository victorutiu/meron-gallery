import sgMail from "@sendgrid/mail"

sgMail.setApiKey(
  process.env.SENDGRID_API_KEY
)

export async function sendCodeEmail(
  email,
  code
){

  await sgMail.send({

    to: email,

    from:
      process.env.FROM_EMAIL,

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

  await sgMail.send({

    to: email,

    from:
      process.env.FROM_EMAIL,

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