export interface Event {
    id: string;
    slug: string;
    title: string;
    date: string;
    location: string;
    category: 'Conference' | 'Workshop' | 'Networking';
    description: string;
    imageUrl?: string;
    organizer: string;
}

export const events: Event[] = [
    {
        id: '1',
        slug: 'dubai-lynx-2026',
        title: 'Dubai Lynx 2026',
        date: '2026-03-15',
        location: 'Madinat Jumeirah, Dubai',
        category: 'Conference',
        description: 'The region\'s premier festival of creativity, bringing together the best minds in advertising and communications.',
        organizer: 'Ascential'
    },
    {
        id: '2',
        slug: 'step-conference-2026',
        title: 'STEP Conference 2026',
        date: '2026-02-20',
        location: 'Internet City, Dubai',
        category: 'Conference',
        description: 'The leading tech festival for emerging markets, showcasing the best in startups, digital media, and fintech.',
        organizer: 'Step Group'
    },
    {
        id: '3',
        slug: 'media-networking-night',
        title: 'Media Networking Night',
        date: '2026-04-05',
        location: 'Media One Hotel, Dubai',
        category: 'Networking',
        description: 'An exclusive evening for media professionals to connect, share ideas, and explore collaborations.',
        organizer: 'Media City Dubai Community'
    },
    {
        id: '4',
        slug: 'we-are-developers-congress',
        title: 'WeAreDevelopers World Congress',
        date: '2026-06-10',
        location: 'Dubai World Trade Centre',
        category: 'Conference',
        description: 'The world\'s largest developer event is coming to Dubai. Join thousands of developers and tech leaders.',
        organizer: 'WeAreDevelopers'
    },
    {
        id: '5',
        slug: 'adtech-masterclass',
        title: 'Advanced AdTech Masterclass',
        date: '2026-05-12',
        location: 'Knowledge Park, Dubai',
        category: 'Workshop',
        description: 'Deep dive into programmatic advertising, data privacy, and the future of digital marketing.',
        organizer: 'Digital Institute'
    }
];
