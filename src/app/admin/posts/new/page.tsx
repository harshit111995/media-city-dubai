import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            <PostForm />
        </div>
    );
}
