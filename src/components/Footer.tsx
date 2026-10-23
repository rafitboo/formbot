'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900">FormBot</span>
            <span className="text-xs text-slate-500 ml-2">Interactive Conversational Forms</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600">How It Works</a>
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600">
              GitHub Repository
            </a>
          </div>

          <p className="text-xs text-slate-400">
            &copy; 2026 FormBot. Built for high-conversion data collection.
          </p>
        </div>
      </div>
    </footer>
  );
}