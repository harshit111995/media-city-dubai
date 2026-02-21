import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ToolForm from '@/components/admin/ToolForm';
import { deleteTool } from '@/app/actions';



export default async function EditToolPage({ params }: { params: { id: string } }) {
    const tool = await prisma.tool.findUnique({
        where: { id: params.id },
    });

    if (!tool) {
        notFound();
    }

    const deleteAction = deleteTool.bind(null, tool.id);

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Tool</h1>
                <form action={deleteAction}>
                    <button type="submit" className="text-red-600 hover:text-red-800 font-medium">
                        Delete Tool
                    </button>
                </form>
            </div>

            <ToolForm tool={tool} />
        </div>
    );
}
