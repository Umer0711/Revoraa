/**
 * Revoraa Level 4: Advanced Python - Master Module Definition
 * 
 * Aggregates all 8 advanced modules into the Level 4 Curriculum Definition.
 */

import { MODULE_1_INTERNALS_RESOURCE_MANAGEMENT } from './level4Mod1Data.js';
import { MODULE_2_ASYNCIO_PROGRAMMING } from './level4Mod2Data.js';
import { MODULE_3_THREADS_PROCESSES_CONCURRENCY } from './level4Mod3Data.js';
import { MODULE_4_PERFORMANCE_OPTIMIZATION } from './level4Mod4Data.js';
import { MODULE_5_ADVANCED_TYPE_HINTS } from './level4Mod5Data.js';
import { MODULE_6_DESIGN_PATTERNS_ARCHITECTURE } from './level4Mod6Data.js';
import { MODULE_7_RELIABLE_PIPELINES_LOGGING } from './level4Mod7Data.js';
import { MODULE_8_TESTING_ARCHITECTURE_VALIDATION } from './level4Mod8Data.js';

export const LEVEL_4_MODULES = [
  MODULE_1_INTERNALS_RESOURCE_MANAGEMENT,
  MODULE_2_ASYNCIO_PROGRAMMING,
  MODULE_3_THREADS_PROCESSES_CONCURRENCY,
  MODULE_4_PERFORMANCE_OPTIMIZATION,
  MODULE_5_ADVANCED_TYPE_HINTS,
  MODULE_6_DESIGN_PATTERNS_ARCHITECTURE,
  MODULE_7_RELIABLE_PIPELINES_LOGGING,
  MODULE_8_TESTING_ARCHITECTURE_VALIDATION
].map(mod => ({
  ...mod,
  lessons: mod.topics.flatMap(t => t.lessons)
}));

export const LEVEL_4_DEFINITION = {
  level_number: 4,
  level_title: 'Advanced',
  title: 'Advanced Python',
  badge: 'Level 4',
  description: 'Learn to build responsive, efficient, maintainable Python systems by understanding asynchronous programming, concurrency, performance analysis, advanced typing, and application architecture.',
  modules: LEVEL_4_MODULES
};
