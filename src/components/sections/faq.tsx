'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQS = [
  {
    q: 'How do I receive my scripts after purchase?',
    a: 'Scripts are delivered instantly to your account dashboard and to the email used during checkout. You can download them at any time — no waiting required.',
  },
  {
    q: 'Which frameworks are supported?',
    a: 'Most of our scripts support both ESX and QBCore frameworks. Each product page clearly lists the supported frameworks in its specifications. Some scripts are framework-specific for deeper integration.',
  },
  {
    q: 'Do I get free updates?',
    a: 'Yes! Every purchase includes lifetime updates for the script. When we release new features, bug fixes, or compatibility patches, you get them at no additional cost.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Due to the digital nature of our products, refunds are handled case-by-case. If a script does not work as described and we cannot resolve the issue within 48 hours, we will issue a full refund.',
  },
  {
    q: 'How can I get support?',
    a: 'Join our Discord server — it is the fastest way to reach us. Our support team is active 24/7 and developers are regularly online to help with technical issues.',
  },
  {
    q: 'Can I customize the scripts?',
    a: 'Absolutely. All scripts are open-source and well-documented. You are free to modify them to fit your server. We just ask that you do not redistribute or resell them.',
  },
  {
    q: 'Will scripts work on my server version?',
    a: 'We test all scripts against the latest FiveM artifact and common server builds. Each product page lists the minimum server version. If you run an older artifact, reach out and we will help you out.',
  },
  {
    q: 'Do you offer bulk discounts?',
    a: 'Yes — if you are buying 3 or more scripts, contact us on Discord for a custom bundle discount. We also offer packages for new servers setting up from scratch.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-20 border-t border-border bg-card/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Everything you need to know about purchasing and using our scripts.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          defaultValue="item-0"
        >
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border rounded-xl px-5 bg-background data-[state=open]:border-primary/40 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
