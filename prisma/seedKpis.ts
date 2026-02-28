import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const kpis = [
    {
        title: "Frequency",
        slug: "frequency",
        description: "Measures average exposures per user. Controls recall vs fatigue.",
        formula: "impressions / reach",
        category: "UNIVERSAL METRICS",
        seoTitle: "Calculate Frequency | Media City Dubai",
        seoDescription: "Easily calculate advertising frequency, the average number of exposures per user.",
        fields: JSON.stringify([
            { name: "impressions", label: "Total Impressions", type: "number" },
            { name: "reach", label: "Total Reach", type: "number" }
        ])
    },
    {
        title: "CPM",
        slug: "cpm",
        description: "Cost per 1,000 impressions. Primary awareness efficiency metric.",
        formula: "(spend / impressions) * 1000",
        category: "UNIVERSAL METRICS",
        seoTitle: "Calculate CPM (Cost Per Mille) | Media City Dubai",
        seoDescription: "Easily calculate CPM and optimize your primary awareness efficiency.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "impressions", label: "Total Impressions", type: "number" }
        ])
    },
    {
        title: "CPC",
        slug: "cpc",
        description: "Cost per website visit. Measures traffic efficiency.",
        formula: "spend / clicks",
        category: "UNIVERSAL METRICS",
        seoTitle: "Calculate CPC (Cost Per Click) | Media City Dubai",
        seoDescription: "Easily calculate CPC to measure your traffic efficiency.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "clicks", label: "Total Clicks", type: "number" }
        ])
    },
    {
        title: "CTR",
        slug: "ctr",
        description: "% of users who clicked. Indicates creative & targeting strength.",
        formula: "(clicks / impressions)",
        category: "UNIVERSAL METRICS",
        seoTitle: "Calculate CTR (Click-Through Rate) | Media City Dubai",
        seoDescription: "Easily calculate CTR to measure your creative and targeting strength.",
        fields: JSON.stringify([
            { name: "clicks", label: "Total Clicks", type: "number" },
            { name: "impressions", label: "Total Impressions", type: "number" }
        ])
    },
    {
        title: "Engagement Rate",
        slug: "engagement-rate",
        description: "% interacting beyond passive viewing. Measures creative depth.",
        formula: "(engagements / impressions)",
        category: "UNIVERSAL METRICS",
        seoTitle: "Calculate Engagement Rate | Media City Dubai",
        seoDescription: "Calculate engagement rate to measure how many users interact with your ads.",
        fields: JSON.stringify([
            { name: "engagements", label: "Total Engagements", type: "number" },
            { name: "impressions", label: "Total Impressions", type: "number" }
        ])
    },
    {
        title: "Viewability Rate",
        slug: "viewability-rate",
        description: "% of ads actually seen on screen. Ensures quality delivery.",
        formula: "(viewable_impressions / measurable_impressions)",
        category: "UNIVERSAL METRICS",
        seoTitle: "Calculate Viewability Rate | Media City Dubai",
        seoDescription: "Calculate viewability rate to ensure quality delivery of your ads.",
        fields: JSON.stringify([
            { name: "viewable_impressions", label: "Viewable Impressions", type: "number" },
            { name: "measurable_impressions", label: "Measurable Impressions", type: "number" }
        ])
    },

    // CTV METRICS
    {
        title: "VCR (Video Completion Rate)",
        slug: "vcr",
        description: "% who finished video after starting. Measures content strength.",
        formula: "(completed_views / video_starts)",
        category: "CTV METRICS",
        seoTitle: "Calculate VCR (Video Completion Rate) | Media City Dubai",
        seoDescription: "Calculate VCR to measure the strength of your video content.",
        fields: JSON.stringify([
            { name: "completed_views", label: "Completed Views", type: "number" },
            { name: "video_starts", label: "Video Starts", type: "number" }
        ])
    },
    {
        title: "VTR (View Through Rate)",
        slug: "vtr",
        description: "% of impressions resulting in full view. Measures true exposure.",
        formula: "(completed_views / impressions)",
        category: "CTV METRICS",
        seoTitle: "Calculate VTR (View Through Rate) | Media City Dubai",
        seoDescription: "Calculate VTR to measure true exposure of your video ads.",
        fields: JSON.stringify([
            { name: "completed_views", label: "Completed Views", type: "number" },
            { name: "impressions", label: "Total Impressions", type: "number" }
        ])
    },
    {
        title: "CPCV",
        slug: "cpcv",
        description: "Cost per full video watch.",
        formula: "spend / completed_views",
        category: "CTV METRICS",
        seoTitle: "Calculate CPCV (Cost Per Completed View) | Media City Dubai",
        seoDescription: "Easily calculate CPCV to determine the cost of a full video completion.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "completed_views", label: "Completed Views", type: "number" }
        ])
    },
    {
        title: "Incremental Lift %",
        slug: "incremental-lift",
        description: "Measures causal impact between exposed and control groups.",
        formula: "(exposed_cvr - control_cvr) / control_cvr",
        category: "CTV METRICS",
        seoTitle: "Calculate Incremental Lift | Media City Dubai",
        seoDescription: "Calculate Incremental Lift percentage to measure true causal impact.",
        fields: JSON.stringify([
            { name: "exposed_cvr", label: "Exposed Conversion Rate", type: "number" },
            { name: "control_cvr", label: "Control Conversion Rate", type: "number" }
        ])
    },

    // DOOH METRICS
    {
        title: "Modelled Impressions",
        slug: "modelled-impressions",
        description: "Estimated viewers based on footfall and visibility.",
        formula: "footfall * visibility_factor",
        category: "DOOH METRICS",
        seoTitle: "Calculate Modelled Impressions (DOOH) | Media City Dubai",
        seoDescription: "Calculate DOOH modelled impressions based on footfall data.",
        fields: JSON.stringify([
            { name: "footfall", label: "Footfall Volume", type: "number" },
            { name: "visibility_factor", label: "Visibility Adjustment Factor", type: "number" }
        ])
    },
    {
        title: "SOV (Share of Voice)",
        slug: "sov",
        description: "Screen dominance.",
        formula: "(your_plays / total_plays)",
        category: "DOOH METRICS",
        seoTitle: "Calculate SOV (Share of Voice) | Media City Dubai",
        seoDescription: "Calculate Share of Voice percentage for screen dominance.",
        fields: JSON.stringify([
            { name: "your_plays", label: "Your Ad Plays", type: "number" },
            { name: "total_plays", label: "Total Screen Plays", type: "number" }
        ])
    },
    {
        title: "Cost per Play",
        slug: "cost-per-play",
        description: "Cost per screen appearance.",
        formula: "spend / ad_plays",
        category: "DOOH METRICS",
        seoTitle: "Calculate Cost per Play (DOOH) | Media City Dubai",
        seoDescription: "Calculate the exact cost per screen appearance on DOOH networks.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "ad_plays", label: "Ad Plays", type: "number" }
        ])
    },

    // AUDIO METRICS
    {
        title: "Audio Completion Rate",
        slug: "audio-completion-rate",
        description: "% fully listening.",
        formula: "(completed_listens / audio_starts)",
        category: "AUDIO METRICS",
        seoTitle: "Calculate Audio Completion Rate | Media City Dubai",
        seoDescription: "Calculate completion rates for streaming audio and podcasts.",
        fields: JSON.stringify([
            { name: "completed_listens", label: "Completed Listens", type: "number" },
            { name: "audio_starts", label: "Audio Starts", type: "number" }
        ])
    },
    {
        title: "CPCL",
        slug: "cpcl",
        description: "Cost per full listen.",
        formula: "spend / completed_listens",
        category: "AUDIO METRICS",
        seoTitle: "Calculate CPCL (Cost Per Completed Listen) | Media City Dubai",
        seoDescription: "Calculate the cost per completed listen for audio ads.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "completed_listens", label: "Completed Listens", type: "number" }
        ])
    },

    // IN-GAME METRICS
    {
        title: "CPI",
        slug: "cpi",
        description: "Cost per app install.",
        formula: "spend / installs",
        category: "IN-GAME METRICS",
        seoTitle: "Calculate CPI (Cost Per Install) | Media City Dubai",
        seoDescription: "Calculate your Cost Per Install (CPI) for mobile games and apps.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "installs", label: "Total Installs", type: "number" }
        ])
    },
    {
        title: "ARPDAU",
        slug: "arpdau",
        description: "Average revenue per daily active user.",
        formula: "revenue / dau",
        category: "IN-GAME METRICS",
        seoTitle: "Calculate ARPDAU | Media City Dubai",
        seoDescription: "Calculate Average Revenue Per Daily Active User.",
        fields: JSON.stringify([
            { name: "revenue", label: "Total Daily Revenue", type: "currency" },
            { name: "dau", label: "Daily Active Users", type: "number" }
        ])
    },

    // PERFORMANCE (LEAD GEN)
    {
        title: "Conversion Rate (CVR)",
        slug: "cvr",
        description: "% visitors converting.",
        formula: "(conversions / clicks)",
        category: "PERFORMANCE",
        seoTitle: "Calculate Conversion Rate (CVR) | Media City Dubai",
        seoDescription: "Calculate your lead generation or ecommerce conversion rate.",
        fields: JSON.stringify([
            { name: "conversions", label: "Total Conversions", type: "number" },
            { name: "clicks", label: "Total Clicks", type: "number" }
        ])
    },
    {
        title: "CPA",
        slug: "cpa",
        description: "Cost per action.",
        formula: "spend / conversions",
        category: "PERFORMANCE",
        seoTitle: "Calculate CPA (Cost Per Action) | Media City Dubai",
        seoDescription: "Calculate your Cost Per Action (CPA) efficiency.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "conversions", label: "Total Conversions", type: "number" }
        ])
    },
    {
        title: "CPL",
        slug: "cpl",
        description: "Cost per lead or enquiry.",
        formula: "spend / leads",
        category: "PERFORMANCE",
        seoTitle: "Calculate CPL (Cost Per Lead) | Media City Dubai",
        seoDescription: "Calculate your exact Cost Per Lead (CPL).",
        fields: JSON.stringify([
            { name: "spend", label: "Total Spend", type: "currency" },
            { name: "leads", label: "Total Leads", type: "number" }
        ])
    },
    {
        title: "ROI",
        slug: "roi",
        description: "True profitability metric. Return on Investment.",
        formula: "(revenue - spend) / spend",
        category: "PERFORMANCE",
        seoTitle: "Calculate ROI (Return on Investment) | Media City Dubai",
        seoDescription: "Calculate your true Return on Investment profitability.",
        fields: JSON.stringify([
            { name: "revenue", label: "Total Revenue Generated", type: "currency" },
            { name: "spend", label: "Total Spend", type: "currency" }
        ])
    },

    // SHOPPING / ECOMMERCE
    {
        title: "ROAS",
        slug: "roas",
        description: "Revenue generated per unit spent.",
        formula: "revenue / spend",
        category: "ECOMMERCE",
        seoTitle: "Calculate ROAS (Return on Ad Spend) | Media City Dubai",
        seoDescription: "Calculate Return on Ad Spend (ROAS) to measure ecommerce efficiency.",
        fields: JSON.stringify([
            { name: "revenue", label: "Total Revenue", type: "currency" },
            { name: "spend", label: "Total Ad Spend", type: "currency" }
        ])
    },
    {
        title: "AOV",
        slug: "aov",
        description: "Average Order Value basket size.",
        formula: "revenue / orders",
        category: "ECOMMERCE",
        seoTitle: "Calculate AOV (Average Order Value) | Media City Dubai",
        seoDescription: "Calculate Average Order Value for your ecommerce store.",
        fields: JSON.stringify([
            { name: "revenue", label: "Total Revenue", type: "currency" },
            { name: "orders", label: "Total Orders", type: "number" }
        ])
    },
    {
        title: "Cart Abandonment Rate",
        slug: "cart-abandonment-rate",
        description: "Checkout friction indicator.",
        formula: "(adds - purchases) / adds",
        category: "ECOMMERCE",
        seoTitle: "Calculate Cart Abandonment Rate | Media City Dubai",
        seoDescription: "Calculate cart abandonment rate to find checkout friction.",
        fields: JSON.stringify([
            { name: "adds", label: "Total Add to Carts", type: "number" },
            { name: "purchases", label: "Total Purchases", type: "number" }
        ])
    },
    {
        title: "CAC",
        slug: "cac",
        description: "Cost per new customer.",
        formula: "total_spend / new_customers",
        category: "ECOMMERCE",
        seoTitle: "Calculate CAC (Customer Acquisition Cost) | Media City Dubai",
        seoDescription: "Calculate your total Customer Acquisition Cost.",
        fields: JSON.stringify([
            { name: "total_spend", label: "Total Marketing Spend", type: "currency" },
            { name: "new_customers", label: "Total New Customers", type: "number" }
        ])
    },
    {
        title: "ROAS %",
        slug: "roas-percentage",
        description: "Expressed as percentage.",
        formula: "(revenue / spend) * 100",
        category: "ECOMMERCE",
        seoTitle: "Calculate ROAS % | Media City Dubai",
        seoDescription: "Calculate Return on Ad Spend as a percentage.",
        fields: JSON.stringify([
            { name: "revenue", label: "Total Revenue", type: "currency" },
            { name: "spend", label: "Total Ad Spend", type: "currency" }
        ])
    },
    {
        title: "COS (Cost of Sale)",
        slug: "cos",
        description: "% of revenue spent on ads.",
        formula: "(spend / revenue) * 100",
        category: "ECOMMERCE",
        seoTitle: "Calculate COS (Cost of Sale) | Media City Dubai",
        seoDescription: "Calculate your Cost of Sale percentage.",
        fields: JSON.stringify([
            { name: "spend", label: "Total Ad Spend", type: "currency" },
            { name: "revenue", label: "Total Revenue", type: "currency" }
        ])
    },
    {
        title: "Add-to-Cart Rate",
        slug: "add-to-cart-rate",
        description: "Product appeal strength.",
        formula: "(adds / clicks)",
        category: "ECOMMERCE",
        seoTitle: "Calculate Add-to-Cart Rate | Media City Dubai",
        seoDescription: "Calculate the percentage of visitors who added items to their cart.",
        fields: JSON.stringify([
            { name: "adds", label: "Add to Carts", type: "number" },
            { name: "clicks", label: "Total Clicks (Traffic)", type: "number" }
        ])
    },
    {
        title: "LTV (Lifetime Value)",
        slug: "ltv",
        description: "Total expected customer revenue.",
        formula: "aov * frequency * lifespan",
        category: "ECOMMERCE",
        seoTitle: "Calculate Customer Lifetime Value (LTV) | Media City Dubai",
        seoDescription: "Calculate total expected customer revenue.",
        fields: JSON.stringify([
            { name: "aov", label: "Average Order Value", type: "currency" },
            { name: "frequency", label: "Purchases Per Year", type: "number" },
            { name: "lifespan", label: "Customer Lifespan (Years)", type: "number" }
        ])
    },
    {
        title: "LTV to CAC Ratio",
        slug: "ltv-cac-ratio",
        description: "Customer profitability sustainability metric.",
        formula: "ltv / cac",
        category: "ECOMMERCE",
        seoTitle: "Calculate LTV:CAC Ratio | Media City Dubai",
        seoDescription: "Calculate the ratio of Lifetime Value to Customer Acquisition Cost.",
        fields: JSON.stringify([
            { name: "ltv", label: "Customer Lifetime Value", type: "currency" },
            { name: "cac", label: "Customer Acquisition Cost", type: "currency" }
        ])
    },
    {
        title: "Assisted Conversion Rate",
        slug: "assisted-conversion-rate",
        description: "Measures supporting channel impact.",
        formula: "(assisted / total) * 100",
        category: "ATTRIBUTION",
        seoTitle: "Calculate Assisted Conversion Rate | Media City Dubai",
        seoDescription: "Calculate the percentage of conversions assisted by a channel.",
        fields: JSON.stringify([
            { name: "assisted", label: "Assisted Conversions", type: "number" },
            { name: "total", label: "Total Conversions", type: "number" }
        ])
    },
    {
        title: "Incremental Revenue Lift %",
        slug: "incremental-revenue-lift",
        description: "True campaign impact on revenue.",
        formula: "((exposed_rev - control_rev) / control_rev) * 100",
        category: "ATTRIBUTION",
        seoTitle: "Calculate Incremental Revenue Lift | Media City Dubai",
        seoDescription: "Measure the true incremental revenue driven by a campaign.",
        fields: JSON.stringify([
            { name: "exposed_rev", label: "Exposed Group Revenue", type: "currency" },
            { name: "control_rev", label: "Control Group Revenue", type: "currency" }
        ])
    },
    {
        title: "Break-Even ROAS",
        slug: "break-even-roas",
        description: "Minimum ROAS required to avoid loss.",
        formula: "1 / margin",
        category: "ADVANCED PROFITABILITY",
        seoTitle: "Calculate Break-Even ROAS | Media City Dubai",
        seoDescription: "Calculate the minimum ROAS required to be profitable.",
        fields: JSON.stringify([
            // using percentage, so margin should be decimal, we will ask user to input as %.
            // e.g. 20% margin = 0.20 . If formula is 1 / margin, we need margin as decimal.
            // Let's use number type and advise to enter format like 0.20
            { name: "margin", label: "Profit Margin (e.g. 0.20 for 20%)", type: "number" }
        ])
    },
    {
        title: "Marketing Efficiency Ratio (MER)",
        slug: "mer",
        description: "Overall marketing performance.",
        formula: "revenue / total_marketing_spend",
        category: "ADVANCED PROFITABILITY",
        seoTitle: "Calculate MER (Marketing Efficiency Ratio) | Media City Dubai",
        seoDescription: "Calculate your MER to see full-funnel marketing profitability.",
        fields: JSON.stringify([
            { name: "revenue", label: "Total Business Revenue", type: "currency" },
            { name: "total_marketing_spend", label: "Total Marketing Spend", type: "currency" }
        ])
    }
];

async function main() {
    console.log("Starting to seed KPI Calculators...");

    let count = 0;
    for (const kpi of kpis) {
        // Use upsert to prevent unique constraint errors if re-run
        await prisma.kpi.upsert({
            where: { slug: kpi.slug },
            update: kpi,
            create: kpi,
        });
        console.log(`Successfully seeded: ${kpi.title}`);
        count++;
    }

    console.log(`\n✅ Finished seeding ${count} KPI Calculators!`);
}

main()
    .catch((e) => {
        console.error("Error seeding KPIs:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
