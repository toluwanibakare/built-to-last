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

export default function App() {
  const [order, setOrder] = useState(null)

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
      <Footer />
    </>
  )
}