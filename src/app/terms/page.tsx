import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Scale className="text-primary" size={24} />
        </div>
        <h1 className="text-4xl font-bold text-primary-text">Terms of Service</h1>
      </div>
      
      <div className="bg-surface border border-border-light rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <p className="text-secondary-text leading-relaxed">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">1. Acceptance of Terms</h2>
          <p className="text-secondary-text leading-relaxed">
            By accessing and using FreeIPTV Web, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, you must not use this application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">2. Service Description</h2>
          <p className="text-secondary-text leading-relaxed">
            FreeIPTV Web is a client-side media player interface designed to parse and play M3U playlists. We do not host, broadcast, or distribute any video streams, movies, or copyrighted content on our servers. The application is solely a tool provided for users to play their own legally obtained content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">3. User Responsibilities</h2>
          <p className="text-secondary-text leading-relaxed">
            You are entirely responsible for the content you access through this application. You agree that you will only load playlists and streams that you have the legal right to access. We explicitly disclaim any liability for copyright infringement or illegal streaming activities conducted by users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">4. "As-Is" Provision</h2>
          <p className="text-secondary-text leading-relaxed">
            The service is provided "as is" and "as available", without warranty of any kind, express or implied. We do not guarantee that the application will be uninterrupted, secure, or error-free, nor do we guarantee the availability, reliability, or quality of any third-party streams loaded by the user.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary-text mb-4">5. Limitation of Liability</h2>
          <p className="text-secondary-text leading-relaxed">
            In no event shall the developers, maintainers, or contributors of FreeIPTV Web be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of this application or the inability to use it.
          </p>
        </section>
      </div>
    </div>
  );
}
