'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadFileToS3 } from '@/lib/s3';



// Post Actions (Forum, Reviews, News)
export async function createPost(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const author = formData.get('author') as string;
        const category = formData.get('category') as string;
        const tags = formData.get('tags') as string;
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const shortDescription = formData.get('shortDescription') as string;

        const headerImageFile = formData.get('headerImageFile');
        let headerImage = formData.get('headerImage') as string || '';

        if (headerImageFile instanceof File && headerImageFile.size > 0) {
            try {
                headerImage = await uploadFileToS3(headerImageFile);
            } catch (error) {
                console.error("Upload failed", error);
            }
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
                publishedAt: new Date(publishedAtStr || Date.now()),
            },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/forum');
        revalidatePath(`/forum/topic/${slug}`);
        revalidatePath(`/forum/category/${category}`);
        redirect('/admin');
    } catch (error) {
        console.error("Failed to create post:", error);
        throw new Error("Failed to create post. Please try again.");
    }
}

export async function updatePost(id: string, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const author = formData.get('author') as string;
        const category = formData.get('category') as string;
        const tags = formData.get('tags') as string;
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const shortDescription = formData.get('shortDescription') as string;

        const headerImageFile = formData.get('headerImageFile');
        let headerImage = formData.get('headerImage') as string || undefined;

        if (headerImageFile instanceof File && headerImageFile.size > 0) {
            try {
                headerImage = await uploadFileToS3(headerImageFile);
            } catch (error) {
                console.error("Upload failed", error);
            }
        }

        const publishedAtStr = formData.get('publishedAt') as string;

        const updatedPost = await prisma.post.update({
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

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/forum');
        revalidatePath(`/forum/topic/${updatedPost.slug}`);
        revalidatePath(`/forum/category/${updatedPost.category}`);
        redirect('/admin');
    } catch (error) {
        console.error("Failed to update post:", error);
        throw new Error("Failed to update post. Please try again.");
    }
}

export async function deletePost(id: string) {
    try {
        const post = await prisma.post.delete({
            where: { id },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/forum');
        revalidatePath(`/forum/category/${post.category}`);
    } catch (error) {
        console.error("Failed to delete post:", error);
        throw new Error("Failed to delete post.");
    }
}

// Event Actions
export async function createEvent(formData: FormData) {
    try {
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

        const registrationUrl = formData.get('registrationUrl') as string;
        const headerImageFile = formData.get('headerImageFile');
        let headerImage = formData.get('headerImage') as string || '';

        if (headerImageFile instanceof File && headerImageFile.size > 0) {
            try {
                headerImage = await uploadFileToS3(headerImageFile);
            } catch (error) {
                console.error("Upload failed", error);
            }
        }

        await (prisma.event as any).create({
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
                registrationUrl,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/events');
        revalidatePath(`/events/${slug}`);
        redirect('/admin');
    } catch (error) {
        console.error("Failed to create event:", error);
        throw new Error("Failed to create event. Please try again.");
    }
}

export async function updateEvent(id: string, formData: FormData) {
    try {
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

        const registrationUrl = formData.get('registrationUrl') as string;
        const headerImageFile = formData.get('headerImageFile');
        let headerImage = formData.get('headerImage') as string || undefined;

        if (headerImageFile instanceof File && headerImageFile.size > 0) {
            try {
                headerImage = await uploadFileToS3(headerImageFile);
            } catch (error) {
                console.error("Upload failed", error);
            }
        }

        const updatedEvent = await (prisma.event as any).update({
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
                registrationUrl,
                ...(headerImage && { headerImage }),
            },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/events');
        revalidatePath(`/events/${updatedEvent.id}`);
        revalidatePath(`/events/${updatedEvent.slug}`);
        redirect('/admin');
    } catch (error) {
        console.error("Failed to update event:", error);
        throw new Error("Failed to update event. Please try again.");
    }
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({
            where: { id },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/events');
    } catch (error) {
        console.error("Failed to delete event:", error);
        throw new Error("Failed to delete event.");
    }
}

// Tool Actions
export async function createTool(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const url = formData.get('url') as string;
        const category = formData.get('category') as string; 
        const pricing = formData.get('pricing') as string;
        const featuresRaw = formData.get('features') as string;
        const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

        const imageUrlFile = formData.get('imageUrlFile');
        let imageUrl = formData.get('imageUrl') as string || '';

        if (imageUrlFile instanceof File && imageUrlFile.size > 0) {
            try {
                imageUrl = await uploadFileToS3(imageUrlFile);
            } catch (error) {
                console.error("Upload failed", error);
            }
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

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/tools');
        revalidatePath(`/tools/${slug}`);
        revalidatePath(`/tools/category/${category}`);
        redirect('/admin');
    } catch (error) {
        console.error("Failed to create tool:", error);
        throw new Error("Failed to create tool. Please check your inputs and try again.");
    }
}

export async function updateTool(id: string, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const url = formData.get('url') as string;
        const category = formData.get('category') as string;
        const pricing = formData.get('pricing') as string;
        const featuresRaw = formData.get('features') as string;
        const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

        const imageUrlFile = formData.get('imageUrlFile');
        let imageUrl = formData.get('imageUrl') as string || undefined;

        if (imageUrlFile instanceof File && imageUrlFile.size > 0) {
            try {
                imageUrl = await uploadFileToS3(imageUrlFile);
            } catch (error) {
                console.error("Upload failed", error);
            }
        }

        const updatedTool = await prisma.tool.update({
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

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/tools');
        revalidatePath(`/tools/${updatedTool.slug}`);
        revalidatePath(`/tools/category/${updatedTool.category}`);
        redirect('/admin');
    } catch (error) {
        console.error("Failed to update tool:", error);
        throw new Error("Failed to update tool. Please check your inputs and try again.");
    }
}

export async function deleteTool(id: string) {
    try {
        const tool = await prisma.tool.delete({
            where: { id },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/tools');
        revalidatePath(`/tools/category/${tool.category}`);
    } catch (error) {
        console.error("Failed to delete tool:", error);
        throw new Error("Failed to delete tool.");
    }
}

// KPI Actions
export async function createKpi(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const formula = formData.get('formula') as string;
        const fields = formData.get('fields') as string;
        const category = formData.get('category') as string;
        const seoTitle = formData.get('seoTitle') as string;
        const seoDescription = formData.get('seoDescription') as string;
        const example = formData.get('example') as string;

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
                example,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/kpi');
        redirect('/admin');
    } catch (error) {
        console.error("Failed to create KPI:", error);
        throw new Error("Failed to create KPI calculator. Ensure JSON fields are valid.");
    }
}

export async function updateKpi(id: string, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const formula = formData.get('formula') as string;
        const fields = formData.get('fields') as string;
        const category = formData.get('category') as string;
        const seoTitle = formData.get('seoTitle') as string;
        const seoDescription = formData.get('seoDescription') as string;
        const example = formData.get('example') as string;

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
                example,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/kpi');
        redirect('/admin');
    } catch (error) {
        console.error("Failed to update KPI:", error);
        throw new Error("Failed to update KPI calculator. Ensure JSON fields are valid.");
    }
}

export async function deleteKpi(id: string) {
    await prisma.kpi.delete({
        where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/kpi');
}
