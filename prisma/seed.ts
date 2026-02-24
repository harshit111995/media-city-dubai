
import { PrismaClient } from '@prisma/client';
import { forumTopics } from '../src/data/forum';
import { events } from '../src/data/events';
import { tools } from '../src/data/tools';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Seed Posts (Forum Topics)
    for (const topic of forumTopics) {
        const existingPost = await prisma.post.findUnique({
            where: { slug: topic.slug },
        });

        if (!existingPost) {
            await prisma.post.create({
                data: {
                    slug: topic.slug,
                    title: topic.title,
                    content: topic.content,
                    author: topic.author,
                    category: topic.category,
                    publishedAt: new Date(topic.date),
                    replies: topic.replies,
                    views: topic.views,
                    headerImage: topic.headerImage,
                    thumbnail: topic.thumbnail,
                    // Default values for new fields if not present in source
                    metaTitle: topic.title,
                    metaDescription: topic.content.substring(0, 160),
                    shortDescription: topic.content.substring(0, 100) + '...',
                },
            });
            console.log(`Created post: ${topic.title}`);
        }
    }

    // Seed Events
    for (const event of events) {
        const existingEvent = await prisma.event.findUnique({
            where: { slug: event.slug },
        });

        if (!existingEvent) {
            await prisma.event.create({
                data: {
                    slug: event.slug,
                    title: event.title,
                    date: new Date(event.date),
                    location: event.location,
                    category: event.category,
                    description: event.description,
                    organizer: event.organizer,
                    imageUrl: event.imageUrl,
                    // Default values
                    metaTitle: event.title,
                    metaDescription: event.description,
                    shortDescription: event.description,
                },
            });
            console.log(`Created event: ${event.title}`);
        }
    }

    // Seed Tools
    for (const tool of tools) {
        const existingTool = await prisma.tool.findUnique({
            where: { slug: tool.slug },
        });

        if (!existingTool) {
            await prisma.tool.create({
                data: {
                    slug: tool.slug,
                    title: tool.name,
                    category: tool.category,
                    description: tool.description,
                    imageUrl: tool.logo || '',
                    url: tool.website,
                },
            });
            console.log(`Created tool: ${tool.name}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
