import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadFileToS3(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        // ACL: 'public-read', // S3 buckets are private by default now, we'll use the public URL format
    });

    try {
        await s3Client.send(command);
        // Construct the public URL
        // Format: https://BUCKET_NAME.s3.REGION.amazonaws.com/FILENAME
        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload image');
    }
}
