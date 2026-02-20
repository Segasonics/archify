import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ComparisonSlider from '../components/project/ComparisonSlider';
import { PLANS } from '../lib/constants';

const demoBefore =
  'https://www.homeplansindia.com/uploads/1/8/8/6/18862562/hfp-4003-first-floor_orig.jpg';
const demoAfter =
  'https://ik.imagekit.io/2da1gerza/ChatGPT%20Image%20Feb%2019,%202026,%2004_14_25%20PM.png?updatedAt=1771498511760';

const features = [
  {
    title: 'Photoreal 2D Render Engine',
    description:
      'Convert floor plans into polished, presentation-ready images with realistic materials, light, and depth.',
    tag: 'Core output',
    impact: '1 credit per image',
  },
  {
    title: 'Modern Furnishing Styles',
    description:
      'Apply curated visual directions such as Minimal, Scandinavian, Industrial, and Contemporary.',
    tag: 'Style system',
    impact: 'Consistent design language',
  },
  {
    title: 'Fast Multi-Image Generation',
    description:
      'Generate multiple variants in one run so teams can compare design options without repeating setup.',
    tag: 'Speed',
    impact: 'Up to 12 images per request',
  },
  {
    title: 'Project History and Revisions',
    description:
      'Track uploads, statuses, and previous generations to maintain a reliable review trail for every project.',
    tag: 'Traceability',
    impact: 'Centralized timeline',
  },
  {
    title: 'Before / After Comparison',
    description:
      'Review blueprint vs rendered output instantly using the interactive slider for quicker stakeholder feedback.',
    tag: 'Review',
    impact: 'Visual validation in seconds',
  },
  {
    title: 'SaaS Billing and Controls',
    description:
      'Plan-based credit limits, Stripe checkout, and webhook sync keep subscription management production-ready.',
    tag: 'Monetization',
    impact: 'Free / Pro / Team tiers',
  },
];

const workflowSteps = [
  {
    title: 'Upload blueprint',
    description:
      'Drop a PNG, JPG, or PDF floor plan into your project and keep the original as your baseline reference.',
    meta: 'Input: 2D floor plan',
  },
  {
    title: 'Choose style',
    description:
      'Pick a curated design direction so every render follows a consistent interior language and mood.',
    meta: 'Style presets: Modern, Scandinavian, Industrial',
  },
  {
    title: 'Generate variants',
    description:
      'Run multi-image generation to produce several photoreal options from the same structural layout.',
    meta: 'Output: 1 to 12 renders',
  },
  {
    title: 'Review and deliver',
    description:
      'Compare before and after with the slider, select best variants, then download for client review.',
    meta: 'Comparison + download ready',
  },
];

const planHighlights = {
  free: [
    '20 monthly generation credits',
    'Blueprint upload and project history',
    'Before/after comparison viewer',
  ],
  pro: [
    '300 monthly generation credits',
    'Priority processing and richer variants',
    'Ideal for solo professionals',
  ],
  team: [
    '1200 monthly generation credits',
    'Built for high-volume studio workflows',
    'Best for collaboration-heavy delivery',
  ],
};

const testimonials = [
  {
    quote:
      'Archify cut our concept-approval cycle from 3 days to a single review call.',
    name: 'Maya Thompson',
    role: 'Design Studio Lead',
    metric: '42% faster approvals',
  },
  {
    quote:
      'Clients understand our proposals instantly when they can slide blueprint to render.',
    name: 'Daniel Cruz',
    role: 'Freelance Architect',
    metric: '10+ variants per project',
  },
  {
    quote:
      'The project history and downloadable outputs made our internal handoff far cleaner.',
    name: 'Nina Patel',
    role: 'Property Visualization Manager',
    metric: 'Single source of truth',
  },
];

const faqs = [
  {
    q: 'How many renders can I generate?',
    a: 'You get monthly credits based on your plan. Each output image uses one credit.',
  },
  {
    q: 'Can I upload PDFs?',
    a: 'Yes. Archify supports PNG, JPG, and PDF blueprint uploads up to 15MB.',
  },
  {
    q: 'Is this production ready?',
    a: 'The app includes auth hardening, validation, rate limiting, Stripe webhooks, and provider abstractions.',
  },
];

function LandingPage() {
  return (
    <div className="workspace-shell text-sand-900">
      <section
        id="top-hero"
        className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:min-h-[calc(100vh-72px)] lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-8"
      >
        <div>
          <p className="inline-flex rounded-full border border-wood-300/50 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-wood-500">
            Archify Studio
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-sand-900 sm:text-5xl lg:text-6xl">
            Convert floor plans into premium photoreal visuals.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-sand-700 sm:text-lg">
            Upload a blueprint, pick a modern interior direction, and generate elegant 2D photoreal
            renders your clients can review in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth/register">
              <Button className="px-6 py-3 text-sm" variant="primary">
                Start Free Trial
              </Button>
            </Link>
            <a href="#demo">
              <Button className="px-6 py-3 text-sm" variant="secondary">
                See Demo
              </Button>
            </a>
          </div>
          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-xl border border-sand-300/90 bg-white/60 p-3">
              <p className="text-lg font-semibold text-sand-900">2D</p>
              <p className="text-xs text-sand-700">Photoreal</p>
            </div>
            <div className="rounded-xl border border-sand-300/90 bg-white/60 p-3">
              <p className="text-lg font-semibold text-sand-900">10x</p>
              <p className="text-xs text-sand-700">Faster client reviews</p>
            </div>
            <div className="rounded-xl border border-sand-300/90 bg-white/60 p-3">
              <p className="text-lg font-semibold text-sand-900">Cloud</p>
              <p className="text-xs text-sand-700">Project history</p>
            </div>
          </div>
        </div>

        <Card className="relative overflow-hidden border border-transparent bg-[linear-gradient(var(--landing-surface),var(--landing-surface))_padding-box,linear-gradient(135deg,rgba(141,107,79,0.62),rgba(255,244,227,0.95),rgba(141,107,79,0.48))_border-box] p-6 shadow-[0_24px_60px_rgba(91,74,53,0.22)] sm:p-7">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-wood-200/65 blur-3xl animate-pulseSoft" />
          <div className="absolute -bottom-12 left-6 h-44 w-44 rounded-full bg-sand-200/80 blur-3xl animate-drift" />
          <p className="inline-flex rounded-full border border-wood-300/60 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
            Interactive Demo
          </p>
          <h3 className="mt-3 text-lg font-semibold text-sand-900">Live Before / After Preview</h3>
          <p className="mt-2 text-sm text-sand-700">
            Hover or drag to compare blueprint vs generated render.
          </p>
          <div className="mt-4 rounded-2xl border border-wood-300/45 bg-white/75 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_14px_32px_rgba(91,74,53,0.16)]">
            <ComparisonSlider
              beforeImage={demoBefore}
              afterImage={demoAfter}
              mode="hover"
              tone="warm"
              imageClassName="h-[260px] sm:h-[300px] lg:h-[320px]"
            />
          </div>
        </Card>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full border border-wood-300/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
              Workflow
            </p>
            <h2 className="mt-3 text-3xl font-bold text-sand-900">How it works</h2>
            <p className="mt-2 max-w-2xl text-sm text-sand-700">
              A simple production flow from raw blueprint to client-ready photoreal visuals.
            </p>
          </div>
          <a
            href="#demo"
            className="rounded-lg border border-sand-300 bg-white/70 px-4 py-2 text-sm font-semibold text-sand-900 transition hover:border-wood-300 hover:text-wood-700"
          >
            Try interactive demo
          </a>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, idx) => (
            <div key={step.title} className="relative">
              <Card className="relative border border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,250,242,0.96))] p-5">
                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-sand-200/60 blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-wood-300 bg-white text-sm font-semibold text-wood-700 shadow-[0_0_0_4px_rgba(141,107,79,0.14)]">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-sand-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sand-700">{step.description}</p>
                  <p className="mt-4 border-t border-sand-300/80 pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-wood-600">
                    {step.meta}
                  </p>
                </div>
              </Card>

              {idx < workflowSteps.length - 1 ? (
                <>
                  <div className="pointer-events-none absolute left-1/2 top-full h-6 w-px -translate-x-1/2 bg-gradient-to-b from-wood-300/80 to-wood-200/10 lg:hidden" />
                  <div className="pointer-events-none absolute left-[calc(100%+2px)] top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-wood-300/90 to-wood-200/20 lg:block" />
                  <div className="pointer-events-none absolute left-[calc(100%+26px)] top-1/2 hidden h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[8px] border-y-transparent border-l-wood-400 lg:block" />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full border border-wood-300/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
              Capability Stack
            </p>
            <h2 className="mt-3 text-3xl font-bold text-sand-900">Feature highlights</h2>
            <p className="mt-2 max-w-2xl text-sm text-sand-700">
              Built for architects and interior teams who need fast visual outputs without losing
              layout intent or project traceability.
            </p>
          </div>
          <a
            href="#pricing"
            className="rounded-lg border border-sand-300 bg-white/70 px-4 py-2 text-sm font-semibold text-sand-900 transition hover:border-wood-300 hover:text-wood-700"
          >
            See pricing limits
          </a>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,250,242,0.95))] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-wood-300 hover:shadow-[0_18px_38px_rgba(91,74,53,0.16)]"
            >
              <div
                className={`absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl ${
                  index % 2 === 0 ? 'bg-wood-200/45' : 'bg-sand-200/70'
                }`}
              />
              <p className="inline-flex rounded-full border border-sand-300 bg-white/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sand-700">
                {feature.tag}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-sand-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand-700">{feature.description}</p>
              <div className="mt-4 border-t border-sand-300/80 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-wood-600">
                  Impact
                </p>
                <p className="mt-1 text-sm font-medium text-sand-900">{feature.impact}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-transparent bg-[linear-gradient(#fffaf2,#fffaf2)_padding-box,linear-gradient(145deg,rgba(141,107,79,0.62),rgba(255,245,228,0.98),rgba(141,107,79,0.5))_border-box] p-5 shadow-[0_28px_68px_rgba(91,74,53,0.2)] sm:p-7">
          <div className="absolute -right-14 top-4 h-40 w-40 rounded-full bg-wood-200/60 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-sand-200/80 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[300px_1fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-wood-300/60 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
                Interactive Demo
              </p>
              <h2 className="mt-3 text-3xl font-bold text-sand-900">See blueprint become render</h2>
              <p className="mt-2 text-sm leading-relaxed text-sand-700">
                Slide to reveal generated output while preserving room layout and structure from the
                original floor plan.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-sand-300 bg-white/75 px-3 py-1 text-xs font-medium text-sand-800">
                  Before: Blueprint
                </span>
                <span className="rounded-full border border-wood-300/70 bg-wood-100/70 px-3 py-1 text-xs font-medium text-wood-700">
                  After: Photoreal
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-wood-300/45 bg-white/80 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_36px_rgba(91,74,53,0.16)]">
              <ComparisonSlider
                beforeImage={demoBefore}
                afterImage={demoAfter}
                tone="warm"
                imageClassName="h-[280px] sm:h-[340px] lg:h-[380px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full border border-wood-300/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
              Pricing Plans
            </p>
            <h2 className="mt-3 text-3xl font-bold text-sand-900">Simple credits, predictable cost</h2>
            <p className="mt-2 max-w-2xl text-sm text-sand-700">
              Pick a plan based on your monthly render volume. Upgrade anytime as your workflow scales.
            </p>
          </div>
          <p className="rounded-lg border border-sand-300 bg-white/70 px-4 py-2 text-sm font-semibold text-sand-900">
            Monthly billing
          </p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card
              key={key}
              className={`relative overflow-hidden border p-6 ${
                key === 'pro'
                  ? 'border-wood-300/80 bg-[linear-gradient(180deg,#fff8ec,#fff2dd)] shadow-[0_20px_40px_rgba(107,79,49,0.18)]'
                  : 'border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,250,242,0.96))]'
              }`}
            >
              {key === 'pro' ? (
                <p className="absolute right-4 top-4 rounded-full border border-wood-300/70 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-wood-600">
                  Most Popular
                </p>
              ) : null}
              <p className="text-lg font-semibold text-sand-900">{plan.name}</p>
              <p className="mt-2 text-3xl font-bold text-sand-900">{plan.price}</p>
              <p className="mt-2 text-sm text-sand-700">{plan.description}</p>
              <p className="mt-4 text-sm font-medium text-wood-500">
                {plan.credits} credits / month
              </p>
              <ul className="mt-4 space-y-2 border-t border-sand-300/80 pt-4">
                {planHighlights[key].map((item) => (
                  <li key={item} className="text-sm text-sand-800">
                    <span className="mr-2 text-wood-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/auth/register" className="mt-5 inline-block">
                <Button variant={key === 'pro' ? 'primary' : 'secondary'}>
                  Choose {plan.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full border border-wood-300/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold text-sand-900">Trusted by design professionals</h2>
          </div>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Card
              key={item.name}
              className="relative overflow-hidden border border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,250,242,0.96))] p-5"
            >
              <div
                className={`absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl ${
                  index % 2 === 0 ? 'bg-wood-200/45' : 'bg-sand-200/70'
                }`}
              />
              <p className="relative text-sm leading-relaxed text-sand-800">"{item.quote}"</p>
              <div className="relative mt-4 border-t border-sand-300/80 pt-3">
                <p className="text-sm font-semibold text-sand-900">{item.name}</p>
                <p className="text-xs text-sand-700">{item.role}</p>
                <p className="mt-2 inline-flex rounded-full border border-wood-300/70 bg-wood-100/65 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-wood-700">
                  {item.metric}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full border border-wood-300/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold text-sand-900">Frequently asked questions</h2>
          </div>
        </div>
        <div className="mt-7 space-y-3">
          {faqs.map((item) => (
            <Card
              key={item.q}
              className="border border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,250,242,0.96))] p-0"
            >
              <details className="group px-5 py-4">
                <summary className="cursor-pointer list-none pr-8 font-semibold text-sand-900 marker:content-['']">
                  {item.q}
                  <span className="absolute right-5 top-4 text-lg text-wood-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 border-t border-sand-300/80 pt-3 text-sm leading-relaxed text-sand-700">
                  {item.a}
                </p>
              </details>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
