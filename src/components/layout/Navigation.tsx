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
      const isScrolled = window.scrollY > 12;
      setScrolled(isScrolled);
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

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

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
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'transition-all duration-300 ease-out',
              scrolled || open
                ? 'bg-background/85 backdrop-blur-xl border-b border-neutral-200/70 dark:border-neutral-800/80 shadow-xs'
                : 'bg-background/60 backdrop-blur-sm border-b border-transparent'
            )}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 lg:h-20">
                {/* Logo/Name */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0"
                >
                  <Link
                    href="/"
                    className="text-xl lg:text-2xl font-serif font-bold text-primary hover:text-accent transition-colors duration-200 tracking-tight"
                  >
                    {siteTitle}
                  </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                  <div className="ml-6 lg:ml-10 flex items-center space-x-4 lg:space-x-6">
                    <div className="flex items-center space-x-1.5 lg:space-x-2">
                      {items.map((item) => {
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
                              'relative px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:text-primary',
                              isActive
                                ? 'text-accent font-semibold'
                                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70'
                            )}
                          >
                            <span className="relative z-10">{item.title}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-accent/12 dark:bg-accent/15 rounded-xl border border-accent/25"
                                initial={false}
                                transition={{
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 30
                                }}
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800" />
                    <ThemeToggle />
                  </div>
                </div>

                {/* Mobile menu button and theme toggle */}
                <div className="md:hidden flex items-center space-x-2">
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors duration-200">
                    <span className="sr-only">Open main menu</span>
                    <motion.div
                      animate={{ rotate: open ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </motion.div>
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
                  className="md:hidden bg-background/95 backdrop-blur-xl border-b border-neutral-200/70 dark:border-neutral-800 shadow-lg overflow-hidden"
                >
                  <div className="px-4 pt-2 pb-4 space-y-1.5">
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
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Disclosure.Button
                            as={Link}
                            href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(item.href === '/' ? '' : `#${item.target}`)}
                            className={cn(
                              'block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200',
                              isActive
                                ? 'text-accent bg-accent/10 font-semibold border-l-4 border-accent'
                                : 'text-neutral-600 dark:text-neutral-300 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800/70'
                            )}
                          >
                            {item.title}
                          </Disclosure.Button>
                        </motion.div>
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
