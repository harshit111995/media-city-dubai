import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Media Metrics Glossary | Media City Dubai',
    description: 'A comprehensive appendix of key metrics across General Media, Paid Media, and Programmatic Media — with clear definitions for every professional.',
};

const sections = [
    {
        id: 'general-media',
        title: 'General Media',
        color: '#1e40af',
        bg: '#eff6ff',
        border: '#bfdbfe',
        description: 'Foundational metrics used across traditional, digital, and hybrid media planning and measurement.',
        metrics: [
            { term: 'Reach', definition: 'The total number of unique people or households exposed to a media message at least once within a defined time period.' },
            { term: 'Frequency', definition: 'The average number of times a unique person or household is exposed to a media message within a given campaign period.' },
            { term: 'Gross Rating Points (GRP)', definition: 'A measure of total campaign exposure equal to Reach (%) multiplied by Frequency. One GRP equals 1% of the target audience reached once.' },
            { term: 'Target Rating Points (TRP)', definition: 'Like GRP but measured only against a specific defined target audience rather than the total population.' },
            { term: 'Impressions', definition: 'The total number of times a piece of content or advertisement is displayed, regardless of whether it is clicked or engaged with.' },
            { term: 'Share of Voice (SOV)', definition: 'The percentage of total advertising exposure or spend a brand holds in a given category compared to all competitors.' },
            { term: 'Net Reach', definition: 'The total number of unique individuals exposed to a campaign after deducting duplicated audiences across multiple channels or placements.' },
            { term: 'Audience Composition', definition: 'The demographic or psychographic breakdown of the audience who are exposed to an ad, expressed as a percentage of the total audience.' },
            { term: 'Affinity Index', definition: 'A ratio comparing the target audience\'s consumption of media versus the general population. An index above 100 indicates above-average affinity.' },
            { term: 'Effective Reach', definition: 'The number of unique people reached at a minimum effective frequency threshold (typically 3+ exposures) within a campaign period.' },
            { term: 'Effective Frequency', definition: 'The minimum number of times an audience member must be exposed to a message before taking action or forming a brand memory.' },
            { term: 'Coverage', definition: 'The percentage of the total target population that is exposed to a given media vehicle at least once throughout a campaign.' },
            { term: 'Duplication', definition: 'The overlap in audience between two or more media vehicles or placements. High duplication reduces incremental net reach.' },
            { term: 'Opportunity to See (OTS)', definition: 'The average number of times a member of the target audience has a chance to see a media message. Mathematically equivalent to Frequency.' },
            { term: 'Cost Per Thousand (CPM)', definition: 'The cost an advertiser pays to serve 1,000 impressions of an ad. A fundamental pricing model across both traditional and digital channels.' },
            { term: 'Media Mix', definition: 'The combination and proportion of different media channels (e.g., TV, radio, digital, OOH) used within a campaign strategy.' },
            { term: 'Flighting', definition: 'A scheduling strategy where advertising runs in alternating periods of activity and inactivity to manage budget or maintain audience freshness.' },
            { term: 'Pulsing', definition: 'A media scheduling strategy combining continuous low-level spending with periodic bursts of heavier activity, often used for seasonal products.' },
            { term: 'Daypart', definition: 'A specific time segment within a broadcast day used to target audiences based on their viewing or listening habits (e.g., prime time, morning drive).' },
            { term: 'Recency Planning', definition: 'A strategy that prioritises reaching consumers as close as possible to their purchase decision moment, rather than maximising total frequency.' },
        ]
    },
    {
        id: 'paid-media',
        title: 'Paid Media',
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        description: 'Performance and efficiency metrics used in search, social, display, and other paid advertising channels.',
        metrics: [
            { term: 'Click-Through Rate (CTR)', definition: 'The percentage of impressions that result in a click. Calculated as (Clicks ÷ Impressions) × 100. Indicates ad relevance and creative effectiveness.' },
            { term: 'Cost Per Click (CPC)', definition: 'The average amount paid each time a user clicks on an advertisement. Calculated as Total Spend ÷ Total Clicks.' },
            { term: 'Cost Per Acquisition (CPA)', definition: 'The total cost to acquire one customer or conversion. Calculated as Total Spend ÷ Total Conversions. A key efficiency metric for performance campaigns.' },
            { term: 'Conversion Rate (CR)', definition: 'The percentage of clicks or visits that result in a desired action (purchase, signup, download). Calculated as (Conversions ÷ Clicks) × 100.' },
            { term: 'Return on Ad Spend (ROAS)', definition: 'Revenue generated for every unit of currency spent on advertising. Calculated as Revenue ÷ Ad Spend. A direct measure of advertising profitability.' },
            { term: 'Return on Investment (ROI)', definition: 'Net profit generated from advertising relative to the money invested. Calculated as ((Revenue - Cost) ÷ Cost) × 100.' },
            { term: 'Quality Score', definition: 'A Google Ads metric rating the relevance and quality of keywords, ads, and landing pages. Higher quality scores reduce CPCs and improve ad positions.' },
            { term: 'Ad Rank', definition: 'A value that determines where ads appear in search results, based on bid, Quality Score, expected impact of ad extensions, and the search context.' },
            { term: 'Impression Share', definition: 'The percentage of total impressions an ad received compared to the total number it was eligible to receive. Indicates competitive presence in a market.' },
            { term: 'Cost Per Lead (CPL)', definition: 'The total cost to generate one qualified lead through an advertising campaign. A core metric for B2B and lead-generation campaigns.' },
            { term: 'Engagement Rate', definition: 'The percentage of people who engaged (liked, commented, shared, or saved) with a social ad out of the total people who saw it.' },
            { term: 'Frequency Cap', definition: 'A limit placed on how many times a single user sees a specific ad within a defined period, preventing overexposure and audience fatigue.' },
            { term: 'Attribution Model', definition: 'The rule or set of rules that determines how credit for a conversion is distributed across touchpoints in the customer journey (e.g., last click, first click, linear).' },
            { term: 'View-Through Conversion', definition: 'A conversion that occurs after a user has seen an ad (without clicking) and later completes a desired action within a defined lookback window.' },
            { term: 'Cost Per View (CPV)', definition: 'The average cost paid each time a user watches or engages with a video ad. Commonly used for YouTube and video advertising campaigns.' },
            { term: 'Video Completion Rate (VCR)', definition: 'The percentage of video ad views that play through to their end. A high VCR indicates engaging creative content and relevant audience targeting.' },
            { term: 'Average Position', definition: 'The typical ranking of an ad in a search results page or on a publisher\'s website, indicating competitive standing and bid effectiveness.' },
            { term: 'Bounce Rate', definition: 'The percentage of users who land on a page from an ad and leave without taking any further action or visiting another page on the site.' },
            { term: 'Customer Lifetime Value (LTV)', definition: 'The total revenue a business expects from a single customer throughout the entirety of their relationship. Informs maximum allowable CPA targets.' },
            { term: 'Ad Frequency', definition: 'The average number of times a specific individual is served the same paid ad within a set campaign timeframe, often managed via frequency caps.' },
        ]
    },
    {
        id: 'programmatic-media',
        title: 'Programmatic Media',
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
        description: 'Technical and performance metrics specific to automated, data-driven media buying across DOOH, CTV, Display, Video, Audio, and In-game channels.',
        metrics: [
            { term: 'CPM (Cost Per Mille)', definition: 'The price paid per 1,000 ad impressions. The primary pricing model in programmatic buying, varying by channel, inventory quality, and audience targeting.' },
            { term: 'Win Rate', definition: 'The percentage of auction bids that are successful out of total bids submitted. A low win rate may signal underpricing or excessive targeting restrictions.' },
            { term: 'Bid Price', definition: 'The maximum amount an advertiser is willing to pay for a single ad impression in a real-time auction (RTB). Set manually or algorithmically by a DSP.' },
            { term: 'Floor Price', definition: 'The minimum price a publisher sets for inventory in a programmatic auction. Bids below the floor price are rejected by the SSP.' },
            { term: 'Fill Rate', definition: 'The percentage of available ad requests that are successfully filled with a paid ad. Low fill rates may indicate a mismatch between targeting and available inventory.' },
            { term: 'Viewability Rate', definition: 'The percentage of ad impressions deemed "viewable" by IAB standards — at least 50% of the ad must be on-screen for at least 1 second (2 seconds for video).' },
            { term: 'Viewable CPM (vCPM)', definition: 'The effective CPM calculated only on viewable impressions, excluding non-viewable inventory. A more accurate efficiency metric than standard CPM.' },
            { term: 'Invalid Traffic (IVT)', definition: 'Ad impressions generated by bots, scrapers, or other non-human sources. Divided into General IVT (GIVT) and Sophisticated IVT (SIVT). A key brand safety concern.' },
            { term: 'Brand Safety', definition: 'Measures and tools ensuring ads do not appear alongside inappropriate or harmful content that could damage a brand\'s reputation.' },
            { term: 'Deal ID', definition: 'A unique identifier for a private marketplace (PMP) deal between a publisher and specific buyer, allowing preferential access to premium inventory outside the open exchange.' },
            { term: 'Private Marketplace (PMP)', definition: 'An invitation-only programmatic auction where publishers offer premium inventory to a select group of buyers under negotiated terms, versus the open exchange.' },
            { term: 'Programmatic Guaranteed (PG)', definition: 'A direct deal between a buyer and publisher executed programmatically, where inventory volume, price, and audiences are fixed in advance — combining automation with certainty.' },
            { term: 'Open RTB', definition: 'The open-exchange real-time bidding protocol where any eligible buyer can compete for publisher inventory in millisecond auctions managed by an SSP.' },
            { term: 'Demand-Side Platform (DSP)', definition: 'A technology platform used by advertisers and agencies to purchase digital ad inventory across multiple exchanges and publishers through a single interface.' },
            { term: 'Supply-Side Platform (SSP)', definition: 'A technology platform used by publishers to manage and sell their ad inventory programmatically to multiple buyers simultaneously, maximising yield.' },
            { term: 'Data Management Platform (DMP)', definition: 'A centralised system that collects, organises, and activates first-, second-, and third-party audience data to improve targeting precision in programmatic campaigns.' },
            { term: 'Audience Segment', definition: 'A defined group of users sharing common characteristics or behaviours (e.g., in-market auto buyers) used to target ad delivery in programmatic environments.' },
            { term: 'Cookie Matching / Syncing', definition: 'The process of matching user identifiers between different platforms (e.g., a DSP and a DMP) to enable consistent cross-platform audience targeting.' },
            { term: 'Blended CPM', definition: 'The weighted average CPM across all channels and placements in a multi-channel programmatic campaign. Used to measure overall campaign cost efficiency.' },
            { term: 'Estimated Reach', definition: 'The projected number of unique users a programmatic campaign will reach based on targeting parameters, inventory availability, and historical data models.' },
            { term: 'Frequency in Programmatic', definition: 'The average number of times a unique device or cookie-identified user is exposed to an ad. Managed via frequency caps at the DSP or campaign level.' },
            { term: 'Connected TV (CTV) Rate', definition: 'The CPM or engagement benchmarks specific to ads delivered on internet-connected television devices, typically commanding premium pricing due to high viewability and lean-back attention.' },
            { term: 'Completion Rate (Video)', definition: 'The percentage of video ad impressions where the user watched the content to 100% completion. High completion rates indicate strong creative relevance and optimal placement.' },
            { term: 'Audio Completion Rate', definition: 'The percentage of audio ad impressions (podcast, streaming music) where the listener heard the full ad. High rates indicate targeted, relevant audio placements.' },
            { term: 'DOOH Audience Delivery', definition: 'The estimated number of people exposed to a Digital Out-of-Home (DOOH) ad, measured via mobile location data, facial detection, or footfall analytics to validate campaign reach.' },
        ]
    }
];

export default function MediaMetricsPage() {
    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Hero Header */}
            <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '4rem 1.5rem 3rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>📊</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Media City Dubai · Reference Appendix</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 1rem', lineHeight: 1.1 }}>
                        Media Metrics Glossary
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '640px', lineHeight: 1.7, margin: '0 0 2rem' }}>
                        A comprehensive reference of all key metrics across General Media, Paid Media, and Programmatic Media — with plain-language definitions for every practitioner.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {sections.map(s => (
                            <a key={s.id} href={`#${s.id}`} style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', transition: 'background 0.2s' }}>
                                {s.title} ({s.metrics.length})
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table of counts */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                    {sections.map(s => (
                        <div key={s.id} style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: s.color }}>{s.metrics.length}</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{s.title}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '0.25rem' }}>metrics defined</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sections */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>
                {sections.map((section, sIdx) => (
                    <div key={section.id} id={section.id} style={{ marginBottom: '4rem' }}>
                        {/* Section Header */}
                        <div style={{ borderLeft: `4px solid ${section.color}`, paddingLeft: '1.25rem', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: section.color, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.35rem' }}>
                                Section {sIdx + 1} of {sections.length}
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>{section.title}</h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>{section.description}</p>
                        </div>

                        {/* Metrics Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                            {section.metrics.map((metric) => (
                                <div key={metric.term} style={{ backgroundColor: 'white', border: `1px solid ${section.border}`, borderRadius: '12px', padding: '1.25rem 1.5rem', transition: 'box-shadow 0.2s' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: section.color, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: section.color, display: 'inline-block', flexShrink: 0 }}></span>
                                        {metric.term}
                                    </div>
                                    <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.65 }}>{metric.definition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Footer CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '20px', padding: '3rem', textAlign: 'center', color: 'white' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>Ready to apply these metrics?</h3>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 2rem', lineHeight: 1.6 }}>
                        Use our free Programmatic Media Planner to forecast impressions, reach, CPA, and more across 9 digital channels.
                    </p>
                    <Link href="/media-planner" style={{ display: 'inline-block', backgroundColor: '#dc2626', color: 'white', padding: '0.875rem 2.5rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', letterSpacing: '0.02em' }}>
                        Open Media Planner →
                    </Link>
                </div>
            </div>
        </div>
    );
}
