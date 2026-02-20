import PostForm from '@/components/admin/PostForm';
import { PrismaClient } from '../../../../generated/prisma';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            <PostForm post={post} />
        </div>
    );
}
