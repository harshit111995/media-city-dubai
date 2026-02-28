'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadFileToS3 } from '@/lib/s3';



// Post Actions (Forum, Reviews, News)
export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const shortDescription = formData.get('shortDescription') as string;

    const headerImageFile = formData.get('headerImage');
    let headerImage = '';

    if (headerImageFile instanceof File && headerImageFile.size > 0) {
        try {
            headerImage = await uploadFileToS3(headerImageFile);
        } catch (error) {
            console.error("Upload failed", error);
        }
    } else if (typeof headerImageFile === 'string') {
        headerImage = headerImageFile;
    }

    const publishedAtStr = formData.get('publishedAt') as string;

    await prisma.post.create({
        data: {
            title,
            slug,
            content,
            author,
            category,
            tags,
            metaTitle,
            metaDescription,
            shortDescription,
            headerImage,
            publishedAt: new Date(publishedAtStr),
        },
    });

    revalidatePath('/admin');
    revalidatePath('/forum');
    redirect('/admin');
}

export async function updatePost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const shortDescription = formData.get('shortDescription') as string;

    const headerImageFile = formData.get('headerImage');
    let headerImage = undefined;

    if (headerImageFile instanceof File && headerImageFile.size > 0) {
        try {
            headerImage = await uploadFileToS3(headerImageFile);
        } catch (error) {
            console.error("Upload failed", error);
        }
    } else if (typeof headerImageFile === 'string' && headerImageFile.startsWith('http')) {
        headerImage = headerImageFile;
    }

    const publishedAtStr = formData.get('publishedAt') as string;

    await prisma.post.update({
        where: { id },
        data: {
            title,
            slug,
            content,
            author,
            category,
            tags,
            metaTitle,
            metaDescription,
            shortDescription,
            ...(headerImage && { headerImage }),
            ...(publishedAtStr && { publishedAt: new Date(publishedAtStr) }),
        },
    });

    revalidatePath('/admin');
    revalidatePath('/forum');
    redirect('/admin');
}

export async function deletePost(id: string) {
    await prisma.post.delete({
        where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/forum');
}

// Event Actions
export async function createEvent(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string; // Conference, Workshop, etc.
    const organizer = formData.get('organizer') as string;
    const dateStr = formData.get('date') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const shortDescription = formData.get('shortDescription') as string;

    const headerImageFile = formData.get('headerImage');
    let headerImage = '';

    if (headerImageFile instanceof File && headerImageFile.size > 0) {
        try {
            headerImage = await uploadFileToS3(headerImageFile);
        } catch (error) {
            console.error("Upload failed", error);
        }
    } else if (typeof headerImageFile === 'string') {
        headerImage = headerImageFile;
    }

    await prisma.event.create({
        data: {
            title,
            slug,
            description,
            location,
            category,
            organizer,
            date: new Date(dateStr),
            metaTitle,
            metaDescription,
            shortDescription,
            headerImage,
        },
    });

    revalidatePath('/admin');
    revalidatePath('/events');
    redirect('/admin');
}

export async function updateEvent(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const organizer = formData.get('organizer') as string;
    const dateStr = formData.get('date') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const shortDescription = formData.get('shortDescription') as string;

    const headerImageFile = formData.get('headerImage');
    let headerImage = undefined;

    if (headerImageFile instanceof File && headerImageFile.size > 0) {
        try {
            headerImage = await uploadFileToS3(headerImageFile);
        } catch (error) {
            console.error("Upload failed", error);
        }
    } else if (typeof headerImageFile === 'string' && headerImageFile.startsWith('http')) {
        headerImage = headerImageFile;
    }

    await prisma.event.update({
        where: { id },
        data: {
            title,
            slug,
            description,
            location,
            category,
            organizer,
            date: new Date(dateStr),
            metaTitle,
            metaDescription,
            shortDescription,
            ...(headerImage && { headerImage }),
        },
    });

    revalidatePath('/admin');
    revalidatePath('/events');
    redirect('/admin');
}

export async function deleteEvent(id: string) {
    await prisma.event.delete({
        where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/events');
}

// Tool Actions
export async function createTool(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const url = formData.get('url') as string;
    const category = formData.get('category') as string; // AI Tools, AdTech, MarTech
    const pricing = formData.get('pricing') as string;
    const featuresRaw = formData.get('features') as string;
    const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

    const imageUrlFile = formData.get('imageUrl');
    let imageUrl = '';

    if (imageUrlFile instanceof File && imageUrlFile.size > 0) {
        try {
            imageUrl = await uploadFileToS3(imageUrlFile);
        } catch (error) {
            console.error("Upload failed", error);
        }
    } else if (typeof imageUrlFile === 'string') {
        imageUrl = imageUrlFile;
    }

    await prisma.tool.create({
        data: {
            title,
            slug,
            description,
            url,
            category,
            imageUrl,
            pricing,
            features,
        },
    });

    revalidatePath('/admin');
    revalidatePath('/tools');
    redirect('/admin');
}

export async function updateTool(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const url = formData.get('url') as string;
    const category = formData.get('category') as string;
    const pricing = formData.get('pricing') as string;
    const featuresRaw = formData.get('features') as string;
    const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

    const imageUrlFile = formData.get('imageUrl');
    let imageUrl = undefined;

    if (imageUrlFile instanceof File && imageUrlFile.size > 0) {
        try {
            imageUrl = await uploadFileToS3(imageUrlFile);
        } catch (error) {
            console.error("Upload failed", error);
        }
    } else if (typeof imageUrlFile === 'string' && imageUrlFile.startsWith('http')) {
        imageUrl = imageUrlFile;
    }

    await prisma.tool.update({
        where: { id },
        data: {
            title,
            slug,
            description,
            url,
            category,
            pricing,
            features,
            ...(imageUrl && { imageUrl }),
        },
    });

    revalidatePath('/admin');
    revalidatePath('/tools');
    redirect('/admin');
}

export async function deleteTool(id: string) {
    await prisma.tool.delete({
        where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/tools');
}

// KPI Actions
export async function createKpi(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const formula = formData.get('formula') as string;
    const fields = formData.get('fields') as string;
    const category = formData.get('category') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;

    await prisma.kpi.create({
        data: {
            title,
            slug,
            description,
            formula,
            fields,
            category,
            seoTitle,
            seoDescription,
        },
    });

    revalidatePath('/admin');
    revalidatePath('/kpi');
    redirect('/admin');
}

export async function updateKpi(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const formula = formData.get('formula') as string;
    const fields = formData.get('fields') as string;
    const category = formData.get('category') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;

    await prisma.kpi.update({
        where: { id },
        data: {
            title,
            slug,
            description,
            formula,
            fields,
            category,
            seoTitle,
            seoDescription,
        },
    });

    revalidatePath('/admin');
    revalidatePath('/kpi');
    redirect('/admin');
}

export async function deleteKpi(id: string) {
    await prisma.kpi.delete({
        where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/kpi');
}
