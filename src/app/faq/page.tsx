import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <HelpCircle className="text-primary" size={24} />
        </div>
        <h1 className="text-4xl font-bold text-primary-text">Frequently Asked Questions</h1>
      </div>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-surface border border-border-light rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary-text mb-3">{faq.question}</h2>
            <p className="text-secondary-text leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "What is FreeIPTV Web?",
    answer: "FreeIPTV Web is a modern, client-side web application designed to act as a media player. It allows users to parse and play their own M3U playlists in a clean, ad-free, and lag-less environment directly from their browser."
  },
  {
    question: "Do you host any TV channels or movies?",
    answer: "No. We strictly operate as a media player interface. We do not host, broadcast, or distribute any video streams, movies, or copyrighted content on our servers."
  },
  {
    question: "How do I add my own channels?",
    answer: "You can navigate to the 'My Playlists' section using the sidebar menu. From there, you can drag and drop your .m3u file into the application. It will be saved securely within your browser for future use."
  },
  {
    question: "Why is a channel buffering or failing to play?",
    answer: "Stream stability depends entirely on the source of the M3U link you provided. If a channel fails to load, it might be offline, experiencing high traffic, or geo-blocked by your internet service provider. You can try switching the 'Video Engine' in the Settings or using a VPN to bypass geo-blocks."
  },
  {
    question: "Is my personal data safe?",
    answer: "Yes! FreeIPTV Web is a privacy-first application. All of your playlists, favorite channels, and application settings are stored completely offline in your local browser storage. We do not collect or transmit your data to any remote servers."
  },
  {
    question: "Is this application really free?",
    answer: "Absolutely. The application is 100% free, open-source, and contains zero advertisements. Our goal is to provide the best viewing experience without monetizing our users."
  }
];
