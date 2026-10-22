'use client';

interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="swiss-rule-t bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          <p>
            © {new Date().getFullYear()} XINYE LI · THE CHINESE UNIVERSITY OF HONG KONG
          </p>
          <p>
            REVISION // {lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>
    </footer>
  );
}
