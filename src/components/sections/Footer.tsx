export function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="container text-center">
        <p className="text-base text-muted-foreground">
          © 2026 GenAI People. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a
            href="/privacy"
            className="text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-muted-foreground/30">|</span>
          <a
            href="/terms"
            className="text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
