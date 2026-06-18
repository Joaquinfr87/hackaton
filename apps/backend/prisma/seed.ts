import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin", description: "Administrador del sistema" },
  });

  await prisma.role.upsert({
    where: { name: "responder" },
    update: {},
    create: { name: "responder", description: "Personal responsable de atender incidentes" },
  });

  await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user", description: "Usuario regular que reporta incidentes" },
  });

  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@hackaton.com" },
  });

  if (!adminExists) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@hackaton.com",
        passwordHash,
        roles: { create: { roleId: adminRole.id } },
      },
    });
    console.log("Admin creado: admin@hackaton.com / admin123");
  }

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
