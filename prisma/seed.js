const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
      { name: "Charlie", email: "charlie@example.com" },
    ],
  });

  const allUsers = await prisma.user.findMany();

  for (const user of allUsers) {
    await prisma.playlist.createMany({
      data: [
        { title: `${user.name}'s Chill Vibes`, userId: user.id },
        { title: `${user.name}'s Workout Hits`, userId: user.id },
        { title: `${user.name}'s Jazz Collection`, userId: user.id },
        { title: `${user.name}'s Rock Anthems`, userId: user.id },
        { title: `${user.name}'s Party Mix`, userId: user.id },
      ],
    });
  }

  console.log("Database seeded with users and playlists.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
