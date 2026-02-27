import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/'], // Hide internal CMS pages from search engines
        },
        sitemap: 'https://mediacitydubai.com/sitemap.xml',
    };
}
