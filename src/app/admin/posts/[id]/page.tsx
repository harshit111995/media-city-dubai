import PostForm from '@/components/admin/PostForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { deletePost } from '@/app/actions';



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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Post</h1>
                <form action={deletePost.bind(null, post.id)}>
                    <button type="submit" className="text-red-600 hover:text-red-800 font-medium">
                        Delete Post
                    </button>
                </form>
            </div>

            <PostForm post={post} />
        </div>
    );
}
