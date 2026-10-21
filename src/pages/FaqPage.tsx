import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'How does Keyscale compare keyboards at the same scale?',
      a: 'All keyboard models in Keyscale store exact millimeter dimensions (Width × Depth × Height). Our SVG 2D engine maps 1 mm to a uniform vector scale factor, allowing users to accurately overlay silhouettes or place keyboards side-by-side without artificial distortion.'
    },
    {
      q: 'Are the keyboard outlines exact 3D scans or bounding silhouettes?',
      a: 'Keyscale displays verified physical bounding boxes and outer chassis boundaries. We never invent proprietary manufacturer bezels or corner curvature without verified CAD or physical caliper measurement.'
    },
    {
      q: 'Where do the retailer prices come from?',
      a: 'Prices in Keyscale are collected directly from identifiable public retailer listings (such as official manufacturer webstores, Amazon, Jarir, Newegg, Best Buy, and Games World). Prices are never guessed by an AI model, and each price displays its check date and retailer link.'
    },
    {
      q: 'How does the Find Similar algorithm rank keyboards?',
      a: 'Our similarity algorithm uses a deterministic weighted model prioritizing physical chassis dimensions (width, depth, height, and desk footprint) alongside layout form factor, weight, and switch technology.'
    },
    {
      q: 'Can I compare a keyboard that is not in the database?',
      a: 'Yes! Use our Custom Keyboard tool (/custom) or the "Custom Measurements" button in the comparison interface to enter your own measured millimeters.'
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Common questions regarding measurement accuracy, data provenance, and comparison controls.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-2"
          >
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">Q:</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed ps-5">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
