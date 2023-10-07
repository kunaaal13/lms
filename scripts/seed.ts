const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        {
          name: 'Computer Science',
        },
        {
          name: 'Mathematics',
        },
        {
          name: 'Fitness',
        },
        {
          name: 'Photography',
        },
        {
          name: 'Accounting',
        },
        {
          name: 'Engineering',
        },
        {
          name: 'Filming',
        },
      ],
    })

    console.log('Database seeded')
  } catch (error) {
    console.error('Error while seeding database categories', error)
  } finally {
    await database.$disconnect()
  }
}

main()
