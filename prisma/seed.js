import prisma from "../data/prisma.js"

async function main() {

  // clear existing (safe now)
  await prisma.permission.deleteMany()
  await prisma.role.deleteMany()

  // create roles
  const admin = await prisma.role.create({
    data: {
      name: "admin"
    }
  })

  const user = await prisma.role.create({
    data: {
      name: "user"
    }
  })

  // create permissions
  await prisma.permission.createMany({
    data: [
      { name: "create_coffee", roleId: admin.id },
      { name: "update_coffee", roleId: admin.id },
      { name: "delete_coffee", roleId: admin.id },

      { name: "read_coffee", roleId: user.id }
    ]
  })

  console.log("✅ Roles & permissions seeded")
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())