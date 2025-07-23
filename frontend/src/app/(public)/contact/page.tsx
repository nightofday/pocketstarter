import { createMetadata } from '@/config/seo'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with our team. We\'re here to help and answer any questions you may have.',
})

export default function ContactPage() {

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            Get in Touch
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground font-medium max-w-3xl mx-auto">
            Have questions, feedback, or need support? We&apos;d love to hear from you. 
            Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </div>
  )
} 