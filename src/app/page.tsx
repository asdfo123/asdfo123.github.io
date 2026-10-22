import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SelectedPublications from '@/components/home/SelectedPublications';
import News, { NewsItem } from '@/components/home/News';
import Awards, { AwardItem } from '@/components/home/Awards';
import Competitions, { CompetitionItem } from '@/components/home/Competitions';
import Projects, { ProjectItem } from '@/components/home/Projects';
import Internships, { InternshipItem } from '@/components/home/Internships';
import QuickJumpNav from '@/components/home/QuickJumpNav';
import ClustrMapsGlobe from '@/components/home/ClustrMapsGlobe';
import { PageBlueprintDecor } from '@/components/ui/WorldModelArt';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';

import {
  BasePageConfig,
  PublicationPageConfig,
  TextPageConfig,
  CardPageConfig,
  SectionConfig,
  PageData,
} from '@/types/page';

export default function Home() {
  const config = getConfig();
  const enableOnePageMode = config.features.enable_one_page_mode;

  // Always load about page config for profile info
  const aboutConfig = getPageConfig('about');
  const researchInterests = (aboutConfig as { profile?: { research_interests?: string[] } })?.profile?.research_interests;

  // Helper function to process sections (for about page)
  const processSections = (sections: SectionConfig[]): SectionConfig[] => {
    return sections.map((section: SectionConfig) => {
      switch (section.type) {
        case 'markdown':
          return {
            ...section,
            content: section.source ? getMarkdownContent(section.source) : ''
          };
        case 'publications': {
          const bibtex = getBibtexContent('publications.bib');
          const allPubs = parseBibTeX(bibtex);
          const filteredPubs = section.filter === 'selected'
            ? allPubs.filter(p => p.selected)
            : allPubs;
          return {
            ...section,
            publications: section.limit ? filteredPubs.slice(0, section.limit) : filteredPubs
          };
        }
        case 'list': {
          const newsData = section.source ? getTomlContent<{ news: NewsItem[] }>(section.source) : null;
          return {
            ...section,
            items: newsData?.news || []
          };
        }
        case 'awards': {
          const awardsData = section.source ? getTomlContent<{ items: AwardItem[] }>(section.source) : null;
          return {
            ...section,
            awards: awardsData?.items || []
          };
        }
        case 'competitions': {
          const competitionsData = section.source ? getTomlContent<{ items: CompetitionItem[] }>(section.source) : null;
          return {
            ...section,
            competitions: competitionsData?.items || []
          };
        }
        case 'projects': {
          const projectsData = section.source ? getTomlContent<{ items: ProjectItem[] }>(section.source) : null;
          return {
            ...section,
            projects: projectsData?.items || []
          };
        }
        case 'internships': {
          const internshipsData = section.source ? getTomlContent<{ items: InternshipItem[] }>(section.source) : null;
          return {
            ...section,
            internships: internshipsData?.items || []
          };
        }
        default:
          return section;
      }
    });
  };

  // Determine which pages to show
  let pagesToShow: PageData[] = [];

  if (enableOnePageMode) {
    pagesToShow = config.navigation
      .filter(item => item.type === 'page')
      .map(item => {
        const rawConfig = getPageConfig(item.target);
        if (!rawConfig) return null;

        const pageConfig = rawConfig as BasePageConfig;

        if (pageConfig.type === 'about' || 'sections' in (rawConfig as object)) {
          return {
            type: 'about',
            id: item.target,
            sections: processSections((rawConfig as { sections: SectionConfig[] }).sections || [])
          } as PageData;
        } else if (pageConfig.type === 'publication') {
          const pubConfig = pageConfig as PublicationPageConfig;
          const bibtex = getBibtexContent(pubConfig.source);
          return {
            type: 'publication',
            id: item.target,
            config: pubConfig,
            publications: parseBibTeX(bibtex)
          } as PageData;
        } else if (pageConfig.type === 'text') {
          const textConfig = pageConfig as TextPageConfig;
          return {
            type: 'text',
            id: item.target,
            config: textConfig,
            content: getMarkdownContent(textConfig.source)
          } as PageData;
        } else if (pageConfig.type === 'card') {
          return {
            type: 'card',
            id: item.target,
            config: pageConfig as CardPageConfig
          } as PageData;
        }
        return null;
      })
      .filter((item): item is PageData => item !== null);
  } else {
    if (aboutConfig) {
      pagesToShow = [{
        type: 'about',
        id: 'about',
        sections: processSections((aboutConfig as { sections: SectionConfig[] }).sections || [])
      }];
    }
  }

  // Extract section quick links from the primary about page
  const aboutPage = pagesToShow.find((p): p is Extract<PageData, { type: 'about' }> => p.type === 'about');
  const quickLinks = (aboutPage?.sections || []).map(sec => ({
    id: `section-${sec.id}`,
    label:
      sec.id === 'featured_publications'
        ? 'Publications'
        : sec.id === 'projects'
        ? 'Projects'
        : sec.id === 'awards'
        ? 'Awards'
        : sec.title || sec.id,
  }));

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
      <PageBlueprintDecor />
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* Left Column - Profile */}
        <div className="lg:col-span-4">
          <Profile
            author={config.author}
            social={config.social}
            features={config.features}
            researchInterests={researchInterests}
          />
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-10 min-w-0">
          {/* Quick Section Jump Bar (Horizontal Scrollable on Mobile + Scroll Spy) */}
          <QuickJumpNav links={quickLinks} />

          {pagesToShow.map((page) => (
            <div key={page.id} id={page.id} className="scroll-mt-24 space-y-8 sm:space-y-10">
              {page.type === 'about' && page.sections.map((section: SectionConfig) => {
                const sectionAnchorId = `section-${section.id}`;
                switch (section.type) {
                  case 'markdown':
                    return (
                      <div key={section.id} id={sectionAnchorId} className="scroll-mt-32">
                        <About
                          content={section.content || ''}
                          title={section.title}
                          sectionId={section.id}
                        />
                      </div>
                    );
                  case 'publications':
                    return (
                      <div key={section.id} id={sectionAnchorId} className="scroll-mt-32">
                        <SelectedPublications
                          publications={section.publications || []}
                          title={section.title}
                        />
                      </div>
                    );
                  case 'list':
                    return (
                      <div key={section.id} id={sectionAnchorId} className="scroll-mt-32">
                        <News
                          items={section.items || []}
                          title={section.title}
                        />
                      </div>
                    );
                  case 'awards':
                    return (
                      <div key={section.id} id={sectionAnchorId} className="scroll-mt-32">
                        <Awards
                          items={section.awards || []}
                          title={section.title}
                        />
                      </div>
                    );
                  case 'competitions':
                    return (
                      <div key={section.id} id={sectionAnchorId} className="scroll-mt-32">
                        <Competitions
                          items={section.competitions || []}
                          title={section.title}
                        />
                      </div>
                    );
                  case 'projects':
                    return (
                      <div key={section.id} id={sectionAnchorId} className="scroll-mt-32">
                        <Projects
                          items={section.projects || []}
                          title={section.title}
                        />
                      </div>
                    );
                  case 'internships':
                    return (
                      <div key={section.id} id={sectionAnchorId} className="scroll-mt-32">
                        <Internships
                          items={section.internships || []}
                          title={section.title}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config}
                  content={page.content}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Globe at bottom */}
      <div className="mt-12 pt-6 border-t border-neutral-200/60 dark:border-neutral-800/80">
        <ClustrMapsGlobe />
      </div>
    </div>
  );
}
