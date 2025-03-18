import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Import the arrow icon

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white p-8 md:p-12">
            {/* Back Button */}
            <Link 
                to="/signup" 
                className="fixed top-8 left-8 w-10 h-10 bg-gray-200 shadow-md rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            {/* Header with Logo */}
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 bg-purple-600 rounded-t-full relative">
                        <div className="absolute top-1/4 left-2.5 w-3 h-3 bg-white rounded-full"></div>
                        <div className="left-2 top-6 w-4 h-2 bg-pink-500 absolute bottom-0 rounded-t-full"></div>
                        <div className="left-2 top-8 w-4 h-2 bg-yellow-400 absolute bottom-2 rounded-b-lg"></div>
                    </div>
                    <span className="text-xl font-bold">Triumph IQ</span>
                </Link>

                {/* Privacy Policy Content */}
                <div className="prose max-w-none">
                    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 mb-8">Last Updated: February 02, 2025</p>

                    <p className="text-gray-700 mb-6">
                        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                    </p>
                    <p className="text-gray-700 mb-6">
                        We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the Free Privacy Policy Generator.
                    </p>

                    {/* Sections */}
                    <div className="space-y-8">
                        <section className="mb-8">
                            <h2 className="text-3xl font-semibold mb-3">Interpretation and Definitions</h2>
                            <div className="text-gray-700">
                                <h3 className="text-xl font-medium mb-2">Interpretation</h3>
                                <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                                </p>
                            </div>
                            <div className="text-gray-700">
                                <h3 className="text-xl font-medium mb-2">Definitions</h3>
                                <p>
                                <ul className="list-disc pl-6 space-y-3">
                                    <li>
                                        <strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.
                                    </li>
                                    <li>
                                        <strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
                                    </li>
                                    <li>
                                        <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Triumph IQ.
                                    </li>
                                    <li>
                                        <strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.
                                    </li>
                                    <li>
                                        <strong>Country</strong> refers to: Karnataka, India
                                    </li>
                                    <li>
                                        <strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.
                                    </li>
                                    <li>
                                        <strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.
                                    </li>
                                    <li>
                                        <strong>Service</strong> refers to the Website.
                                    </li>
                                    <li>
                                        <strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.
                                    </li>
                                    <li>
                                        <strong>Third-party Social Media Service</strong> refers to any website or any social network website through which a User can log in or create an account to use the Service.
                                    </li>
                                    <li>
                                        <strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
                                    </li>
                                    <li>
                                    <strong>Website</strong> refers to Triumph IQ, accessible from{' '}
                                    <Link 
                                        to="https://triumphiq.com" 
                                        className="text-[#7C3AED] hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        https://triumphiq.com
                                    </Link>
                                    </li>
                                    <li>
                                        <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                                    </li>
                                </ul>
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">
                            If you have any questions about this Privacy Policy, You can contact us:{' '}
                            <a href="mailto:chiragnighut05@gmail.com" className="text-[#7C3AED] hover:underline">
                                chiragnighut05@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
