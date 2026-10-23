import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveDemo from '@/components/InteractiveDemo';
import {
  MessageSquare,
  SlidersHorizontal,
  Code2,
  Database,
  ArrowRight,
  Sparkles,
  Layers,
  Share2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Transform Static Forms into Conversational Experiences</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Turn Boring Web Forms Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Engaging Chat Experiences
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Build custom forms with text, email, multiple-choice, and yes/no questions.
              Embed them as a floating chat widget on any website with a single JavaScript snippet.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                <span>Get Started in Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
              >
                Try Live Demo
              </a>
            </div>
          </div>
        </section>

        {/* Live Interactive Demo Section */}
        <section id="demo" className="py-16 bg-white border-y border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Experience It in Action
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                This is the exact chatbot widget your visitors will interact with. Try responding below!
              </p>
            </div>
            <InteractiveDemo />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Everything You Need to Collect Responses
              </h2>
              <p className="mt-3 text-base text-slate-600">
                A streamlined workflow designed to boost form completion rates effortlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-5">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Visual Form Builder</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Add text, email, multiple-choice, and yes/no questions with reordering and required validation controls.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-5">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">One Question at a Time</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Conversational chat UI keeps respondents focused, decreasing drop-offs and cognitive fatigue.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-5">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Embed Snippet</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Drop a single <code>&lt;script&gt;</code> tag into any HTML site or React/Vue app to launch a floating widget.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-5">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Live Response Tracking</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Inspect incoming submissions with timestamps, question answers, and completion records in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">How It Works</h2>
              <p className="mt-3 text-base text-slate-600">
                Go from zero to live conversational form in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Build Your Form</h3>
                <p className="text-sm text-slate-600">
                  Configure your question fields, set requirements, and customize bot messages and color theme.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Publish & Share</h3>
                <p className="text-sm text-slate-600">
                  Publish your form to generate a standalone public URL or grab the JavaScript embed snippet.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Review Submissions</h3>
                <p className="text-sm text-slate-600">
                  View aggregated response totals and drill down into individual user answers in the dashboard.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Create Your First Form Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}