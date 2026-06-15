// app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 prose dark:prose-invert prose-zinc">
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        At <strong>BrizerHero</strong> (operated by Developer Ritesh, GST: OSMPK5329E1ZN), 
        we take your privacy seriously. This policy describes what data we collect, 
        how we use it, and your rights.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Personal data:</strong> Name, email address, phone number, billing information when you contact us or purchase a service.</li>
        <li><strong>Usage data:</strong> IP address, browser type, pages visited on our website.</li>
        <li><strong>Cookies:</strong> We use essential cookies to improve your experience.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain our services (website development, app creation, software solutions).</li>
        <li>To communicate with you about projects, support, or promotions.</li>
        <li>To comply with legal obligations (e.g., invoicing, tax records).</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>
        We never sell your personal data. We may share it only with:
      </p>
      <ul>
        <li>Trusted third-party services (payment gateways, hosting providers) who are contractually bound to protect your data.</li>
        <li>Law enforcement if required by law.</li>
      </ul>

      <h2>4. Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your data. Contact us at <strong>brizerhero@gmail.com</strong>.
        We will respond within 30 days.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement industry-standard measures (SSL encryption, firewalls, regular updates) to protect your data. 
        However, no internet transmission is 100% secure.
      </p>

      <h2>6. Children’s Privacy</h2>
      <p>
        Our services are not directed to children under 13. We do not knowingly collect data from minors.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this policy occasionally. The latest version will always be posted here with a new effective date.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        BrizerHero<br />
        📧 brizerhero@gmail.com<br />
        📞 +91 8651600737<br />
        📍 Harigaon, near Mahathin Ma Temple, Bihar, India
      </p>
    </main>
  );
}