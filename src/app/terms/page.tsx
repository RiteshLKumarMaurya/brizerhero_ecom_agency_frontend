// app/terms/page.tsx
export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 prose dark:prose-invert prose-zinc">
      <h1>Terms & Conditions</h1>
      <p className="lead">Effective from: {new Date().toLocaleDateString()}</p>
      <p>
        Welcome to <strong>BrizerHero</strong>! These Terms govern your use of our website and services. 
        By accessing our site or purchasing any service, you agree to be bound by these Terms.
      </p>

      <h2>1. Our Services</h2>
      <p>
        BrizerHero provides website development, app creation, software solutions, and related digital services. 
        All projects are custom – deliverables, timelines, and pricing will be outlined in a separate agreement or proposal.
      </p>

      <h2>2. Intellectual Property</h2>
      <ul>
        <li><strong>Before final payment:</strong> All code, designs, and content remain the property of BrizerHero.</li>
        <li><strong>After full payment:</strong> We transfer ownership of the final deliverables to you (client). However, we retain the right to showcase the work in our portfolio unless otherwise agreed.</li>
        <li>Any third-party assets (plugins, fonts, images) are licensed under their respective terms.</li>
      </ul>

      <h2>3. Payments & Refunds</h2>
      <p>
        We require an advance (typically 50%) to start work. The remaining balance is due before final delivery.
        Refunds are handled according to our <a href="/refund">Refund Policy</a> – generally, no refunds for completed work, but partial refunds may be issued for undelivered milestones.
      </p>

      <h2>4. Cancellation</h2>
      <p>
        You may cancel a project at any time. However, any work already completed will be billed, and the advance is non‑refundable unless we fail to meet agreed deadlines. See our <a href="/cancellation">Cancellation Policy</a> for details.
      </p>

      <h2>5. Client Responsibilities</h2>
      <p>
        You agree to provide all necessary content (text, images, logos, access credentials) in a timely manner. 
        Delays caused by the client may extend the project timeline.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, BrizerHero shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount you paid us in the previous 6 months.
      </p>

      <h2>7. Warranties & Disclaimer</h2>
      <p>
        We strive to deliver bug‑free code, but we do not warrant that our work will be error‑free or uninterrupted. 
        We provide a 30‑day post‑launch support period for fixing defects caused by our work.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bihar, India.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We may revise these Terms from time to time. Continued use of our services after changes constitutes acceptance of the new Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions? Email us at <strong>brizerhero@gmail.com</strong> or call <strong>+91 8651600737</strong>.
      </p>
    </main>
  );
}