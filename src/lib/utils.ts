export function stripHtml(html: string) {
    if (!html) return '';
    // Strip HTML tags and replace common entities
    const stripped = html.replace(/<[^>]*>?/gm, '');
    return stripped.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

export function truncate(text: string, length: number) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
}
