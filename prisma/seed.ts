import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const isProduction = process.env.NODE_ENV === "production";

async function main() {
  console.log(`Seeding database (${isProduction ? "production" : "development"} mode)...`);

  // Production admin - uses environment variables
  const adminEmail = process.env.ADMIN_EMAIL || "admin@zimbabwe.gov.zw";
  const adminPasswordRaw = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "System Administrator";

  if (isProduction && !process.env.ADMIN_PASSWORD) {
    console.warn("WARNING: Using default admin password in production. Set ADMIN_PASSWORD env var!");
  }

  const adminPassword = await bcrypt.hash(adminPasswordRaw, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      name: adminName,
    },
    create: {
      email: adminEmail,
      name: adminName,
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created/updated admin user: ${admin.email}`);

  // Development-only test accounts
  if (!isProduction) {
    // Create immigration officer
    const immigrationPassword = await bcrypt.hash("Immigration@123", 12);
    const immigration = await prisma.user.upsert({
      where: { email: "officer@immigration.gov.zw" },
      update: {},
      create: {
        email: "officer@immigration.gov.zw",
        name: "Immigration Officer",
        password: immigrationPassword,
        role: "IMMIGRATION",
      },
    });
    console.log(`Created immigration user: ${immigration.email}`);

    // Create government official
    const govPassword = await bcrypt.hash("Government@123", 12);
    const government = await prisma.user.upsert({
      where: { email: "official@government.gov.zw" },
      update: {},
      create: {
        email: "official@government.gov.zw",
        name: "Government Official",
        password: govPassword,
        role: "GOVERNMENT",
      },
    });
    console.log(`Created government user: ${government.email}`);

    // Create ZIMRA officer
    const zimraPassword = await bcrypt.hash("Zimra@123", 12);
    const zimra = await prisma.user.upsert({
      where: { email: "officer@zimra.gov.zw" },
      update: {},
      create: {
        email: "officer@zimra.gov.zw",
        name: "ZIMRA Officer",
        password: zimraPassword,
        role: "ZIMRA",
      },
    });
    console.log(`Created ZIMRA user: ${zimra.email}`);

    // Create sample user (regular user who submits trips)
    const userPassword = await bcrypt.hash("User@123", 12);
    const user = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        name: "John Smith",
        password: userPassword,
        role: "USER",
      },
    });
    console.log(`Created user: ${user.email}`);
  }

  // Create border posts
  const borderPosts = [
    { name: "Robert Gabriel Mugabe International Airport", code: "HRE", type: "AIR", location: "Harare" },
    { name: "Victoria Falls International Airport", code: "VFA", type: "AIR", location: "Victoria Falls" },
    { name: "Joshua Mqabuko Nkomo International Airport", code: "BUQ", type: "AIR", location: "Bulawayo" },
    { name: "Beitbridge Border Post", code: "BTB", type: "LAND", location: "Beitbridge" },
    { name: "Victoria Falls Border Post", code: "VFB", type: "LAND", location: "Victoria Falls" },
    { name: "Chirundu Border Post", code: "CHR", type: "LAND", location: "Chirundu" },
    { name: "Plumtree Border Post", code: "PLT", type: "LAND", location: "Plumtree" },
    { name: "Forbes Border Post", code: "FRB", type: "LAND", location: "Mutare" },
    { name: "Kazungula Border Post", code: "KZG", type: "LAND", location: "Kazungula" },
    { name: "Nyamapanda Border Post", code: "NYM", type: "LAND", location: "Nyamapanda" },
  ];

  for (const post of borderPosts) {
    await prisma.borderPost.upsert({
      where: { code: post.code },
      update: {},
      create: post,
    });
    console.log(`Created border post: ${post.name}`);
  }

  console.log("\nSeeding completed!");

  if (isProduction) {
    console.log("\nProduction admin created:");
    console.log(`- Admin: ${adminEmail}`);
  } else {
    console.log("\nTest Accounts (development only):");
    console.log("- Admin: admin@zimbabwe.gov.zw / Admin@123");
    console.log("- Immigration: officer@immigration.gov.zw / Immigration@123");
    console.log("- Government: official@government.gov.zw / Government@123");
    console.log("- ZIMRA: officer@zimra.gov.zw / Zimra@123");
    console.log("- User: user@example.com / User@123");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
