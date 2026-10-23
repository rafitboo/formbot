'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';

export default function TestEmbedPage() {
  const [formId, setFormId] = useState('');
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  const handleLoadWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim()) return;

    // Remove any previously rendered floating buttons or iframes
    const oldBtn = document.getElementById('formbot-floating-btn');
    const oldContainer = document.getElementById('formbot-container');
    if (oldBtn) oldBtn.remove();
    if (oldContainer) oldContainer.remove();

    setActiveFormId(formId.trim());
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-50 text-blue-700 px-3 py-1">
            External Website Simulation Environment
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Embed Verification</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Simulated Host Website (e.g. yourcompany.com)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Enter any published Form ID below to simulate embedding the floating chatbot widget on this host page.
            </p>
          </div>

          <form onSubmit={handleLoadWidget} className="flex gap-3">
            <input
              type="text"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              placeholder="Paste Form ID here (e.g. 71705b9a-3cea-4a8b...)"
              className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-hidden font-mono"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              Mount Widget
            </button>
          </form>

          {activeFormId && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-2">
              <p className="font-semibold">
                ✓ Floating widget script mounted for form: <span className="font-mono">{activeFormId}</span>
              </p>
              <p>
                Look at the bottom right corner of this screen. Click the blue circular button to interact with your widget!
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 space-y-4 text-slate-600 text-sm">
            <h3 className="font-semibold text-slate-900">Sample Page Content</h3>
            <p>
              The floating widget button sits anchored at the bottom-right corner regardless of host styling.
            </p>
          </div>
        </div>
      </main>

      {/* Dynamically loads widget script when user enters Form ID */}
      {activeFormId && (
        <Script
          key={activeFormId}
          src="/widget.js"
          data-form-id={activeFormId}
          data-host=""
          strategy="afterInteractive"
        />
      )}
    </div>
  );
}