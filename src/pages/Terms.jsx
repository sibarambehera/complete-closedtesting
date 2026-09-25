import { useEffect } from "react";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Terms() {
    useEffect(() => {
        document.title =
            "Terms of Service | Complete ClosedTesting";

        const description =
            "Read the Complete ClosedTesting Terms of Service covering Testing Sprints, Android app testing, tester payments, Google Play requirements and platform responsibilities.";

        let metaDescription = document.querySelector(
            'meta[name="description"]'
        );

        if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.setAttribute("name", "description");
            document.head.appendChild(metaDescription);
        }

        metaDescription.setAttribute("content", description);
        const canonicalUrl =
            "https://complete-closedtesting.com/terms-of-service";

        let canonicalLink = document.querySelector(
            'link[rel="canonical"]'
        );

        if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
        }

        canonicalLink.setAttribute("href", canonicalUrl);
    }, []);
    return (
        <div className="terms-page">

            <style>{`
                .terms-page {
                    min-height: 100vh;
                    background: #ffffff;
                    color: #101828;
                }

                .terms-header {
                    border-bottom: 1px solid #eaecf0;
                    background: #ffffff;
                    position: sticky;
                    top: 0;
                    z-index: 20;
                }

                .terms-header-inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    min-height: 72px;
                    padding: 0 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .terms-brand {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    color: #101828;
                    font-size: 20px;
                    font-weight: 800;
                }

                .terms-brand-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: #1976f3;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .terms-back {
                    text-decoration: none;
                    color: #1976f3;
                    font-size: 14px;
                    font-weight: 600;
                }

                .terms-hero {
                    text-align: center;
                    padding: 54px 20px 34px;
                    background: #f8fbff;
                    border-bottom: 1px solid #eaecf0;
                }

                .terms-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    color: #1976f3;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .terms-hero h1 {
                    margin: 10px 0 8px;
                    font-size: 40px;
                    line-height: 1.15;
                    color: #101828;
                }

                .terms-hero p {
                    margin: 0;
                    color: #667085;
                    font-size: 14px;
                }

                .terms-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 38px 24px 70px;
                }

                .terms-section {
                    margin-bottom: 24px;
                    padding: 24px 26px;
                    border: 1px solid #eaecf0;
                    border-radius: 12px;
                    background: #ffffff;
                    box-shadow: 0 2px 8px rgba(16, 24, 40, 0.03);
                }

                .terms-section h2 {
                    margin: 0 0 12px;
                    font-size: 18px;
                    color: #101828;
                }

                .terms-section h3 {
                    margin: 18px 0 8px;
                    font-size: 15px;
                    color: #344054;
                }

                .terms-section p {
                    margin: 0 0 10px;
                    color: #475467;
                    font-size: 14px;
                    line-height: 1.7;
                }

                .terms-section ul {
                    margin: 8px 0 0 20px;
                    padding: 0;
                    color: #475467;
                }

                .terms-section li {
                    margin: 7px 0;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .terms-highlight {
                    margin-top: 14px;
                    padding: 14px 16px;
                    border-radius: 8px;
                    background: #f8fbff;
                    border: 1px solid #dbeafe;
                    color: #344054;
                    font-size: 13px;
                    line-height: 1.6;
                }

                .terms-contact {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .terms-email {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 14px;
                    border-radius: 8px;
                    background: #1976f3;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .terms-footer {
                    border-top: 1px solid #eaecf0;
                    padding: 22px 24px;
                    text-align: center;
                    color: #667085;
                    font-size: 13px;
                }

                @media (max-width: 700px) {
                    .terms-header-inner {
                        min-height: 64px;
                        padding: 0 16px;
                    }

                    .terms-brand {
                        font-size: 17px;
                    }

                    .terms-brand-icon {
                        width: 34px;
                        height: 34px;
                    }

                    .terms-hero {
                        padding: 40px 18px 28px;
                    }

                    .terms-hero h1 {
                        font-size: 32px;
                    }

                    .terms-container {
                        padding: 24px 16px 50px;
                    }

                    .terms-section {
                        padding: 20px;
                    }

                    .terms-contact {
                        align-items: flex-start;
                        flex-direction: column;
                    }
                }
            `}</style>

            <header className="terms-header">
                <div className="terms-header-inner">

                    <Link to="/" className="terms-brand">
                        <div className="terms-brand-icon">
                            <CheckCircle2 size={21} />
                        </div>

                        <span>Complete ClosedTesting</span>
                    </Link>

                    <Link to="/" className="terms-back">
                        Back to Home
                    </Link>

                </div>
            </header>

            <section className="terms-hero">

                <div className="terms-eyebrow">
                    <ShieldCheck size={15} />
                    Legal & Terms
                </div>

                <h1>Terms of Service</h1>

                <p>
                    Last updated: September 23, 2026
                </p>

            </section>

            <main className="terms-container">

                <section className="terms-section">
                    <h2>1. Acceptance of Terms</h2>

                    <p>
                        By accessing or registering for Complete
                        ClosedTesting, you agree to comply with and be
                        bound by these Terms of Service.
                    </p>

                    <p>
                        If you do not agree to these Terms, please do not
                        use the platform.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>2. Description of the Service</h2>

                    <p>
                        Complete ClosedTesting is a platform operated by
                        MR BARCODE INFOTECH that connects Android app
                        Developers with Testers for structured Testing
                        Sprints.
                    </p>

                    <p>
                        Developers can submit an Android application,
                        create a Testing Sprint, specify testing
                        requirements, and receive testing activity and
                        proof from assigned Testers.
                    </p>

                    <p>
                        Testers can register, participate in available
                        Testing Sprints, perform the requested testing,
                        submit daily proof, and receive payments directly
                        from Developers according to the Sprint terms.
                    </p>

                    <div className="terms-highlight">
                        Complete ClosedTesting is an independent service.
                        It is not affiliated with, sponsored by, endorsed
                        by, or operated by Google LLC.
                    </div>
                </section>

                <section className="terms-section">
                    <h2>3. Account Registration</h2>

                    <p>
                        To use features that require an account, you must
                        provide accurate and current information during
                        registration.
                    </p>

                    <ul>
                        <li>You are responsible for the accuracy of the information you provide.</li>
                        <li>You are responsible for maintaining the security of your account credentials.</li>
                        <li>You must not create an account using another person's identity or information without authorization.</li>
                        <li>You must not attempt to access another user's account.</li>
                        <li>We may activate, deactivate, suspend, or restrict accounts where permitted by these Terms or applicable law.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>4. Developer Responsibilities</h2>

                    <p>
                        Developers using Complete ClosedTesting are
                        responsible for the applications and testing
                        instructions they submit.
                    </p>

                    <ul>
                        <li>You must own the application or have authorization to submit it for testing.</li>
                        <li>Your application must comply with applicable law and Google Play policies.</li>
                        <li>You must provide accurate application and Testing Sprint information.</li>
                        <li>You must provide testers with clear and lawful testing instructions.</li>
                        <li>You must not use the platform to distribute malware, harmful software, illegal content, or content that infringes third-party rights.</li>
                        <li>You must not request testers to perform fraudulent, deceptive, or unlawful actions.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>5. Tester Responsibilities</h2>

                    <p>
                        Testers participating in a Testing Sprint agree
                        to perform genuine testing activities according
                        to the Sprint instructions.
                    </p>

                    <ul>
                        <li>Use a compatible Android device capable of installing the application.</li>
                        <li>Follow the testing instructions provided for the Sprint.</li>
                        <li>Keep the application installed and participate for the agreed testing period when required by the Sprint.</li>
                        <li>Submit truthful and relevant daily testing proof.</li>
                        <li>Report genuine testing observations where requested.</li>
                        <li>Do not submit fake, copied, manipulated, or misleading testing proof.</li>
                        <li>Do not use automated or fraudulent methods to simulate testing activity.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>6. Testing Sprint and Daily Activity</h2>

                    <p>
                        A Testing Sprint defines the testing duration,
                        number of Testers, testing goals, instructions,
                        and applicable tester payment terms.
                    </p>

                    <p>
                        Daily activity may require the Tester to perform
                        testing and submit proof. A Developer may review
                        the submitted proof and mark an activity as
                        successfully tested.
                    </p>

                    <p>
                        Testing activity and payment status recorded on
                        the platform are based on the information and
                        proof available to the platform and its users.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>7. Tester Payments</h2>

                    <p>
                        Under the current platform model, the Developer
                        pays the Tester directly for successful daily
                        testing activity.
                    </p>

                    <ul>
                        <li>The standard tester payout is ₹100 for the complete Testing Sprint, unless a different amount is explicitly displayed for the Sprint.</li>
                        <li>The payout is distributed across the Sprint's testing days and may be paid day-by-day after successful testing.</li>
                        <li>Developers are responsible for making the direct payment to the Tester.</li>
                        <li>Developers may be required to upload payment proof after making a payment.</li>
                        <li>Complete ClosedTesting does not currently hold Tester payouts or act as a bank or payment wallet for Tester payments.</li>
                    </ul>

                    <p>
                        Testers are responsible for providing accurate
                        payment information, including a valid UPI QR code
                        where they choose to use one.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>8. Platform Charges</h2>

                    <p>
                        Complete ClosedTesting may charge a Developer a
                        platform fee for creating a Testing Sprint.
                    </p>

                    <p>
                        The applicable fee will be displayed to the
                        Developer before the relevant payment is made.
                    </p>

                    <p>
                        Platform fees are separate from direct payments
                        made by Developers to Testers.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>9. Google Play and Testing Requirements</h2>

                    <p>
                        Developers are responsible for configuring their
                        Google Play testing tracks and complying with
                        Google's current requirements.
                    </p>

                    <p>
                        Complete ClosedTesting may help coordinate human
                        testers and testing activity, but we do not
                        control Google Play, Google Play Console, Google's
                        review process, or production-access decisions.
                    </p>

                    <p>
                        Google currently states that certain new personal
                        developer accounts must complete a closed test
                        with at least 12 testers opted in continuously
                        for 14 days before applying for production access.
                        Requirements can change, and Developers remain
                        responsible for checking the current Google Play
                        requirements applicable to their account.
                    </p>

                    <div className="terms-highlight">
                        We do not guarantee that Google will grant
                        production access, approve an application, or
                        accept a particular testing activity as satisfying
                        Google's requirements.
                    </div>
                </section>

                <section className="terms-section">
                    <h2>10. Prohibited Activities</h2>

                    <p>You must not use Complete ClosedTesting to:</p>

                    <ul>
                        <li>Submit malware, harmful software, or unlawful content.</li>
                        <li>Commit fraud or impersonate another person or organization.</li>
                        <li>Manipulate testing activity or payment records.</li>
                        <li>Submit fake or misleading testing proof.</li>
                        <li>Attempt to bypass platform security or access controls.</li>
                        <li>Interfere with the operation of the platform.</li>
                        <li>Use automated activity to create fraudulent accounts, testing activity, or submissions.</li>
                        <li>Request testers to violate applicable law or Google Play policies.</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>11. Account Suspension and Termination</h2>

                    <p>
                        We may suspend, restrict, or terminate an account
                        if we reasonably believe that the user has
                        violated these Terms, misused the platform,
                        submitted fraudulent information, or created a
                        security or legal risk.
                    </p>

                    <p>
                        Where appropriate, we may also remove a user from
                        a Testing Sprint or restrict participation in
                        future Sprints.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>12. Intellectual Property</h2>

                    <p>
                        The Complete ClosedTesting website, software,
                        branding, interface, logos, and related platform
                        materials are owned by or licensed to MR BARCODE
                        INFOTECH, except for third-party materials.
                    </p>

                    <p>
                        You may not copy, modify, distribute, reverse
                        engineer, or commercially exploit platform
                        materials except where permitted by applicable law
                        or with our written permission.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>13. Third-Party Services</h2>

                    <p>
                        The platform may use third-party services,
                        including Firebase, Google services, payment
                        providers, hosting providers, and security
                        services.
                    </p>

                    <p>
                        Your use of third-party services may also be
                        subject to their own terms and policies.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>14. Service Availability</h2>

                    <p>
                        We aim to keep Complete ClosedTesting available
                        and reliable, but we do not guarantee uninterrupted
                        or error-free operation.
                    </p>

                    <p>
                        The platform may occasionally be unavailable due
                        to maintenance, technical problems, third-party
                        service failures, security events, or circumstances
                        outside our reasonable control.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>15. Disclaimers and Limitation of Liability</h2>

                    <p>
                        Complete ClosedTesting provides a coordination
                        platform and does not guarantee the outcome of
                        any Google Play review, production-access request,
                        application approval, or testing result.
                    </p>

                    <p>
                        To the extent permitted by applicable law, we are
                        not responsible for indirect, incidental, special,
                        consequential, or punitive losses arising from the
                        use of or inability to use the platform.
                    </p>

                    <p>
                        Nothing in these Terms excludes or limits any
                        liability that cannot lawfully be excluded or
                        limited under applicable law.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>16. Changes to These Terms</h2>

                    <p>
                        We may update these Terms when our services,
                        business model, technology, or legal requirements
                        change.
                    </p>

                    <p>
                        The "Last Updated" date will be changed when the
                        Terms are updated. Continued use of the platform
                        after an update may constitute acceptance of the
                        revised Terms where permitted by applicable law.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>17. Governing Law</h2>

                    <p>
                        These Terms are intended to be governed by the
                        applicable laws of India, subject to any mandatory
                        consumer or other legal rights that cannot be
                        excluded by contract.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>18. Contact Us</h2>

                    <div className="terms-contact">

                        <div>
                            <p>
                                For questions regarding these Terms,
                                account issues, Testing Sprints, or
                                platform policies, contact:
                            </p>

                            <p>
                                <strong>MR BARCODE INFOTECH</strong><br />
                                Complete ClosedTesting
                            </p>
                        </div>

                        <a
                            href="mailto:info@mr-barcode.com"
                            className="terms-email"
                        >
                            <Mail size={16} />
                            info@mr-barcode.com
                        </a>

                    </div>
                </section>

            </main>

            <footer className="terms-footer">
                © 2026 Complete ClosedTesting. All rights reserved.
                {" "}Operated by MR BARCODE INFOTECH.
            </footer>

        </div>
    );
}

export default Terms;
