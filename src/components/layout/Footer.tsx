'use client';

interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <p>
            © {new Date().getFullYear()} Xinye Li. All rights reserved.
          </p>
          <p>
            Last updated: {lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>
    </footer>
  );
}
