/**
 * Revoraa Level 3: Intermediate Python - Master Module Definition
 * 
 * Aggregates all 8 intermediate modules into the Level 3 Curriculum Definition.
 */

import { MODULE_1_ADVANCED_DATA_STRUCTURES } from './level3Mod1Data.js';
import { MODULE_2_ITERATORS_AND_GENERATORS } from './level3Mod2Data.js';
import { MODULE_3_FUNCTIONS_CLOSURES_DECORATORS } from './level3Mod3Data.js';
import { MODULE_4_COMPREHENSIONS_FUNCTIONAL } from './level3Mod4Data.js';
import { MODULE_5_HTTP_APIS_JSON } from './level3Mod5Data.js';
import { MODULE_6_DATABASE_INTEGRATION } from './level3Mod6Data.js';
import { MODULE_7_MODULAR_DESIGN } from './level3Mod7Data.js';
import { MODULE_8_TESTING_AND_DEBUGGING } from './level3Mod8Data.js';

export const LEVEL_3_MODULES = [
  MODULE_1_ADVANCED_DATA_STRUCTURES,
  MODULE_2_ITERATORS_AND_GENERATORS,
  MODULE_3_FUNCTIONS_CLOSURES_DECORATORS,
  MODULE_4_COMPREHENSIONS_FUNCTIONAL,
  MODULE_5_HTTP_APIS_JSON,
  MODULE_6_DATABASE_INTEGRATION,
  MODULE_7_MODULAR_DESIGN,
  MODULE_8_TESTING_AND_DEBUGGING
].map(mod => ({
  ...mod,
  lessons: mod.topics.flatMap(t => t.lessons)
}));

export const LEVEL_3_DEFINITION = {
  level_number: 3,
  level_title: 'Intermediate',
  title: 'Intermediate Python',
  badge: 'Level 3',
  description: 'Advanced data structures, iterators, generators, custom decorators, functional programming, HTTP/APIs, SQLite integration, modular architectures, and robust unit testing.',
  modules: LEVEL_3_MODULES
};
