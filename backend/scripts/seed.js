import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    console.log("🌱 Seeding users...");

    const hashedPassword = await bcrypt.hash("Password@123", 10);

    const users = [
        {
            staffId: "AD-2069",
            fullName: "Deepak Yadav",
            email: "admin@adube.com",
            phone: "7217857586",
            password: hashedPassword
        },
        {
            staffId: "AD-2001",
            fullName: "Amit Dubey",
            email: "adubeb12@gmail.com",
            phone: "9711997276",
            password: hashedPassword
        },
        {
            staffId: "AD-2020",
            fullName: "Harshit Singh",
            email: "harshit@adube.com",
            phone: " 8796054184",
            password: hashedPassword
        }
    ];

    for (const user of users) {

        const exists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: user.email },
                    { staffId: user.staffId }
                ]
            }
        });

        if (exists) {
            console.log(`⚠️ ${user.staffId} already exists.`);
            continue;
        }

        await prisma.user.create({
            data: user
        });

        console.log(`✅ ${user.staffId} created.`);
    }

    console.log("🎉 Database seeding completed.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });