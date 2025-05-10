import { PrismaClient } from "./generated";

// import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
	const members = await prisma.member.findMany();
	console.log({ members });
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
