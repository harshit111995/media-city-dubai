import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- EVENTS ---');
  const events = await prisma.event.findMany({
    select: { id: true, title: true, slug: true, shortDescription: true, description: true }
  });
  events.forEach(e => {
    console.log(`Title: ${e.title}`);
    console.log(`Short Desc Length: ${e.shortDescription?.length || 0}`);
    console.log(`Full Desc Length: ${e.description.length}`);
    console.log('---');
  });

  console.log('--- POSTS ---');
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true, shortDescription: true, content: true }
  });
  posts.forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`Short Desc Length: ${p.shortDescription?.length || 0}`);
    console.log(`Full Content Length: ${p.content.length}`);
    console.log('---');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
