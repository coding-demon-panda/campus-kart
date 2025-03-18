import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-gray-700 mb-4">Last updated: March 17, 2025</p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                    By accessing and using the Campus-Kart platform ("Service"), you accept and agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please refrain from using our Service.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
                <p className="text-gray-700">
                    Users are expected to provide accurate information, maintain the confidentiality of their account credentials, and use the Service in compliance with applicable laws and regulations. Any fraudulent, abusive, or unlawful activity may result in termination of your access to the Service.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Product Information</h2>
                <p className="text-gray-700">
                    We strive to provide accurate product descriptions and pricing. However, errors may occur, and we do not warrant that product descriptions or other content are accurate, complete, reliable, or error-free. In the event of an error, we reserve the right to correct it and revise your order accordingly or cancel the order and refund any charges.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
                <p className="text-gray-700">
                    Campus-Kart shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service. Our liability to you for any damages arising from or related to this agreement shall at all times be limited to the amount paid by you to us, if any, for accessing the Service.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
                <p className="text-gray-700">
                    We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
                <p className="text-gray-700">
                    If you have any questions or concerns about these Terms, please contact us at <a href="mailto:support@campus-kart.com" className="text-blue-500">support@campus-kart.com</a>.
                </p>
            </section>
        </div>
    );
};

export default TermsAndConditions;
