'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Lenis from 'lenis';

const heroPortrait = '/assets/hero-portrait-cutout.png';

const projects = [
  {
    name: 'eMotoRent',
    category: 'Graduation Capstone · Web + Mobile',
    type: 'Electric mobility platform',
    status: 'Web · Mobile',
    blurb: 'A full electric-motorbike rental platform that streamlines booking, fleet management, payments, and maintenance across web and mobile.',
    visual: 'eMotoRent',
    links: [
      ['Live product', 'https://emrs-fe.vercel.app'],
      ['Source', 'https://github.com/SEP490-eMotoRent'],
    ],
  },
  {
    name: 'Private Operations Platform',
    category: 'Private Product · NDA',
    type: 'Operations & automation',
    status: 'Private · NDA',
    blurb: 'A private TypeScript platform that consolidates workforce operations, scheduling, and automated workflows in one focused workspace.',
    image: '/assets/private-operations-landing.png',
    visual: 'Private / NDA',
    links: [],
  },
  {
    name: 'Marketing Analytics Dashboard',
    category: 'Data & Reporting',
    type: 'Internal analytics tool',
    status: 'Dashboard',
    blurb: 'A unified reporting workspace for Facebook organic performance, paid advertising, and Instagram analytics.',
    visual: 'Analytics',
    links: [['View source', 'https://github.com/phuuthanh-dev/meta-marketing-dashboard']],
  },
  {
    name: 'Moji Chat',
    category: 'Real-time Web Application',
    type: 'Full-stack messaging',
    status: 'WebSocket',
    blurb: 'A full-stack chat experience for direct messages, group conversations, friend management, and profile updates.',
    visual: 'Moji Chat',
    links: [['View source', 'https://github.com/phuuthanh-dev/moji-chat']],
  },
];

const principles = [
  ['Build end to end', 'I like connecting a clear interface to the APIs, data models, and delivery workflows that make a product dependable in practice.'],
  ['Make complexity clear', 'The best product work turns a difficult operational problem into an experience that feels direct, understandable, and useful.'],
  ['Design for maintainability', 'Clean system boundaries, intentional data flows, and thoughtful documentation keep the next iteration easier than the first.'],
  ['Learn by shipping', 'I use each build as a chance to sharpen technical judgment, test ideas with real users, and improve the work that follows.'],
];

const stack = [
  ['Frontend & mobile', 'React · Next.js · TypeScript · JavaScript · React Native · Expo · HTML/CSS'],
  ['Backend & systems', 'Java · C# · Spring Boot · Node.js · REST APIs · JWT · WebSocket'],
  ['Data & delivery', 'SQL Server · MongoDB · Hibernate · Docker · CI/CD · Railway · Vercel'],
];

function RevealHeading({ lines, className = '' }) {
  return (
    <span className={`reveal-heading ${className}`} aria-label={lines.join(' ')}>
      {lines.map((line, index) => (
        <span className="reveal-line" key={`${line}-${index}`}><span>{line}</span></span>
      ))}
    </span>
  );
}

function Eyebrow({ children }) {
  return <div className="eyebrow"><span className="eyebrow-dot" />{children}</div>;
}

function LiquidImage({ src, alt, className = '', bare = false, placeholderLabel = '' }) {
  const filterId = `liquid-${useId().replace(/:/g, '')}`;
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);
  const frameRef = useRef(null);
  const targetRef = useRef({ scale: 1, frequency: 0.009 });
  const currentRef = useRef({ scale: 1, frequency: 0.009 });

  useEffect(() => {
    const figure = frameRef.current;
    if (!figure || !window.matchMedia('(hover: hover) and (min-width: 769px)').matches) return undefined;
    let hovering = false;
    let last = performance.now();
    const destination = bare ? 30 : 28;
    const animate = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const ease = 1 - Math.exp(-dt * 9);
      const target = targetRef.current;
      const current = currentRef.current;
      current.scale += (target.scale - current.scale) * ease;
      current.frequency += (target.frequency - current.frequency) * ease;
      displacementRef.current?.setAttribute('scale', current.scale.toFixed(2));
      turbulenceRef.current?.setAttribute('baseFrequency', current.frequency.toFixed(4));
      if (hovering || Math.abs(current.scale - target.scale) > 0.05) {
        const node = frameRef.current;
        if (node) node.__liquidFrame = requestAnimationFrame(animate);
      }
    };
    const enter = () => {
      hovering = true;
      targetRef.current = { scale: destination, frequency: 0.022 };
      figure.classList.add('is-hovered');
      cancelAnimationFrame(frameRef.current?.__liquidFrame);
      if (frameRef.current) frameRef.current.__liquidFrame = requestAnimationFrame(animate);
    };
    const leave = () => {
      hovering = false;
      targetRef.current = { scale: 1, frequency: 0.009 };
      figure.classList.remove('is-hovered');
      cancelAnimationFrame(frameRef.current?.__liquidFrame);
      if (frameRef.current) frameRef.current.__liquidFrame = requestAnimationFrame(animate);
    };
    figure.addEventListener('pointerenter', enter);
    figure.addEventListener('pointerleave', leave);
    return () => {
      figure.removeEventListener('pointerenter', enter);
      figure.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frameRef.current?.__liquidFrame);
    };
  }, [bare]);

  return (
    <figure ref={frameRef} role="img" aria-label={alt} className={`liquid-image ${bare ? 'liquid-bare' : ''} ${className}`}>
      <svg className="liquid-filter" aria-hidden="true">
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.009" numOctaves="2" result="noise" />
          <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </svg>
      {src ? <img src={src} alt="" style={{ '--liquid-filter': `url(#${filterId})` }} /> : <div className="image-placeholder">{placeholderLabel}</div>}
      {!bare && <><span className="liquid-veil" /><span className="liquid-glow" /><span className="liquid-vignette" /></>}
    </figure>
  );
}

function Preloader({ onReveal, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      onComplete();
      return undefined;
    }
    const started = performance.now();
    const tick = () => {
      const elapsed = performance.now() - started;
      setProgress(Math.min(100, Math.round((elapsed / 2000) * 100)));
      if (elapsed < 2000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const fade = window.setTimeout(() => setFading(true), 2000);
    const reveal = window.setTimeout(onReveal, 2500);
    const wipe = window.setTimeout(() => setWiping(true), 2500);
    const done = window.setTimeout(onComplete, 3180);
    return () => [fade, reveal, wipe, done].forEach(clearTimeout);
  }, [onComplete, onReveal]);

  return <div className={`preloader ${fading ? 'preloader-fading' : ''} ${wiping ? 'preloader-wiping' : ''}`} aria-hidden={wiping}>
    <div className="preloader-bg" />
    <span className="preloader-brand">Thanh Phung</span>
    <span className="preloader-counter">{progress}<b>%</b></span>
  </div>;
}

function SiteNav({ menuOpen, setMenuOpen, scrollTo }) {
  const items = [['About', '#about'], ['Projects', '#projects'], ['Stack', '#stack'], ['Contact', '#contact']];
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      document.body.classList.remove('is-menu-open');
      return undefined;
    }

    const menu = menuRef.current;
    const getFocusableElements = () => [
      menuButtonRef.current,
      ...(menu?.querySelectorAll('a[href]') || []),
    ].filter(Boolean);
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== 'Tab') return;
      const focusableElements = getFocusableElements();
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add('is-menu-open');
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
    return () => {
      document.body.classList.remove('is-menu-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen, setMenuOpen]);

  const closeMenu = (returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return <>
    <header className="site-nav"><nav>
      <a className="brand" href="#top" onClick={(event) => scrollTo(event, '#top')}><span className="monogram">TP</span><span className="brand-name">Thanh Phung</span></a>
      <ul className="desktop-links">{items.map(([label, href]) => <li key={label}><a href={href} onClick={(event) => scrollTo(event, href)}>{label}</a></li>)}</ul>
      <button ref={menuButtonRef} className={`burger ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="mobile-menu" aria-expanded={menuOpen} onClick={() => menuOpen ? closeMenu(true) : setMenuOpen(true)}><span /><span /><span /></button>
    </nav></header>
    <div id="mobile-menu" ref={menuRef} className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} role="dialog" aria-label="Site navigation" aria-modal="true" aria-hidden={!menuOpen}>
      <ul>{items.map(([label, href], index) => <li key={label} style={{ '--menu-delay': `${120 + index * 85}ms` }}><a href={href} onClick={(event) => { scrollTo(event, href); closeMenu(true); }}>{label}</a></li>)}</ul>
    </div>
  </>;
}

function Hero({ ready }) {
  const nameLine = (word, lineDelay) => <span className="hero-name-line">{[...word].map((letter, index) => <span className="hero-letter" style={{ '--letter-delay': `${lineDelay + index * 52}ms` }} key={`${letter}-${index}`}>{letter}</span>)}</span>;
  return <section id="top" className={`hero ${ready ? 'hero-ready' : ''}`}>
    <div className="hero-top-row">
      <h2 className="hero-roles">{['Software Engineer', 'Full-stack Systems', 'Web + Mobile Products'].map((role) => <span className="role-line" key={role}>{role}</span>)}</h2>
      <p className="hero-description">I build practical products that turn complex workflows into clear, reliable experiences — from operational platforms and analytics tools to real-time web applications and mobile products.</p>
    </div>
    <h1 className="hero-name">{nameLine('Thanh', 0)}{nameLine('Phung', 240)}</h1>
    <div className="hero-portrait"><LiquidImage bare src={heroPortrait} alt="Portrait of Thanh Phung" className="hero-liquid" /></div>
    <div className="hero-gradient" />
    <div className="scroll-cue"><span />Scroll to explore</div>
  </section>;
}

export default function HomePage() {
  const [preloaded, setPreloaded] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenisRef = useRef(null);
  const revealHero = useCallback(() => setHeroReady(true), []);
  const completePreloader = useCallback(() => setPreloaded(true), []);

  useEffect(() => {
    const root = document.documentElement;
    const applyAdaptiveGrid = () => {
      const width = window.innerWidth;
      const reduction = ((1920 - width) / 1920) * 100 * 0.6666;
      const size = 16 - (16 * reduction) / 100;
      if (size > 16) root.style.fontSize = `${size}px`;
      else root.style.removeProperty('font-size');
    };
    applyAdaptiveGrid();
    window.addEventListener('resize', applyAdaptiveGrid);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      lenisRef.current = null;
      return () => window.removeEventListener('resize', applyAdaptiveGrid);
    }
    const lenis = new Lenis({ smoothWheel: true });
    lenis.stop();
    lenisRef.current = lenis;
    window.lenis = lenis;
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => {
      window.removeEventListener('resize', applyAdaptiveGrid);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  useEffect(() => {
    if (!preloaded) return;
    document.body.classList.remove('is-preloading');
    lenisRef.current?.start();
  }, [preloaded]);

  useEffect(() => {
    if (!preloaded) return undefined;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0 });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [preloaded]);

  useEffect(() => { document.body.classList.add('is-preloading'); return () => document.body.classList.remove('is-preloading'); }, []);

  useEffect(() => {
    if (!preloaded || !window.location.hash) return undefined;
    const target = document.querySelector(window.location.hash);
    const frame = requestAnimationFrame(() => target?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [preloaded]);

  const scrollTo = (event, target) => {
    event.preventDefault();
    const element = document.querySelector(target);
    if (window.location.hash !== target) window.history.pushState(null, '', target);
    if (element && lenisRef.current) lenisRef.current.scrollTo(element, { offset: 0 });
    else element?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return <>
    {!preloaded && <Preloader onReveal={revealHero} onComplete={completePreloader} />}
    <SiteNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrollTo={scrollTo} />
    <main aria-hidden={menuOpen} inert={menuOpen ? '' : undefined}>
      <Hero ready={heroReady} />
      <section className="marquee" aria-label="Ways of working"><div className="marquee-track">{[0, 1].map((copy) => <div className="marquee-set" key={copy}>{['Build Clearly', 'Ship Reliable Systems', 'Solve Real Workflows', 'Learn By Building', 'Make It Useful'].map((word) => <span className="marquee-item" key={`${copy}-${word}`}>{word}<i /></span>)}</div>)}</div></section>

      <section id="about" className="content-section story"><div className="section-grid">
        <div data-reveal="story-copy"><Eyebrow>About</Eyebrow><h2 className="display-heading"><RevealHeading lines={['Useful software,', 'built with', 'clarity.']} /></h2><p className="lead fade-up">I&apos;m Thanh Phung, a Software Engineer based in Ho Chi Minh City. I build full-stack products across business operations, analytics, real-time communication, and mobile experiences. My work connects clear user interfaces with dependable APIs, data models, automation, and deployment workflows. I currently work as a Software Engineer at DElements Media. I also run Code4Future, where I share programming-study guidance, Java web-development walkthroughs, FPTU exam solutions, and project demos.</p></div>
        <ul className="principles">{principles.map(([title, copy], index) => <li className="principle fade-up" data-reveal="principle" style={{ '--delay': `${index * 90}ms` }} key={title}><span className="principle-index">0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ul>
      </div></section>

      <section id="projects" className="content-section ventures"><div className="section-header" data-reveal="ventures-header"><div><Eyebrow>Selected Work</Eyebrow><h2 className="display-heading"><RevealHeading lines={['Products built', 'to do real work.']} /></h2></div><span className="section-count">04 / Projects</span></div><ul className="venture-grid">{projects.map((project, index) => <li className={`venture-card fade-up ${index % 2 ? 'offset-card' : ''}`} data-reveal="venture" style={{ '--delay': `${index * 120}ms` }} key={project.name}><article className="group"><LiquidImage src={project.image} alt={project.image ? `${project.name} public landing-page preview` : project.name} className={project.image ? 'project-preview' : ''} placeholderLabel={project.visual} /><div className="venture-row"><div><h3>{project.name}</h3><p>{project.blurb}</p></div><div className="venture-meta"><span>{project.type}</span><strong>{project.status}</strong></div></div><div className="venture-category">{project.category}</div>{project.links.length > 0 && <div className="project-actions">{project.links.map(([label, href]) => <a key={label} className="project-link" href={href} target="_blank" rel="noreferrer noopener">{label} <span>↗</span></a>)}</div>}</article></li>)}</ul></section>

      <section id="stack" className="content-section stack-section"><div className="section-header split-header" data-reveal="stack-header"><Eyebrow>Technical Stack</Eyebrow><h2 className="display-heading"><RevealHeading lines={['Tools to turn', 'ideas into', 'products.']} /></h2></div><ul className="stack-grid">{stack.map(([title, tools], index) => <li className="stack-card fade-up" data-reveal="stack" style={{ '--delay': `${index * 110}ms` }} key={title}><span className="stack-index">0{index + 1}</span><h3>{title}</h3><p>{tools}</p></li>)}</ul></section>

      <footer id="contact" className="contact-footer content-section"><div data-reveal="contact-copy"><Eyebrow>Let&apos;s Connect</Eyebrow><h2 className="display-heading"><RevealHeading lines={["Let's build", 'something', 'useful.']} /></h2><p className="lead fade-up">Have an operational problem, product idea, or technical challenge worth solving? I&apos;d be glad to hear from you.</p><a className="email-link" href="mailto:phuuthanh2003@gmail.com">phuuthanh2003@gmail.com <span>↗</span></a></div><div className="footer-bar"><div><p className="signature">Thanh Phung</p><p className="footer-note">Software Engineer · Ho Chi Minh City</p></div><nav aria-label="Social"><ul><li><a href="https://github.com/phuuthanh-dev/" target="_blank" rel="noreferrer noopener">GitHub</a></li><li><a href="https://www.linkedin.com/in/phthanh0908/?isSelfProfile=true" target="_blank" rel="noreferrer noopener">LinkedIn</a></li><li><a href="https://www.youtube.com/@Code4Future" target="_blank" rel="noreferrer noopener">YouTube · Code4Future</a></li><li><a href="https://www.facebook.com/thanhphg89/" target="_blank" rel="noreferrer noopener">Facebook</a></li></ul></nav><p className="copyright">© 2026 Thanh Phung. All rights reserved.</p></div></footer>
    </main>
  </>;
}
