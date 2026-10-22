'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SiteConfig } from '@/lib/config';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  enableOnePageMode?: boolean;
}

export default function Navigation({ items, siteTitle, enableOnePageMode }: NavigationProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (enableOnePageMode) {
      setActiveHash(window.location.hash);
      const handleHashChange = () => setActiveHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveHash(id === 'about' ? '' : `#${id}`);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      });

      items.forEach(item => {
        if (item.type === 'page') {
          const element = document.getElementById(item.target);
          if (element) observer.observe(element);
        }
      });

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        observer.disconnect();
      };
    }
  }, [enableOnePageMode, items]);

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ open }) => (
        <>
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.45 }}
            className={cn(
              'transition-all duration-300 ease-out swiss-rule-b',
              scrolled || open
                ? 'bg-background/90 backdrop-blur-xl'
                : 'bg-background/75 backdrop-blur-md'
            )}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14 lg:h-16">
                {/* Brand Monogram / Name */}
                <div className="flex items-baseline gap-3">
                  <Link
                    href="/"
                    className="text-xl lg:text-2xl font-serif font-semibold text-primary hover:text-accent transition-colors duration-200 tracking-tight"
                  >
                    {siteTitle}
                  </Link>
                  <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    PORTFOLIO & ARCHIVE
                  </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                  <div className="ml-6 lg:ml-10 flex items-center space-x-6">
                    <div className="flex items-center space-x-1 lg:space-x-2">
                      {items.map((item, idx) => {
                        const isActive = enableOnePageMode
                          ? activeHash === `#${item.target}` || (!activeHash && item.target === 'about')
                          : (item.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(item.href));

                        const href = enableOnePageMode
                          ? `/#${item.target}`
                          : item.href;

                        return (
                          <Link
                            key={item.title}
                            href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(`#${item.target}`)}
                            className={cn(
                              'relative px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200',
                              isActive
                                ? 'text-primary font-semibold'
                                : 'text-neutral-500 hover:text-primary'
                            )}
                          >
                            <span className="text-[10px] text-accent mr-1">0{idx + 1}.</span>
                            <span>{item.title}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute left-3 right-3 bottom-0 h-[1.5px] bg-primary"
                                initial={false}
                                transition={{
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 35,
                                }}
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="h-4 w-px bg-[var(--hairline)]" />
                    <ThemeToggle />
                  </div>
                </div>

                {/* Mobile menu button and theme toggle */}
                <div className="md:hidden flex items-center space-x-2">
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary focus:outline-none transition-colors duration-200">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-5 w-5" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {open && (
              <Disclosure.Panel static>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="md:hidden bg-background/95 backdrop-blur-xl swiss-rule-b overflow-hidden"
                >
                  <div className="px-4 py-3 divide-y divide-[var(--hairline)]">
                    {items.map((item, index) => {
                      const isActive = enableOnePageMode
                        ? (item.href === '/' ? pathname === '/' && !activeHash : activeHash === `#${item.target}`)
                        : (item.href === '/'
                          ? pathname === '/'
                          : pathname.startsWith(item.href));

                      const href = enableOnePageMode
                        ? (item.href === '/' ? '/' : `/#${item.target}`)
                        : item.href;

                      return (
                        <Disclosure.Button
                          key={item.title}
                          as={Link}
                          href={href}
                          prefetch={true}
                          onClick={() => enableOnePageMode && setActiveHash(item.href === '/' ? '' : `#${item.target}`)}
                          className={cn(
                            'flex items-baseline gap-3 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-150',
                            isActive
                              ? 'text-primary font-semibold'
                              : 'text-neutral-500 hover:text-primary'
                          )}
                        >
                          <span className="text-[10px] text-accent">0{index + 1}</span>
                          <span>{item.title}</span>
                        </Disclosure.Button>
                      );
                    })}
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
