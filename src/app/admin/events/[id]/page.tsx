import EventForm from '@/components/admin/EventForm';
import { PrismaClient } from '../../../../generated/prisma';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
    });

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
            <EventForm event={event} />
        </div>
    );
}
