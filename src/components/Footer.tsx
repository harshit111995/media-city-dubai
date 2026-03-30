import Link from 'next/link';
import { Mail } from 'lucide-react';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            Media City Dubai
                        </Link>
                        <p className={styles.tagline}>
                            Empowering the region's media, tech, and creative professionals.
                        </p>
                        <Link href="/media-planner" className={styles.tagline} style={{ marginTop: '0.75rem', display: 'inline-block', fontWeight: 700, color: '#dc2626', textDecoration: 'none' }}>
                            🗂 Try our free Programmatic Media Planner →
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linkCol}>
                        <h3 className={styles.colTitle}>Platform</h3>
                        <ul className={styles.links}>
                            <li><Link href="/events">Events Calendar</Link></li>
                            <li><Link href="/tools">Tools Directory</Link></li>
                            <li><Link href="/kpi">KPI Calculators</Link></li>
                            <li><Link href="/media-planner">Media Planner</Link></li>
                            <li><Link href="/media-metrics">Media Metrics Glossary</Link></li>
                            <li><Link href="/forum">Community Forum</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className={styles.linkCol}>
                        <h3 className={styles.colTitle}>Top Categories</h3>
                        <ul className={styles.links}>
                            <li><Link href="/tools/category/AI%20Tools">AI Tools</Link></li>
                            <li><Link href="/tools/category/AdTech">AdTech</Link></li>
                            <li><Link href="/tools/category/MarTech">MarTech</Link></li>
                            <li><Link href="/forum/category/Industry%20News">Industry News</Link></li>
                            <li><Link href="/forum/category/Career%20Advice">Career Advice</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className={styles.newsletterCol}>
                        <h3 className={styles.colTitle}>Stay Updated</h3>
                        <p className={styles.newsletterText}>
                            Subscribe to our newsletter for the latest tools and events.
                        </p>
                        <form className={styles.form}>
                            <button type="button" className={styles.btn}>Subscribe</button>
                        </form>
                        <a href="mailto:contact@mediacitydubai.com" className={styles.contactEmail}>
                            <Mail size={16} /> contact@mediacitydubai.com
                        </a>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} Media City Dubai. All rights reserved.</p>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/disclaimer">Disclaimer</Link>
                        <Link href="/gdpr">GDPR</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
