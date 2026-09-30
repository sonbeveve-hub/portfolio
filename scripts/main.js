import '@fontsource-variable/manrope';
import '@fontsource-variable/newsreader/wght-italic.css';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/layout.css';
import '../styles/sections.css';
import { initTheme } from './theme.js';
import { initHeader } from './header.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initStatement } from './statement.js';
import { initHeroStripes } from './hero-stripes.js';

initTheme();
initHeader();
initReveal();
initCounters();
initStatement();
initHeroStripes();
