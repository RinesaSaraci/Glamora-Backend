const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // =======================
  // PASSWORDS
  // =======================
  const pass = await bcrypt.hash("password123", 10);

  // =======================
  // USERS
  // =======================
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@glamora.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@glamora.com",
      password: pass,
      role: "SUPERADMIN",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@glamora.com" },
    update: {},
    create: {
      name: "Admin Glamora",
      email: "admin@glamora.com",
      password: pass,
      role: "ADMIN",
    },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: "ana@glamora.com" },
    update: {},
    create: {
      name: "Ana Krasniqi",
      email: "ana@glamora.com",
      password: pass,
      role: "OWNER",
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "lira@glamora.com" },
    update: {},
    create: {
      name: "Lira Berisha",
      email: "lira@glamora.com",
      password: pass,
      role: "OWNER",
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: "besa@gmail.com" },
    update: {},
    create: {
      name: "Besa Morina",
      email: "besa@gmail.com",
      password: pass,
      role: "USER",
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "drita@gmail.com" },
    update: {},
    create: {
      name: "Drita Hoxha",
      email: "drita@gmail.com",
      password: pass,
      role: "USER",
    },
  });

  console.log("✓ Users created");

  // =======================
  // TENANTS
  // =======================
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: "glamora-prishtina" },
    update: {},
    create: {
      name: "Glamora Prishtina",
      slug: "glamora-prishtina",
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: "glamora-prizren" },
    update: {},
    create: {
      name: "Glamora Prizren",
      slug: "glamora-prizren",
    },
  });

  console.log("✓ Tenants created");

  // =======================
  // SALONS
  // =======================
  const salon1 = await prisma.salon.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Glamora Beauty Center",
      description: "Salon premium i bukurisë në qendër të Prishtinës",
      city: "Prishtinë",
      ownerId: owner1.id,
      tenantId: tenant1.id,
    },
  });

  const salon2 = await prisma.salon.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Glamora Spa & Nails",
      description: "Spa dhe nail art profesional",
      city: "Prizren",
      ownerId: owner2.id,
      tenantId: tenant2.id,
    },
  });

  console.log("✓ Salons created");

  // =======================
  // SERVICES - Salon 1
  // =======================
  const service1 = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Hydrafacial Premium",
      description: "Pastrim i thellë dhe hidratim i lëkurës",
      duration: 60,
      price: 85,
      salonId: salon1.id,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Prerje & Stilim",
      description: "Prerje flokësh dhe stilim profesional",
      duration: 45,
      price: 25,
      salonId: salon1.id,
    },
  });

  const service3 = await prisma.service.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Ngjyrosje Flokësh",
      description: "Ngjyrosje e plotë me produkte premium",
      duration: 120,
      price: 60,
      salonId: salon1.id,
    },
  });

  // =======================
  // SERVICES - Salon 2
  // =======================
  const service4 = await prisma.service.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Manikyr Klasik",
      description: "Manikyr me lakë të zakonshme",
      duration: 30,
      price: 15,
      salonId: salon2.id,
    },
  });

  const service5 = await prisma.service.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: "Gel Manikyr",
      description: "Manikyr me gel që zgjat deri 3 javë",
      duration: 60,
      price: 25,
      salonId: salon2.id,
    },
  });

  const service6 = await prisma.service.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: "Masazh Relaksues",
      description: "Masazh i plotë trupor 60 minuta",
      duration: 60,
      price: 40,
      salonId: salon2.id,
    },
  });

  console.log("✓ Services created");

  // =======================
  // EMPLOYEES - Salon 1
  // =======================
  const emp1 = await prisma.employee.upsert({
    where: { email: "sara.johnson@glamora.com" },
    update: {},
    create: {
      name: "Sara Johnson",
      email: "sara.johnson@glamora.com",
      phone: "+38344111222",
      salonId: salon1.id,
    },
  });

  const emp2 = await prisma.employee.upsert({
    where: { email: "mirlinda.gashi@glamora.com" },
    update: {},
    create: {
      name: "Mirlinda Gashi",
      email: "mirlinda.gashi@glamora.com",
      phone: "+38344333444",
      salonId: salon1.id,
    },
  });

  // =======================
  // EMPLOYEES - Salon 2
  // =======================
  const emp3 = await prisma.employee.upsert({
    where: { email: "valentina.koci@glamora.com" },
    update: {},
    create: {
      name: "Valentina Koçi",
      email: "valentina.koci@glamora.com",
      phone: "+38344555666",
      salonId: salon2.id,
    },
  });

  const emp4 = await prisma.employee.upsert({
    where: { email: "arta.rama@glamora.com" },
    update: {},
    create: {
      name: "Arta Rama",
      email: "arta.rama@glamora.com",
      phone: "+38344777888",
      salonId: salon2.id,
    },
  });

  console.log("✓ Employees created");

  // =======================
  // ASSIGN SERVICES TO EMPLOYEES
  // =======================
  await prisma.employeeService.createMany({
    data: [
      { employeeId: emp1.id, serviceId: service1.id },
      { employeeId: emp1.id, serviceId: service2.id },
      { employeeId: emp2.id, serviceId: service2.id },
      { employeeId: emp2.id, serviceId: service3.id },
      { employeeId: emp3.id, serviceId: service4.id },
      { employeeId: emp3.id, serviceId: service5.id },
      { employeeId: emp4.id, serviceId: service5.id },
      { employeeId: emp4.id, serviceId: service6.id },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Employee services assigned");

  // =======================
  // SCHEDULES (WorkingHours)
  // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  // =======================
  await prisma.workingHour.createMany({
    data: [
      // Sara - E Hënë deri E Premte 09:00-17:00
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },

      // Mirlinda - E Martë deri E Shtunë 10:00-18:00
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 5, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 6, startTime: "10:00", endTime: "15:00" },

      // Valentina - E Hënë deri E Premte 09:00-16:00
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 1, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 2, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 3, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 4, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 5, startTime: "09:00", endTime: "16:00" },

      // Arta - E Mërkurë deri E Shtunë 11:00-19:00
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 3, startTime: "11:00", endTime: "19:00" },
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 4, startTime: "11:00", endTime: "19:00" },
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 5, startTime: "11:00", endTime: "19:00" },
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 6, startTime: "11:00", endTime: "17:00" },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Schedules created");

  // =======================
  // RESERVATIONS (shembull)
  // =======================
  await prisma.reservation.createMany({
    data: [
      {
        salonId: salon1.id,
        customerId: customer1.id,
        employeeId: emp1.id,
        serviceId: service1.id,
        date: new Date("2026-06-02T00:00:00.000Z"),
        startTime: "10:00",
        endTime: "11:00",
        status: "CONFIRMED",
      },
      {
        salonId: salon1.id,
        customerId: customer2.id,
        employeeId: emp2.id,
        serviceId: service2.id,
        date: new Date("2026-06-03T00:00:00.000Z"),
        startTime: "11:00",
        endTime: "11:45",
        status: "PENDING",
      },
      {
        salonId: salon2.id,
        customerId: customer1.id,
        employeeId: emp3.id,
        serviceId: service4.id,
        date: new Date("2026-06-04T00:00:00.000Z"),
        startTime: "09:00",
        endTime: "09:30",
        status: "COMPLETED",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Reservations created");
  console.log("\n✅ Seeding completed!\n");
  console.log("Llogaritë test (password: password123):");
  console.log("  SUPERADMIN : superadmin@glamora.com");
  console.log("  ADMIN      : admin@glamora.com");
  console.log("  OWNER 1    : ana@glamora.com");
  console.log("  OWNER 2    : lira@glamora.com");
  console.log("  USER 1     : besa@gmail.com");
  console.log("  USER 2     : drita@gmail.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
