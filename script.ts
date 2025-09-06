import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function main() {

  const sampleUser = {
    firstName: "John",
    lastName: "Doe", 
    email: "john.doe@example.com",
    location: "New York, NY",
    passwordHash: "$2b$12$LQv3c1yqBWVHxkd0LQ4YCOdtcrd/wQMVmXdwfP.rqO2dHZzO.Wy7C", // bcrypt hash of "password123"
    profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    userAddress: "123 Main Street, Apt 4B, New York, NY 10001",
    phone: "+1-555-123-4567",
    jwtToken: "123456",
    refreshToken: "123456"
    // createdAt will be automatically set by Prisma
  }
  const user = await prisma.user.create({
    data: sampleUser,
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })