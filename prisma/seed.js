const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const pass = await bcrypt.hash("password123", 10);

  // =======================
  // USERS
  // =======================
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@glamora.com" },
    update: {},
    create: { name: "Super Admin", email: "superadmin@glamora.com", password: pass, role: "SUPERADMIN" },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@glamora.com" },
    update: {},
    create: { name: "Admin Glamora", email: "admin@glamora.com", password: pass, role: "ADMIN" },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: "ana@glamora.com" },
    update: {},
    create: { name: "Ana Krasniqi", email: "ana@glamora.com", password: pass, role: "OWNER" },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "lira@glamora.com" },
    update: {},
    create: { name: "Lira Berisha", email: "lira@glamora.com", password: pass, role: "OWNER" },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: "besa@gmail.com" },
    update: {},
    create: { name: "Besa Morina", email: "besa@gmail.com", password: pass, role: "USER" },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "drita@gmail.com" },
    update: {},
    create: { name: "Drita Hoxha", email: "drita@gmail.com", password: pass, role: "USER" },
  });

  console.log("✓ Users created");

  // =======================
  // TENANTS
  // =======================
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: "glamora-prishtina" },
    update: {},
    create: { name: "Glamora Prishtina", slug: "glamora-prishtina" },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: "glamora-prizren" },
    update: {},
    create: { name: "Glamora Prizren", slug: "glamora-prizren" },
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
  // CATEGORIES
  // =======================
  const cat1 = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Flokë", description: "Prerje, ngjyrosje dhe stilim", salonId: salon1.id },
  });

  const cat2 = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "Lëkura", description: "Trajtime fytyre dhe lëkure", salonId: salon1.id },
  });

  const cat3 = await prisma.category.upsert({
    where: { id: 3 },
    update: {},
    create: { name: "Nail Art", description: "Manikyr dhe pedikyr", salonId: salon2.id },
  });

  const cat4 = await prisma.category.upsert({
    where: { id: 4 },
    update: {},
    create: { name: "Spa & Relaks", description: "Masazhe dhe trajtime relaksuese", salonId: salon2.id },
  });

  console.log("✓ Categories created");

  // =======================
  // SERVICES
  // =======================
  const service1 = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Hydrafacial Premium", description: "Pastrim i thellë dhe hidratim i lëkurës", duration: 60, price: 85, salonId: salon1.id, categoryId: cat2.id },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "Prerje & Stilim", description: "Prerje flokësh dhe stilim profesional", duration: 45, price: 25, salonId: salon1.id, categoryId: cat1.id },
  });

  const service3 = await prisma.service.upsert({
    where: { id: 3 },
    update: {},
    create: { name: "Ngjyrosje Flokësh", description: "Ngjyrosje e plotë me produkte premium", duration: 120, price: 60, salonId: salon1.id, categoryId: cat1.id },
  });

  const service4 = await prisma.service.upsert({
    where: { id: 4 },
    update: {},
    create: { name: "Manikyr Klasik", description: "Manikyr me lakë të zakonshme", duration: 30, price: 15, salonId: salon2.id, categoryId: cat3.id },
  });

  const service5 = await prisma.service.upsert({
    where: { id: 5 },
    update: {},
    create: { name: "Gel Manikyr", description: "Manikyr me gel që zgjat deri 3 javë", duration: 60, price: 25, salonId: salon2.id, categoryId: cat3.id },
  });

  const service6 = await prisma.service.upsert({
    where: { id: 6 },
    update: {},
    create: { name: "Masazh Relaksues", description: "Masazh i plotë trupor 60 minuta", duration: 60, price: 40, salonId: salon2.id, categoryId: cat4.id },
  });

  console.log("✓ Services created");

  // =======================
  // EMPLOYEES
  // =======================
  const emp1 = await prisma.employee.upsert({
    where: { email: "sara.johnson@glamora.com" },
    update: {},
    create: { name: "Sara Johnson", email: "sara.johnson@glamora.com", phone: "+38344111222", salonId: salon1.id },
  });

  const emp2 = await prisma.employee.upsert({
    where: { email: "mirlinda.gashi@glamora.com" },
    update: {},
    create: { name: "Mirlinda Gashi", email: "mirlinda.gashi@glamora.com", phone: "+38344333444", salonId: salon1.id },
  });

  const emp3 = await prisma.employee.upsert({
    where: { email: "valentina.koci@glamora.com" },
    update: {},
    create: { name: "Valentina Koçi", email: "valentina.koci@glamora.com", phone: "+38344555666", salonId: salon2.id },
  });

  const emp4 = await prisma.employee.upsert({
    where: { email: "arta.rama@glamora.com" },
    update: {},
    create: { name: "Arta Rama", email: "arta.rama@glamora.com", phone: "+38344777888", salonId: salon2.id },
  });

  console.log("✓ Employees created");

  // =======================
  // EMPLOYEE SERVICES
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
  // SCHEDULES
  // =======================
  await prisma.workingHour.createMany({
    data: [
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp1.id, salonId: salon1.id, dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 5, startTime: "10:00", endTime: "18:00" },
      { employeeId: emp2.id, salonId: salon1.id, dayOfWeek: 6, startTime: "10:00", endTime: "15:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 1, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 2, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 3, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 4, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp3.id, salonId: salon2.id, dayOfWeek: 5, startTime: "09:00", endTime: "16:00" },
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 3, startTime: "11:00", endTime: "19:00" },
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 4, startTime: "11:00", endTime: "19:00" },
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 5, startTime: "11:00", endTime: "19:00" },
      { employeeId: emp4.id, salonId: salon2.id, dayOfWeek: 6, startTime: "11:00", endTime: "17:00" },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Schedules created");

  // =======================
  // RESERVATIONS
  // =======================
  await prisma.reservation.createMany({
    data: [
      {
        salonId: salon1.id, customerId: customer1.id, employeeId: emp1.id, serviceId: service1.id,
        date: new Date("2026-06-02T00:00:00.000Z"), startTime: "10:00", endTime: "11:00", status: "CONFIRMED",
      },
      {
        salonId: salon1.id, customerId: customer2.id, employeeId: emp2.id, serviceId: service2.id,
        date: new Date("2026-06-03T00:00:00.000Z"), startTime: "11:00", endTime: "11:45", status: "PENDING",
      },
      {
        salonId: salon2.id, customerId: customer1.id, employeeId: emp3.id, serviceId: service4.id,
        date: new Date("2026-06-04T00:00:00.000Z"), startTime: "09:00", endTime: "09:30", status: "COMPLETED",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Reservations created");

  // =======================
  // PROMOTIONS
  // =======================
  await prisma.promotion.createMany({
    data: [
      {
        salonId: salon1.id, title: "Zbritje Verore 20%", description: "20% zbritje për të gjitha shërbimet e flokëve",
        discountType: "PERCENTAGE", discountValue: 20, code: "SUMMER20",
        validFrom: new Date("2026-06-01"), validTo: new Date("2026-08-31"), isActive: true,
      },
      {
        salonId: salon2.id, title: "Manikyr Falas", description: "Gel manikyr falas me çdo masazh",
        discountType: "FIXED", discountValue: 25, code: "NAILS25",
        validFrom: new Date("2026-06-01"), validTo: new Date("2026-07-31"), isActive: true,
      },
    ],
    skipDuplicates: false,
  });

  console.log("✓ Promotions created");

  // =======================
  // PRODUCTS
  // =======================
  await prisma.product.createMany({
    data: [
      { salonId: salon1.id, name: "Serum Hidratues", description: "Serum premium për lëkurën e fytyrës", price: 35, stock: 20 },
      { salonId: salon1.id, name: "Maskë Flokësh", description: "Maskë ushqyese për flokë të dëmtuar", price: 18, stock: 15 },
      { salonId: salon2.id, name: "Krem Duarsh", description: "Krem hidratues pas manikyr", price: 12, stock: 30 },
      { salonId: salon2.id, name: "Vaj Masazhi", description: "Vaj natyral lavandë për masazh", price: 22, stock: 10 },
    ],
    skipDuplicates: false,
  });

  console.log("✓ Products created");

  // =======================
  // NOTIFICATIONS
  // =======================
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id, title: "Rezervimi u konfirmua!",
        message: "Rezervimi juaj për Hydrafacial Premium më 02 Qershor është konfirmuar.",
        type: "RESERVATION_CONFIRMED", isRead: false,
      },
      {
        userId: customer1.id, title: "Ofertë speciale!",
        message: "Përdorni kodin SUMMER20 për 20% zbritje tek Glamora Beauty Center.",
        type: "PROMOTION", isRead: false,
      },
      {
        userId: customer2.id, title: "Rezervimi juaj pret konfirmim",
        message: "Rezervimi juaj për Prerje & Stilim është në pritje të konfirmimit.",
        type: "RESERVATION_REMINDER", isRead: false,
      },
    ],
    skipDuplicates: false,
  });

  console.log("✓ Notifications created");

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
