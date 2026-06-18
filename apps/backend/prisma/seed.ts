import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Create Roles
  console.log("Seeding roles...");
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Administrador del sistema",
    },
  });

  const responderRole = await prisma.role.upsert({
    where: { name: "responder" },
    update: {},
    create: {
      name: "responder",
      description: "Responsable de atender incidentes",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      description: "Usuario regular que reporta incidentes",
    },
  });

  console.log("Seeding roles completed.");

  // 2. Create Campus Areas
  console.log("Seeding campus areas...");
  const campusAreas = [
    { name: "Edificio A - Rectorado", description: "Edificio principal de administración", location: "Sector Norte" },
    { name: "Edificio B - Aulas", description: "Edificio de aulas y laboratorios", location: "Sector Central" },
    { name: "Edificio C - Biblioteca", description: "Biblioteca central", location: "Sector Central" },
    { name: "Polideportivo", description: "Complejo deportivo", location: "Sector Sur" },
    { name: "Estacionamiento", description: "Estacionamiento principal", location: "Sector Este" },
  ];

  for (const area of campusAreas) {
    await prisma.campusArea.upsert({
      where: { name: area.name },
      update: {},
      create: area,
    });
  }
  console.log("Seeding campus areas completed.");

  // 3. Create Default Admin User
  console.log("Seeding default admin user...");
  const adminEmail = "admin@universidad.edu"; // Mantenemos el correo contextual a la universidad

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Generación de hash dinámico importado de la rama dev
    const passwordHash = await bcrypt.hash("admin123", 10);

    const defaultAdmin = await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        passwordHash,
        isActive: true,
        roles: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
    });
    console.log("Default admin user created successfully:", defaultAdmin.email, "/ admin123");
  } else {
    console.log("Default admin user already exists.");
  }

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });