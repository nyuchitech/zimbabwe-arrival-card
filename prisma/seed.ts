import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@zimbabwe.gov.zw" },
    update: {},
    create: {
      email: "admin@zimbabwe.gov.zw",
      name: "System Administrator",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

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

  // Create sample traveler
  const travelerPassword = await bcrypt.hash("Traveler@123", 12);
  const traveler = await prisma.user.upsert({
    where: { email: "traveler@example.com" },
    update: {},
    create: {
      email: "traveler@example.com",
      name: "John Traveler",
      password: travelerPassword,
      role: "TRAVELER",
    },
  });
  console.log(`Created traveler user: ${traveler.email}`);

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
  console.log("\nTest Accounts:");
  console.log("- Admin: admin@zimbabwe.gov.zw / Admin@123");
  console.log("- Immigration: officer@immigration.gov.zw / Immigration@123");
  console.log("- Government: official@government.gov.zw / Government@123");
  console.log("- Traveler: traveler@example.com / Traveler@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
