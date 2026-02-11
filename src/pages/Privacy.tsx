export default function Privacy() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="container max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          <p>
            We collect the information you submit in our forms so we can share the roadmap video,
            follow up about mentoring, and improve our services.
          </p>
          <p>
            We do not sell your personal information. Data may be processed by trusted tools used
            for analytics, communication, and form handling.
          </p>
          <p>
            If you want your information updated or deleted, contact us through our official support
            channels.
          </p>
        </div>
      </div>
    </main>
  );
}

