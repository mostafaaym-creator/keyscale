import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, FilePlus2 } from 'lucide-react';

export const RequestPage: React.FC = () => {
  const [type, setType] = useState('new_keyboard');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>Community Research Submissions</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
          Data Requests & Submissions
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Help expand Keyscale's verified catalog by suggesting missing keyboard models, submitting documentation, or reporting correction requests.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Submission Queued for Review</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Thank you! Your submission has been entered into the Keyscale research queue for verification against primary manufacturer documentation.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setBrand('');
                setModel('');
                setSourceUrl('');
                setNotes('');
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Request Category
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              >
                <option value="new_keyboard">Request Missing Keyboard</option>
                <option value="correction">Report Inaccurate Dimensions</option>
                <option value="price_error">Report Stale / Incorrect Price</option>
                <option value="new_source">Submit Specification Evidence / PDF</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Brand / Manufacturer *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="e.g. Wooting, Keychron, Razer"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Model & Variant *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. 80HE, Apex Pro Gen 3"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Evidence / Specification Source URL
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Link to official manufacturer manual, PDF, product page, or lab review.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Additional Notes / Measurements
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Provide any specific details, measured dimensions with calipers, or packaging observations..."
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Research Queue</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
