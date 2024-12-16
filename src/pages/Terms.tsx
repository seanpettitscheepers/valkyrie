import { PageLayout } from "@/components/Layout/PageLayout";

export default function Terms() {
  return (
    <PageLayout title="Terms of Use">
      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
        
        <div className="text-sm text-muted-foreground mb-8">
          <p>Effective Date: 16th December 2024</p>
          <p>Last Updated: 16th December 2024</p>
        </div>

        <p className="mb-8">
          Welcome to Valkyrie, your digital advertising guardian. By accessing or using Valkyrie's website (www.valkyriehub.com), 
          mobile application, or any associated services (collectively, the "Service"), you agree to comply with and be bound by 
          these Terms of Use ("Terms"). If you do not agree with these Terms, you may not use our Service.
        </p>

        <p className="mb-8">
          For any questions regarding these Terms, please contact us at support@valkyriehub.com.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Acceptance of Terms</h2>
        <p>By using Valkyrie, you confirm that you:</p>
        <ul>
          <li>Are at least 18 years old (or the age of majority in your jurisdiction).</li>
          <li>Have read, understood, and agreed to these Terms.</li>
          <li>Have the authority to bind your organization, if using Valkyrie on behalf of a business.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. Modifications to Terms</h2>
        <p>
          Valkyrie reserves the right to modify these Terms at any time. Changes will be effective upon posting on www.valkyriehub.com 
          or notifying you through the Service. Your continued use of the Service constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8">3. Description of Service</h2>
        <p>
          Valkyrie is a Software-as-a-Service (SaaS) platform that integrates with various digital advertising platforms to provide 
          campaign management, performance analysis, and optimization insights.
        </p>
        <p>Key features include (but are not limited to):</p>
        <ul>
          <li>Connecting advertising accounts (e.g., Facebook, Google Ads, TikTok).</li>
          <li>Centralized dashboard for campaign performance tracking.</li>
          <li>Budget planning and allocation tools.</li>
          <li>Audience insights and AI-driven recommendations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">4. Account Registration</h2>
        <h3 className="text-xl font-semibold mt-4">4.1 Creating an Account</h3>
        <p>
          To use Valkyrie, you must create an account by providing accurate and up-to-date information. You are responsible for 
          maintaining the confidentiality of your login credentials and for any activity occurring under your account.
        </p>
        <h3 className="text-xl font-semibold mt-4">4.2 Prohibited Actions</h3>
        <p>You may not:</p>
        <ul>
          <li>Create accounts on behalf of others without authorization.</li>
          <li>Use false information or impersonate another person or entity.</li>
          <li>Share your account credentials with unauthorized users.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">5. Subscription Plans and Payment</h2>
        <h3 className="text-xl font-semibold mt-4">5.1 Free and Paid Plans</h3>
        <p>
          Valkyrie offers both free and paid subscription plans. Each plan provides varying levels of access to the Service. 
          Details of pricing and features are available on the Pricing page at www.valkyriehub.com.
        </p>
        <h3 className="text-xl font-semibold mt-4">5.2 Payments</h3>
        <ul>
          <li>Paid subscriptions are billed monthly or annually, depending on your selection.</li>
          <li>Payments are processed via our third-party payment provider. By subscribing, you agree to the provider's terms.</li>
          <li>You are responsible for all applicable taxes associated with your subscription.</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">5.3 Cancellations and Refunds</h3>
        <ul>
          <li>You may cancel your subscription at any time via your Valkyrie account settings.</li>
          <li>Refunds are not provided for partial months of service or unused portions of subscriptions unless required by law.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">6. Use of the Service</h2>
        <h3 className="text-xl font-semibold mt-4">6.1 Permitted Use</h3>
        <p>You may use the Service solely for lawful purposes and in compliance with these Terms.</p>
        <h3 className="text-xl font-semibold mt-4">6.2 Prohibited Use</h3>
        <p>You may not:</p>
        <ul>
          <li>Reverse-engineer, copy, modify, or distribute any part of the Service.</li>
          <li>Use the Service for unlawful or fraudulent activities.</li>
          <li>Interfere with the Service's functionality or security.</li>
          <li>Use the Service in a way that violates the terms of third-party platforms integrated with Valkyrie.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">7. Data and Privacy</h2>
        <h3 className="text-xl font-semibold mt-4">7.1 Data Usage</h3>
        <p>
          Valkyrie collects and uses data necessary to provide the Service, such as campaign performance metrics and audience insights. 
          For more details, please review our Privacy Policy.
        </p>
        <h3 className="text-xl font-semibold mt-4">7.2 User Responsibilities</h3>
        <p>
          You are responsible for obtaining any necessary permissions to allow Valkyrie to access and process data from your 
          connected platforms.
        </p>
        <h3 className="text-xl font-semibold mt-4">7.3 Third-Party Integrations</h3>
        <p>
          By connecting third-party accounts, you authorize Valkyrie to access and process data from those platforms in accordance 
          with their respective terms and policies.
        </p>

        <h2 className="text-2xl font-semibold mt-8">8. Intellectual Property</h2>
        <h3 className="text-xl font-semibold mt-4">8.1 Ownership</h3>
        <p>
          All intellectual property rights in Valkyrie's Service, including software, design, and content, are owned by Valkyrie 
          or its licensors. You may not use, reproduce, or distribute any part of the Service without prior written consent.
        </p>
        <h3 className="text-xl font-semibold mt-4">8.2 User Content</h3>
        <p>
          You retain ownership of any content you upload to the Service. By using Valkyrie, you grant us a worldwide, royalty-free 
          license to use, store, and process your content for the purpose of providing the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8">9. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Valkyrie is not liable for:</p>
        <ol>
          <li>Any indirect, incidental, or consequential damages arising from your use of the Service.</li>
          <li>Loss of data or profits, even if Valkyrie has been advised of such risks.</li>
        </ol>
        <p>
          Valkyrie's total liability for any claims related to the Service is limited to the amount you paid for the Service in 
          the 12 months preceding the claim.
        </p>

        <h2 className="text-2xl font-semibold mt-8">10. Termination</h2>
        <p>
          Valkyrie reserves the right to suspend or terminate your account at any time if you violate these Terms or engage in 
          fraudulent, abusive, or harmful behavior.
        </p>
        <p>
          You may terminate your account by contacting support@valkyriehub.com. Upon termination, you will lose access to the 
          Service and its features.
        </p>

        <h2 className="text-2xl font-semibold mt-8">11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the United Kingdom. Any disputes arising from these Terms will be resolved in 
          the courts of the United Kingdom.
        </p>

        <h2 className="text-2xl font-semibold mt-8">12. Contact Information</h2>
        <p>For support or questions about these Terms, please contact us at:</p>
        <p>Email: support@valkyriehub.com</p>
        <p>Website: www.valkyriehub.com</p>

        <p className="mt-8">
          By using Valkyrie, you agree to these Terms of Use. Thank you for trusting us as your digital advertising guardian. 
          We're here to protect your investments and help your brand thrive in the digital landscape.
        </p>
      </div>
    </PageLayout>
  );
}