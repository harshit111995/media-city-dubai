'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/cookie.module.css';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.banner}>
            <div className={styles.text}>
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies. Read our <Link href="/privacy" className={styles.link}>Privacy Policy</Link> for more information.
            </div>
            <div className={styles.buttonContainer}>
                <button
                    onClick={handleAccept}
                    className={styles.acceptButton}
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
