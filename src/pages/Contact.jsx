import { useState } from 'react'
import { notify } from '../components/notificationService'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    notify.info('Contact support directly at support@asclepius.com')
  }

  return (
    <main className="page-container text-[#1f1f1f]">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#46a300]">Contact</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] md:text-6xl">We’re here to help.</h1>
        <p className="mt-5 text-lg leading-7 text-[#4b5563]">Questions about your appointments or account? Send our support team a message.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <section className="space-y-4">
          {[
            ['Email', 'support@asclepius.com'],
            ['Phone', '+91 7499759868'],
            ['Support hours', 'Every day, 24 hours']
          ].map(([label, value], index) => (
            <article key={label} className="rounded-[28px] border border-[#dfe8d9] bg-gradient-to-br from-white to-[#f5faf3] p-6 transition hover:border-[#58cc02] hover:shadow-[0_18px_38px_rgba(88,204,2,0.08)]">
              <p className="text-xs font-black tracking-[0.25em] text-[#46a300]">0{index + 1}</p>
              <h2 className="mt-4 text-lg font-black">{label}</h2>
              <p className="mt-1 text-[#4b5563]">{value}</p>
            </article>
          ))}
        </section>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-[#dfe8d9] bg-white p-6 shadow-[0_18px_38px_rgba(88,204,2,0.05)] md:p-8">
          <label className="block text-sm text-[#374151]">
            Name
            <input
              required
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="mt-2 w-full rounded-xl border border-[#dfe8d9] bg-white px-4 py-3 text-[#1f1f1f] outline-none transition placeholder:text-[#6b7280] focus:border-[#58cc02]"
            />
          </label>
          <label className="block text-sm text-[#374151]">
            Email
            <input
              required
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              className="mt-2 w-full rounded-xl border border-[#dfe8d9] bg-white px-4 py-3 text-[#1f1f1f] outline-none transition placeholder:text-[#6b7280] focus:border-[#58cc02]"
            />
          </label>
          <label className="block text-sm text-[#374151]">
            Subject
            <input
              required
              value={formData.subject}
              onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
              className="mt-2 w-full rounded-xl border border-[#dfe8d9] bg-white px-4 py-3 text-[#1f1f1f] outline-none transition placeholder:text-[#6b7280] focus:border-[#58cc02]"
            />
          </label>
          <label className="block text-sm text-[#374151]">
            Message
            <textarea
              required
              rows="5"
              value={formData.message}
              onChange={(event) => setFormData({ ...formData, message: event.target.value })}
              className="mt-2 w-full resize-y rounded-xl border border-[#dfe8d9] bg-white px-4 py-3 text-[#1f1f1f] outline-none transition placeholder:text-[#6b7280] focus:border-[#58cc02]"
            />
          </label>
          <button type="submit" className="rounded-full bg-[#58cc02] px-6 py-3 font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#46a300]">Send message</button>
        </form>
      </div>
    </main>
  )
}

export default Contact
