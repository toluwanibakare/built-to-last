import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import BookInfo from './components/BookInfo'
import Lessons from './components/Lessons'
import Preview from './components/Preview'
import Author from './components/Author'
import Preorder from './components/Preorder'
import Faq from './components/Faq'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import OrderSuccess from './components/OrderSuccess'
import ScrollToTop from './components/ui/ScrollToTop'
import IntroCurtain from './components/IntroCurtain'
import { Analytics } from '@vercel/analytics/react'

function PolicyView({ type, onClose }) {
  const policies = {
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4">
          <p>At Voice of Truth, we respect your privacy. This policy outlines how we handle your personal information.</p>
          <h2 className="text-xl font-display font-medium text-ink mt-6">Information We Collect</h2>
          <p>We collect basic information required to process your pre-order, including your full name, email address, phone number, and physical delivery address.</p>
          <h2 className="text-xl font-display font-medium text-ink mt-6">How We Use Your Data</h2>
          <p>Your data is used solely to process payment, confirm your pre-order, send updates, and ship the physical book. We do not sell or share your personal data with third parties for marketing purposes.</p>
          <h2 className="text-xl font-display font-medium text-ink mt-6">Third-Party Services</h2>
          <p>Payment details are securely processed through our integrated payment provider (Paystack). We do not store credit card credentials on our servers.</p>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      content: (
        <div className="space-y-4">
          <p>By using this website and pre-ordering Built to Last, you agree to comply with and be bound by the following terms.</p>
          <h2 className="text-xl font-display font-medium text-ink mt-6">Intellectual Property</h2>
          <p>All content on this site, including book text excerpts, descriptions, quotes, and visual media, is the property of Femi Bakare and is protected by copyright laws.</p>
          <h2 className="text-xl font-display font-medium text-ink mt-6">Pre-order Fulfillment</h2>
          <p>Pre-ordering guarantees you a paperback copy of Built to Last when the book is officially launched and printed. Launch timelines are subject to production schedules.</p>
        </div>
      ),
    },
    shipping: {
      title: 'Shipping & Refund Policy',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-display font-medium text-ink">Shipping Policy</h2>
          <p>Shipping logistics and rates will go live when the book is launched. The book is not yet launched, but production is already in motion. You will receive an email notification to coordinate delivery details once the books are ready to be dispatched.</p>
          <h2 className="text-xl font-display font-medium text-ink mt-6">Refund Policy</h2>
          <p>Refunds can only be made if the book becomes unavailable. Under worst-case scenarios, please write an email request to <a href="mailto:voiceoftruthonline@gmail.com" className="text-brass hover:underline">voiceoftruthonline@gmail.com</a> and we will work with you to resolve any issues.</p>
        </div>
      ),
    },
  }

  const active = policies[type] || policies.privacy

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-paper/95 backdrop-blur-md px-5 py-8 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-line bg-cream p-8 md:p-12 shadow-2xl my-8">
        <h1 className="font-display text-3xl md:text-4xl text-ink border-b border-line pb-4">{active.title}</h1>
        <div className="mt-8 text-base leading-relaxed text-slate space-y-6">
          {active.content}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-paper hover:bg-brass-deep transition-all duration-300 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to the site
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [order, setOrder] = useState(null)
  const [activePolicy, setActivePolicy] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [order])

  if (order) {
    return <OrderSuccess order={order} onContinue={() => setOrder(null)} />
  }

  return (
    <>
      <a
        href="#book"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <IntroCurtain />
      <Nav />
      <main>
        <Hero />
        <BookInfo />
        <Lessons />
        <Preview />
        <Author />
        <Preorder onOrderConfirmed={setOrder} />
        <Faq />
        <Newsletter />
      </main>
      <Footer onSelectPolicy={setActivePolicy} />
      <ScrollToTop />
      {activePolicy && <PolicyView type={activePolicy} onClose={() => setActivePolicy(null)} />}
      <Analytics />
    </>
  )
}