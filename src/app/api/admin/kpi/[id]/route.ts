import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const kpi = await prisma.kpi.findUnique({
            where: { id },
        });

        if (!kpi) {
            return NextResponse.json({ error: 'KPI not found' }, { status: 404 });
        }

        return NextResponse.json(kpi);
    } catch (error) {
        console.error('Error fetching KPI:', error);
        return NextResponse.json({ error: 'Failed to fetch KPI' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.slug || !body.formula || !body.fields || !body.category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const kpi = await prisma.kpi.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description || '',
                formula: body.formula,
                fields: typeof body.fields === 'string' ? body.fields : JSON.stringify(body.fields),
                category: body.category,
                seoTitle: body.seoTitle,
                seoDescription: body.seoDescription,
            },
        });

        return NextResponse.json(kpi);
    } catch (error: any) {
        console.error('Error updating KPI:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A KPI with this slug already exists.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update KPI' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.kpi.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting KPI:', error);
        return NextResponse.json({ error: 'Failed to delete KPI' }, { status: 500 });
    }
}
