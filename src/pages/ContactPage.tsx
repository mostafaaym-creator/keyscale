import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
          Contact the Keyscale Team
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Have feedback on our comparison tools, hardware measurements, or want to partner on verified gear testing? Send us a message.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Message Delivered</h3>
            <p className="text-xs text-zinc-500">
              Thank you for reaching out! We typically respond within 1–2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Name"
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your note or question..."
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
