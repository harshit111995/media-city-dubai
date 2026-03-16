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
            { term: 'Universe', definition: 'The total defined population from which a media audience is drawn. Serves as the denominator for calculating all reach and rating metrics.' },
            { term: 'Rating', definition: 'The percentage of the total potential audience (universe) exposed to a specific media vehicle at a given time. A single rating point equals 1% of the universe.' },
            { term: 'Average Minute Audience (AMA)', definition: 'The average number of individuals tuned in to a broadcast at any given minute within a defined time period. A standard TV and radio planning metric.' },
            { term: 'Share of Audience', definition: 'The percentage of the audience actively consuming media at a specific time who are tuned to a particular channel or station, versus all active viewers or listeners.' },
            { term: 'Index Number', definition: 'A figure comparing a target audience\'s media consumption behaviour to that of the total population, where 100 represents parity. Numbers above 100 show over-indexing.' },
            { term: 'Cost Per Point (CPP)', definition: 'The cost to achieve one GRP or TRP within a target audience. Calculated as Total Spend ÷ Total GRPs or TRPs. Used to compare relative efficiency across channels.' },
            { term: 'Media Weight', definition: 'The total volume of advertising activity behind a campaign, typically expressed in GRPs, impressions, or total spend across a defined period.' },
            { term: 'Continuity', definition: 'A media scheduling approach where advertising runs consistently and evenly throughout the entire campaign period without breaks or bursts.' },
            { term: 'Wear-out', definition: 'The point at which repeated exposure to the same ad causes audience engagement and effectiveness to decline due to familiarity or annoyance.' },
            { term: 'Reach Curve', definition: 'A graph illustrating the relationship between the number of ad impressions delivered and the cumulative unique audience reached. Reach growth typically decelerates as frequency increases.' },
            { term: 'Synergy Effect', definition: 'The incremental audience lift achieved when two or more media channels are used together, producing a combined result greater than the sum of each individual channel.' },
            { term: 'Gross Impressions', definition: 'The total number of advertising exposures across all placements and vehicles in a campaign, including duplicated contacts. Equal to GRPs multiplied by the universe.' },
            { term: 'Pass-Along Readership', definition: 'The additional readers of a print publication beyond the primary purchaser. Adds to the total audience figure but with typically lower engagement levels.' },
            { term: 'Circulation', definition: 'The total number of copies of a print publication distributed or sold in a given period. The base for calculating print advertising reach and CPM.' },
            { term: 'Listenership / Viewership', definition: 'The total number of individuals who listen to a radio broadcast or watch a TV programme within a defined period, as measured by ratings panels.' },
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
            { term: 'Search Impression Share', definition: 'The fraction of eligible search impressions that an ad actually received, broken into Lost IS (Budget) and Lost IS (Rank) to diagnose underperformance.' },
            { term: 'Cost Per Install (CPI)', definition: 'The average cost to drive one mobile app installation from a paid campaign. Standard metric in app marketing and mobile user acquisition.' },
            { term: 'Cost Per Engagement (CPE)', definition: 'The average cost for each meaningful interaction (expand, hover, video play) with a rich media or social ad. Used for brand engagement objectives.' },
            { term: 'Cost Per Mille (CPM — Paid)', definition: 'In paid media, the cost to purchase 1,000 ad impressions. Typically used for awareness campaigns on social, display, and video channels.' },
            { term: 'Gross Media Spend', definition: 'The total amount billed to a client for media placements, including agency commission. The "top-line" budget before agency fees are deducted.' },
            { term: 'Net Media Spend', definition: 'The actual amount paid directly to media owners for advertising inventory, after deducting the agency commission or rebate.' },
            { term: 'Agency Commission', definition: 'The percentage fee charged by a media or advertising agency, typically applied to the gross media spend. Commonly ranges from 10–20% depending on market and scope.' },
            { term: 'Share of Spend', definition: 'A brand\'s advertising expenditure as a percentage of total category spend. Often benchmarked against Share of Voice to assess efficiency or over/under-investment.' },
            { term: 'Click Share', definition: 'The fraction of all achievable clicks that an ad actually received in search, indicating the potential for incremental traffic if budget or quality is improved.' },
            { term: 'Absolute Top Impression Share', definition: 'The percentage of the time an ad appeared in the very first position above all other search ads, the highest-visibility placement on the search results page.' },
            { term: 'Social Reach', definition: 'The total number of unique accounts that saw any piece of paid social content at least once within a set reporting period.' },
            { term: 'Social Engagement Rate (ER)', definition: 'Total interactions on a paid social post (likes, comments, shares, saves) divided by impressions or reach, then multiplied by 100. Benchmarks creative resonance.' },
            { term: 'Earned Media Value (EMV)', definition: 'A monetary estimate of the organic exposure a paid campaign generates through shares, re-posts, or word-of-mouth, beyond the directly paid placements.' },
            { term: 'Average Order Value (AOV)', definition: 'The average revenue generated per completed transaction, used alongside ROAS and CPA to evaluate the revenue quality of conversions driven by advertising.' },
            { term: 'Time to Conversion', definition: 'The average duration between a user\'s first exposure to an ad and the completion of a conversion. Informs lookback window settings in attribution models.' },
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
            { term: 'Connected TV (CTV) Rate', definition: 'The CPM or engagement benchmarks specific to ads delivered on internet-connected television devices, typically commanding premium pricing due to high viewability.' },
            { term: 'Completion Rate (Video)', definition: 'The percentage of video ad impressions where the user watched the content to 100% completion. High completion rates indicate strong creative relevance and optimal placement.' },
            { term: 'Audio Completion Rate', definition: 'The percentage of audio ad impressions (podcast, streaming music) where the listener heard the full ad. High rates indicate targeted, relevant audio placements.' },
            { term: 'DOOH Audience Delivery', definition: 'The estimated number of people exposed to a Digital Out-of-Home (DOOH) ad, measured via mobile location data, facial detection, or footfall analytics.' },
            { term: 'Ad Exchange', definition: 'A digital marketplace that connects advertisers (via DSPs) and publishers (via SSPs) to transact programmatic media inventory in real time through automated auctions.' },
            { term: 'Header Bidding', definition: 'An advanced programmatic technique allowing multiple demand sources to bid on a publisher\'s inventory simultaneously before the ad server is called, maximising publisher yield.' },
            { term: 'Bid Shading', definition: 'An algorithm used in first-price auction environments that calculates the optimal bid slightly below the maximum a buyer is willing to pay, reducing overpaying for won impressions.' },
            { term: 'First-Price Auction', definition: 'An auction model in which the winning bidder pays exactly what they bid. Now the dominant model in programmatic buying, replacing the second-price auction.' },
            { term: 'Second-Price Auction', definition: 'A legacy auction model in which the winning bidder pays one cent above the second-highest bid. Largely phased out in favour of first-price auctions by most SSPs.' },
            { term: 'Look-alike Targeting', definition: 'A programmatic audience strategy that identifies and targets new users who share characteristics with an advertiser\'s best existing customers or site visitors.' },
            { term: 'Contextual Targeting', definition: 'Serving ads based on the content of the page a user is reading rather than their personal data or browsing history. Growing in importance post-cookie deprecation.' },
            { term: 'Retargeting / Remarketing', definition: 'The practice of serving ads to users who have previously visited a website, used an app, or shown purchase intent, to re-engage them and drive conversion.' },
            { term: 'Click-Through Conversions', definition: 'Conversions that are directly attributed to a user clicking on a programmatic ad. Distinguished from view-through conversions where only an impression was served.' },
            { term: 'Cost Per Completed View (CPCV)', definition: 'The total media cost divided by the number of video ads watched to full completion. A more rigorous efficiency metric than standard CPV.' },
            { term: 'True View Rate', definition: 'Specific to YouTube TrueView ads — the percentage of users who chose to watch the full ad rather than skipping after the initial 5 seconds.' },
            { term: 'On-Target Percentage (OTP)', definition: 'The proportion of total ad impressions delivered to the intended target audience. High OTP indicates efficient audience fidelity and minimal wasted spend.' },
            { term: 'Addressable TV', definition: 'Serving different ads to different households watching the same TV programme, using set-top box or connected TV data to enable household-level programmatic targeting.' },
            { term: 'Connected TV Completion Rate', definition: 'The percentage of CTV video ads watched to full completion. CTV typically commands near-100% completion rates as ads are often non-skippable.' },
            { term: 'In-Game Advertising CPM', definition: 'The cost per 1,000 impressions delivered within mobile or console gaming environments. In-game placements include banners, interstitials, and intrinsic in-environment ads.' },
            { term: 'Identity Resolution', definition: 'The process of linking multiple signals (device IDs, email hashes, cookies, CRM data) to a single user profile to enable consistent cross-device targeting and measurement.' },
            { term: 'Universal ID (UID)', definition: 'A shared, privacy-compliant user identifier built as an alternative to third-party cookies for enabling audience targeting and measurement in cookieless environments.' },
            { term: 'Consent Management Platform (CMP)', definition: 'A tool that manages user consent for data collection and advertising tracking in compliance with privacy legislation such as GDPR, CCPA, and global data laws.' },
            { term: 'Attention Metrics', definition: 'Emerging measurement standards (e.g., Lumen, Adelaide) that capture active human attention on an ad — combining viewability, eye-tracking, and engagement signals into a composite score.' },
            { term: 'Native CPM', definition: 'The cost per 1,000 impressions for ads that blend seamlessly with editorial content format and style, often achieving higher CTRs and engagement than standard display.' },
        ]
    }
];

export default function MediaMetricsPage() {
    const totalMetrics = sections.reduce((sum, s) => sum + s.metrics.length, 0);

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
                        A comprehensive reference of <strong style={{ color: 'white' }}>{totalMetrics}+ key metrics</strong> across General Media, Paid Media, and Programmatic Media — with plain-language definitions for every practitioner.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {sections.map(s => (
                            <a key={s.id} href={`#${s.id}`} style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
                                {s.title} ({s.metrics.length})
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary counts */}
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
                        <div style={{ borderLeft: `4px solid ${section.color}`, paddingLeft: '1.25rem', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: section.color, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.35rem' }}>
                                Section {sIdx + 1} of {sections.length}
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>{section.title}</h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>{section.description}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                            {section.metrics.map((metric) => (
                                <div key={metric.term} style={{ backgroundColor: 'white', border: `1px solid ${section.border}`, borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
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

                {/* CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '20px', padding: '3rem', textAlign: 'center', color: 'white' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>Ready to apply these metrics?</h3>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 2rem', lineHeight: 1.6 }}>
                        Use our free Programmatic Media Planner to forecast impressions, reach, CPA, and more across 9 digital channels.
                    </p>
                    <Link href="/media-planner" style={{ display: 'inline-block', backgroundColor: '#dc2626', color: 'white', padding: '0.875rem 2.5rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
                        Open Media Planner →
                    </Link>
                </div>
            </div>
        </div>
    );
}
