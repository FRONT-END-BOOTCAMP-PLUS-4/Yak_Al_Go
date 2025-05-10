import { PrismaClient } from "@prisma/client";

// import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
	// ... you will write your Prisma Client queries here
	// --- Member -------------------------
	const newMembers = await prisma.member.createMany({
		data: [
			{
				id: "7ae5e5c9-0c28-426f-952f-85bdfdcfc522",
				email: "newlec@newlecture.com",
				username: "newlec",
				password: "111",
				phone: "010-1111-1111",
			},
			{
				id: "e755441d-1979-4617-acd5-531f2f898b22",
				email: "dragon@newlecture.com",
				username: "dragon",
				password: "111",
				phone: "010-2222-3333",
			},
		],
	});
	console.log({ newMembers });
	// const members = await prisma.member.findMany();
	// console.log({ members });

	// --- Role -------------------------
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
