import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="text-primary" size={24} />
        </div>
        <h1 className="text-4xl font-bold text-primary-text">Privacy Policy</h1>
      </div>
      
      <div className="bg-surface border border-border-light rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <p className="text-secondary-text leading-relaxed">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">1. Information Collection</h2>
          <p className="text-secondary-text leading-relaxed">
            FreeIPTV Web operates completely within your local browser environment. We do not collect, store, or transmit any personally identifiable information (PII), usage metrics, or viewing habits to any remote servers. Your privacy is paramount, and the application is designed to function without tracking you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">2. Local Storage & Data</h2>
          <p className="text-secondary-text leading-relaxed">
            All application data, including your M3U playlists, favorite channels, recently watched items, and application settings, are stored locally in your browser's IndexedDB and LocalStorage. This data never leaves your device unless you explicitly export it. Clearing your browser data will permanently delete this information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">3. Third-Party Services</h2>
          <p className="text-secondary-text leading-relaxed">
            The application fetches channel information and streams directly from the URLs provided in the M3U playlists you load. We have no control over the privacy practices of the servers hosting these video streams. Please be aware that accessing third-party streams may expose your IP address and user agent to those external servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">4. Cookies</h2>
          <p className="text-secondary-text leading-relaxed">
            We do not use tracking or advertising cookies. Any local storage items set by this application are strictly necessary for the core functionality of the media player and saving your local preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">5. Changes to This Policy</h2>
          <p className="text-secondary-text leading-relaxed">
            We may update our Privacy Policy from time to time. Any changes will be reflected on this page. By continuing to use the application, you agree to the revised Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
}
