import { PageLayout } from "@/components/Layout/PageLayout";

export default function Privacy() {
  return (
    <PageLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        
        <div className="text-sm text-muted-foreground mb-8">
          <p>Effective Date: 16th December 2024</p>
          <p>Last Updated: 16th December 2024</p>
        </div>

        <p className="mb-8">
          Valkyrie (referred to as "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains 
          how we collect, use, disclose, and safeguard your data when you use our website (www.valkyriehub.com), mobile 
          application, and services (collectively, the "Service"). By using our Service, you agree to the practices described 
          in this Privacy Policy.
        </p>

        <p className="mb-8">
          If you have any questions, please contact us at{" "}
          <a href="mailto:support@valkyriehub.com" className="text-primary hover:underline">
            support@valkyriehub.com
          </a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Data We Collect</h2>
        
        <h3 className="text-xl font-semibold mt-4">1.1 Information You Provide to Us</h3>
        <p>When you create an account or use Valkyrie, we collect the following information:</p>
        <ul>
          <li>Personal Information: Name, email address, phone number, and billing details.</li>
          <li>Business Information: Company name, advertising account details, campaign objectives, and preferences.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">1.2 Data from Connected Platforms</h3>
        <p>
          When you connect third-party advertising platforms (e.g., Facebook Ads Manager, Google Ads, TikTok), we collect 
          the following data as permitted by those platforms' APIs:
        </p>
        <ul>
          <li>Campaign performance data (e.g., impressions, clicks, conversions, ad spend).</li>
          <li>Audience data, including demographic and interest-based insights.</li>
          <li>Naming conventions and taxonomy details for campaigns.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">1.3 Automatically Collected Data</h3>
        <p>We collect data about how you use Valkyrie, including:</p>
        <ul>
          <li>Device Information: IP address, browser type, operating system, and device identifiers.</li>
          <li>Usage Data: Features accessed, time spent on the Service, and clickstream data.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. How We Use Your Data</h2>
        
        <h3 className="text-xl font-semibold mt-4">2.1 To Provide the Service</h3>
        <p>We use your data to:</p>
        <ul>
          <li>Integrate with advertising platforms and provide campaign insights.</li>
          <li>Generate reports and recommendations based on your campaign performance.</li>
          <li>Offer audience targeting and budget allocation suggestions.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">2.2 For Marketing Purposes</h3>
        <p>With your consent, we may use your data for:</p>
        <ul>
          <li>Sending promotional emails and updates about new features.</li>
          <li>Personalized marketing campaigns based on your usage patterns.</li>
          <li>Creating case studies or testimonials (with explicit approval).</li>
        </ul>

        <p>
          You can opt out of marketing communications at any time by clicking "unsubscribe" in our emails or contacting{" "}
          <a href="mailto:support@valkyriehub.com" className="text-primary hover:underline">
            support@valkyriehub.com
          </a>.
        </p>

        <h3 className="text-xl font-semibold mt-4">2.3 For Analysis and Product Development</h3>
        <p>We use aggregated and anonymized data to:</p>
        <ul>
          <li>Understand platform usage trends and improve our Service.</li>
          <li>Analyze user behavior to create new features and enhance user experience.</li>
          <li>Conduct research and develop AI models to improve campaign recommendations.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">2.4 To Ensure Security and Compliance</h3>
        <p>We use your data to:</p>
        <ul>
          <li>Protect against fraudulent or unauthorized activity.</li>
          <li>Comply with legal obligations and enforce our Terms of Use.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">3. Sharing Your Data</h2>
        <p>We do not sell your data to third parties. However, we may share your data in the following circumstances:</p>

        <h3 className="text-xl font-semibold mt-4">3.1 With Third-Party Service Providers</h3>
        <p>We may share your data with trusted vendors who assist us with:</p>
        <ul>
          <li>Payment processing.</li>
          <li>Data storage and analytics.</li>
          <li>Email and marketing communications.</li>
        </ul>

        <p>
          These providers are bound by strict confidentiality agreements and are authorized to use your data only as 
          necessary to perform their services.
        </p>

        <h3 className="text-xl font-semibold mt-4">3.2 With Integrated Platforms</h3>
        <p>
          When you connect third-party platforms (e.g., Facebook Ads Manager, Google Ads), your data is shared with and 
          accessed through those platforms' APIs in accordance with their terms and policies.
        </p>

        <h3 className="text-xl font-semibold mt-4">3.3 For Legal Reasons</h3>
        <p>We may disclose your data if required to do so by law or if we believe such action is necessary to:</p>
        <ul>
          <li>Protect and defend our rights or property.</li>
          <li>Prevent fraud or unauthorized use of our Service.</li>
          <li>Comply with legal obligations, such as responding to subpoenas or government requests.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">3.4 In Case of Business Transfer</h3>
        <p>
          If Valkyrie undergoes a merger, acquisition, or sale, your data may be transferred as part of the business 
          transaction.
        </p>

        <h2 className="text-2xl font-semibold mt-8">4. Data Retention</h2>
        <p>
          We retain your data for as long as necessary to provide the Service, fulfill the purposes described in this 
          Privacy Policy, and comply with legal obligations. If you close your account, we will delete your data within 90 
          days, except where retention is required by law or for legitimate business purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-8">5. Your Rights</h2>
        
        <h3 className="text-xl font-semibold mt-4">5.1 Access and Control of Your Data</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Correct or update your data.</li>
          <li>Request the deletion of your data.</li>
        </ul>

        <p>To exercise these rights, contact us at{" "}
          <a href="mailto:support@valkyriehub.com" className="text-primary hover:underline">
            support@valkyriehub.com
          </a>.
        </p>

        <h3 className="text-xl font-semibold mt-4">5.2 Opt-Out Options</h3>
        <p>You can:</p>
        <ul>
          <li>Disable marketing emails by clicking "unsubscribe" in any email.</li>
          <li>Disconnect third-party advertising platforms via your account settings.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">6. Security</h2>
        <p>
          We implement industry-standard security measures to protect your data from unauthorized access, alteration, 
          disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% 
          secure. You use Valkyrie at your own risk.
        </p>

        <h2 className="text-2xl font-semibold mt-8">7. Cookies and Tracking Technologies</h2>
        <p>
          Valkyrie uses cookies and similar technologies to enhance your experience, analyze usage, and provide personalized 
          content. You can manage cookie preferences in your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8">8. International Users</h2>
        <p>
          If you are accessing Valkyrie from outside the United Kingdom, please note that your data may be transferred to, 
          stored, and processed in the United States or other countries where our servers are located.
        </p>

        <h2 className="text-2xl font-semibold mt-8">9. Third-Party Links</h2>
        <p>
          The Service may contain links to third-party websites or services. Valkyrie is not responsible for the privacy 
          practices or content of these third parties.
        </p>

        <h2 className="text-2xl font-semibold mt-8">10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. Any changes will be 
          effective upon posting at www.valkyriehub.com/privacy. Your continued use of the Service constitutes acceptance 
          of the updated policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8">11. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
        <p>Email:{" "}
          <a href="mailto:support@valkyriehub.com" className="text-primary hover:underline">
            support@valkyriehub.com
          </a>
        </p>
        <p>Website: www.valkyriehub.com</p>
      </div>
    </PageLayout>
  );
}
