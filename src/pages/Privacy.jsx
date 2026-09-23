import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Privacy() {
    return (
        <div className="privacy-page">
            <style>{`
                .privacy-page { min-height:100vh; background:#fff; color:#101828; }
                .privacy-header { border-bottom:1px solid #eaecf0; background:#fff; }
                .privacy-header-inner { max-width:1180px; min-height:72px; margin:0 auto; padding:0 24px; display:flex; align-items:center; justify-content:space-between; gap:20px; }
                .privacy-brand { display:flex; align-items:center; gap:10px; text-decoration:none; color:#101828; font-size:20px; font-weight:800; }
                .privacy-brand-icon { width:38px; height:38px; border-radius:10px; background:#1976f3; color:#fff; display:flex; align-items:center; justify-content:center; }
                .privacy-back { color:#1976f3; text-decoration:none; font-size:14px; font-weight:600; }
                .privacy-hero { text-align:center; padding:52px 20px 34px; background:#f8fbff; border-bottom:1px solid #eaecf0; }
                .privacy-eyebrow { display:inline-flex; align-items:center; gap:7px; color:#1976f3; font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
                .privacy-hero h1 { margin:10px 0 8px; font-size:40px; line-height:1.15; }
                .privacy-hero p { margin:0; color:#667085; font-size:14px; }
                .privacy-container { max-width:900px; margin:0 auto; padding:38px 24px 70px; }
                .privacy-section { margin-bottom:24px; padding:24px 26px; border:1px solid #eaecf0; border-radius:12px; background:#fff; box-shadow:0 2px 8px rgba(16,24,40,.03); }
                .privacy-section h2 { margin:0 0 12px; font-size:18px; }
                .privacy-section h3 { margin:18px 0 8px; font-size:15px; color:#344054; }
                .privacy-section p { margin:0 0 10px; color:#475467; font-size:14px; line-height:1.7; }
                .privacy-section ul { margin:8px 0 0 20px; padding:0; color:#475467; }
                .privacy-section li { margin:7px 0; font-size:14px; line-height:1.6; }
                .privacy-contact { display:flex; align-items:center; justify-content:space-between; gap:20px; }
                .privacy-email { display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:8px; background:#1976f3; color:#fff; text-decoration:none; font-size:13px; font-weight:600; white-space:nowrap; }
                .privacy-footer { border-top:1px solid #eaecf0; padding:22px 24px; text-align:center; color:#667085; font-size:13px; }
                @media(max-width:700px) { .privacy-header-inner{padding:0 16px;} .privacy-brand{font-size:17px;} .privacy-hero{padding:40px 18px 28px;} .privacy-hero h1{font-size:32px;} .privacy-container{padding:24px 16px 50px;} .privacy-section{padding:20px;} .privacy-contact{align-items:flex-start; flex-direction:column;} }
            `}</style>

            <header className="privacy-header">
                <div className="privacy-header-inner">
                    <Link to="/" className="privacy-brand">
                        <div className="privacy-brand-icon"><CheckCircle2 size={21} /></div>
                        <span>Complete ClosedTesting</span>
                    </Link>
                    <Link to="/" className="privacy-back">Back to Home</Link>
                </div>
            </header>

            <section className="privacy-hero">
                <div className="privacy-eyebrow"><ShieldCheck size={15} /> Legal & Privacy</div>
                <h1>Privacy Policy</h1>
                <p>Last updated: September 23, 2026</p>
            </section>

            <main className="privacy-container">
                <section className="privacy-section">
                    <h2>1. Introduction</h2>
                    <p>Welcome to Complete ClosedTesting ("we", "our", or "us"). Complete ClosedTesting is operated by MR BARCODE INFOTECH and connects Android app developers with testers through structured Testing Sprints.</p>
                    <p>This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices available to you.</p>
                </section>

                <section className="privacy-section">
                    <h2>2. Information We Collect</h2>
                    <h3>Account Information</h3>
                    <ul><li>Full name</li><li>Email address</li><li>Phone number</li><li>Account role and status</li><li>Account creation information</li></ul>
                    <h3>Developer Information</h3>
                    <ul><li>Application name and Android package name</li><li>Google Play Store URL</li><li>Application description and icon</li><li>Testing Sprint duration, tester requirements, goals and instructions</li></ul>
                    <h3>Tester Information</h3>
                    <ul><li>Testing Sprint assignments</li><li>Testing activity and completion status</li><li>Daily testing proof, such as screenshots</li><li>UPI payment QR code voluntarily uploaded by the Tester</li></ul>
                </section>

                <section className="privacy-section">
                    <h2>3. How We Use Your Information</h2>
                    <ul><li>Create and manage accounts and authenticate users</li><li>Provide Developer and Tester functionality</li><li>Create and manage Testing Sprints and assignments</li><li>Record daily testing activity and proof</li><li>Record testing and payment status</li><li>Support security and prevent misuse</li><li>Communicate about accounts and Testing Sprints</li><li>Maintain and improve the platform</li><li>Comply with applicable legal obligations</li></ul>
                </section>

                <section className="privacy-section">
                    <h2>4. Firebase and Cloud Services</h2>
                    <p>Complete ClosedTesting uses Firebase services provided by Google for authentication, database storage, file storage, and application security. Information submitted through the platform may therefore be processed and stored using these services.</p>
                </section>

                <section className="privacy-section">
                    <h2>5. Application Files and Testing Proof</h2>
                    <p>Developers may upload application information and icons. Testers may upload screenshots or other testing proof required for a Testing Sprint. Developers may upload payment proof after making a direct payment to a Tester.</p>
                    <p>These files are stored for operating and verifying Testing Sprints.</p>
                </section>

                <section className="privacy-section">
                    <h2>6. UPI QR Information</h2>
                    <p>Testers may voluntarily upload a UPI QR code so Developers can make direct testing payments to them.</p>
                    <p>Complete ClosedTesting does not request or store a Tester's UPI PIN, bank password, card PIN, or other banking authentication credentials.</p>
                </section>

                <section className="privacy-section">
                    <h2>7. Information Sharing</h2>
                    <p>We do not sell your personal information.</p>
                    <p>Information may be shared or made available when reasonably necessary to operate the platform, including with Developers and Testers participating in the same Testing Sprint, technology/service providers, or authorities where required by law.</p>
                </section>

                <section className="privacy-section">
                    <h2>8. Payments</h2>
                    <p>Complete ClosedTesting may charge Developers a platform fee for creating a Testing Sprint. Tester payments are made directly by Developers to Testers. Complete ClosedTesting does not currently hold Tester payouts.</p>
                    <p>Where a third-party payment provider is used for platform payments, its own terms and privacy policy may also apply.</p>
                </section>

                <section className="privacy-section">
                    <h2>9. Data Security</h2>
                    <p>We use reasonable technical and organizational measures to protect information, including authentication, access controls, database security rules, storage security rules, and application-level authorization. No internet-based service can guarantee absolute security.</p>
                </section>

                <section className="privacy-section">
                    <h2>10. Data Retention</h2>
                    <p>We retain personal information for as long as reasonably necessary to provide services, maintain Testing Sprint records, resolve disputes, maintain security, and meet applicable legal or regulatory requirements. Information may be deleted or anonymized when no longer reasonably required, subject to legal and operational requirements.</p>
                </section>

                <section className="privacy-section">
                    <h2>11. Cookies and Similar Technologies</h2>
                    <p>We may use cookies or similar technologies necessary for authentication, user sessions, security, and basic website functionality. If we introduce analytics, advertising, or other non-essential tracking technologies, this policy may be updated accordingly.</p>
                </section>

                <section className="privacy-section">
                    <h2>12. Your Privacy Rights</h2>
                    <p>Subject to applicable law, you may have rights relating to your personal information, including requesting access, correction, deletion where applicable, withdrawal of consent where processing is based on consent, and raising a privacy-related complaint.</p>
                    <p>You can contact us using the details below for a privacy-related request.</p>
                </section>

                <section className="privacy-section">
                    <h2>13. Account Deletion</h2>
                    <p>To request deletion of your Complete ClosedTesting account or personal information, please contact us. Certain information may need to be retained for legal, security, fraud-prevention, accounting, or dispute-resolution purposes.</p>
                </section>

                <section className="privacy-section">
                    <h2>14. Children's Privacy</h2>
                    <p>Complete ClosedTesting is intended for users who are legally permitted to use the service. We do not knowingly collect personal information from children in violation of applicable law.</p>
                </section>

                <section className="privacy-section">
                    <h2>15. Third-Party Services</h2>
                    <p>We may use third-party services necessary to operate the platform, including Firebase/Google services, payment providers where applicable, hosting providers, and security or anti-abuse services. Their own terms and privacy policies may apply.</p>
                </section>

                <section className="privacy-section">
                    <h2>16. Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy when our services, technology, or legal requirements change. The "Last Updated" date will be changed when the policy is updated.</p>
                </section>

                <section className="privacy-section">
                    <h2>17. Contact Us</h2>
                    <div className="privacy-contact">
                        <div>
                            <p>For questions about this Privacy Policy, personal data, account deletion, or privacy-related requests:</p>
                            <p><strong>MR BARCODE INFOTECH</strong><br />Complete ClosedTesting</p>
                        </div>
                        <a href="mailto:info@mr-barcode.com" className="privacy-email"><Mail size={16} /> info@mr-barcode.com</a>
                    </div>
                </section>
            </main>

            <footer className="privacy-footer">
                © 2026 Complete ClosedTesting. All rights reserved. Operated by MR BARCODE INFOTECH.
            </footer>
        </div>
    );
}

export default Privacy;
