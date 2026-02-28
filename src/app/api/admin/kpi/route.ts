import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const kpis = await prisma.kpi.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(kpis);
    } catch (error) {
        console.error('Failed to fetch KPIs:', error);
        return NextResponse.json({ error: 'Failed to fetch KPIs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.slug || !body.formula || !body.fields || !body.category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const kpi = await prisma.kpi.create({
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

        return NextResponse.json(kpi, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create KPI:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A KPI with this slug already exists.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create KPI' }, { status: 500 });
    }
}
