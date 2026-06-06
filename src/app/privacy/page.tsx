import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'AI Toolbox privacy policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect information you provide directly to us when you create an account, use our
            services, or communicate with us. This includes:
          </p>
          <ul className="mt-3 space-y-1.5 text-muted-foreground">
            <li>• Account information (name, email address, password hash)</li>
            <li>• Authentication tokens from third-party OAuth providers (Google, GitHub)</li>
            <li>• Chat messages and conversation history generated through our platform</li>
            <li>• Image generation prompts and generated image URLs</li>
            <li>• Usage statistics and activity logs for service improvement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services:
          </p>
          <ul className="mt-3 space-y-1.5 text-muted-foreground">
            <li>• Authenticating your identity and maintaining your session</li>
            <li>• Processing AI requests via OpenAI and Replicate APIs on your behalf</li>
            <li>• Storing your conversation and generation history for retrieval</li>
            <li>• Sending service-related communications (account alerts, security notices)</li>
            <li>• Monitoring and enforcing usage limits per subscription plan</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            AI Toolbox relies on the following third-party services to function. By using our
            platform, you also agree to their respective privacy policies:
          </p>
          <ul className="mt-3 space-y-1.5 text-muted-foreground">
            <li>
              • <strong className="text-foreground">OpenAI</strong> — Processes chat and
              summarisation requests. Your prompts are sent to OpenAI&apos;s API.
            </li>
            <li>
              • <strong className="text-foreground">Replicate</strong> — Processes image
              generation requests. Your prompts are sent to Replicate&apos;s API.
            </li>
            <li>
              • <strong className="text-foreground">Stripe</strong> — Handles payment processing
              for Pro subscriptions. We never store your card details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your account information and usage history for as long as your account is
            active. You may request deletion of your account and all associated data at any time
            by contacting our support team. Chat histories and image generation records are
            deleted within 30 days of account deletion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures to protect your information:
            bcrypt password hashing, HTTPS-only transport, secure session tokens, and
            environment-based API key management. However, no method of transmission over the
            internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to access, correct, or delete your personal data. To exercise
            these rights or ask questions about this policy, contact us at{' '}
            <a
              href="mailto:privacy@ai-toolbox.example.com"
              className="text-primary underline hover:no-underline"
            >
              privacy@ai-toolbox.example.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by email or by placing a notice on our website. Your continued use of the
            service after changes constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  );
}
