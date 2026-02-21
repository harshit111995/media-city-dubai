import ToolForm from '@/components/admin/ToolForm';

export default function NewToolPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Create New Tool</h1>
            <ToolForm />
        </div>
    );
}
