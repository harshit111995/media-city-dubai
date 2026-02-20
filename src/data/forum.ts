export interface ForumTopic {
    id: string;
    slug: string;
    title: string;
    category: 'General Discussion' | 'Career Advice' | 'Tech Support' | 'Industry News';
    author: string;
    date: string;
    replies: number;
    views: number;
    content: string;
    headerImage?: string; // Optional header image
    thumbnail?: string;   // Optional thumbnail
}

export const forumTopics: ForumTopic[] = [
    {
        id: '1',
        slug: 'future-of-programmatic-dubai',
        title: 'The Future of Programmatic Advertising in Dubai',
        category: 'Industry News',
        author: 'Sarah Jenkins',
        date: '2026-02-08',
        replies: 12,
        views: 345,
        content: 'With the recent regulations on data privacy, how do you see the programmatic landscape evolving in the UAE? Are we moving fast enough towards cookieless solutions?',
        headerImage: '/images/forum-minimalist.png',
        thumbnail: '/images/forum-minimalist.png'
    },
    {
        id: '2',
        slug: 'best-agencies-for-juniors',
        title: 'Best creative agencies for junior copywriters?',
        category: 'Career Advice',
        author: 'Ahmed Al-Farsi',
        date: '2026-02-07',
        replies: 8,
        views: 210,
        content: 'I am a recent graduate looking for my first role. Can anyone recommend agencies with good mentorship programs?',
        headerImage: '/images/hero-minimalist.png',
        thumbnail: '/images/hero-minimalist.png'
    },
    {
        id: '3',
        slug: 'ga4-setup-issues',
        title: 'Issues with GA4 custom dimensions',
        category: 'Tech Support',
        author: 'Mike Ross',
        date: '2026-02-09',
        replies: 3,
        views: 56,
        content: 'Has anyone experienced data discrepancies when setting up custom dimensions for ecommerce events? My purchase event is firing but parameters are missing.',
        headerImage: '/images/events-minimalist.png',
        thumbnail: '/images/events-minimalist.png'
    },
    {
        id: '4',
        slug: 'dubai-lynx-meetup',
        title: 'Anyone going to Dubai Lynx next month?',
        category: 'General Discussion',
        author: 'Lisa Chen',
        date: '2026-02-05',
        replies: 25,
        views: 670,
        content: 'Let\'s organize a meetup for the community members attending the festival. Who is in?',
        headerImage: '/images/forum-minimalist.png',
        thumbnail: '/images/forum-minimalist.png'
    }
];
