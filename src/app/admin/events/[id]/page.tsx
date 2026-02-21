import EventForm from '@/components/admin/EventForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';



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
