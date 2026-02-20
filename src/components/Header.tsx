'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from '@/styles/Header.module.css';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        Media City Dubai
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={styles.navLinks}>
                        <Link href="/events" className={styles.navLink}>Events</Link>
                        <Link href="/tools" className={styles.navLink}>Tools</Link>
                        <Link href="/forum" className={styles.navLink}>Forum</Link>
                        <Link href="/about" className={styles.navLink}>About</Link>

                        <form action="/search" className={styles.searchForm}>
                            <input
                                type="text"
                                name="q"
                                placeholder="Search..."
                                className={styles.searchInput}
                            />
                        </form>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </nav>
            </div>
        </header>
    );
}
