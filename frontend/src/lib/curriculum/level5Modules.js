/**
 * Revoraa Level 5: Expert / Production Python - Master Module Definition
 * 
 * Aggregates all 8 production modules into the Level 5 Curriculum Definition.
 */

import { MODULE_1_PROJECT_STRUCTURE } from './level5Mod1Data.js';
import { MODULE_2_PACKAGING_DISTRIBUTION } from './level5Mod2Data.js';
import { MODULE_3_CONFIG_SECURITY_SECRETS } from './level5Mod3Data.js';
import { MODULE_4_PRODUCTION_TESTING_QA } from './level5Mod4Data.js';
import { MODULE_5_APIS_DATABASES_RELIABILITY } from './level5Mod5Data.js';
import { LEVEL_5_MOD_6_LESSONS } from './level5Mod6Data.js';
import { LEVEL_5_MOD_7_LESSONS } from './level5Mod7Data.js';
import { LEVEL_5_MOD_8_LESSONS } from './level5Mod8Data.js';

// Helper to normalize lesson objects with summary and learning_objectives
function normalizeLesson(l) {
  let objectives = l.learning_objectives;
  if (!objectives || objectives.length === 0) {
    // Extract numbered objectives from content if present
    const matches = l.content ? l.content.match(/\d+\.\s+([^\n\r]+)/g) : null;
    if (matches && matches.length > 0) {
      objectives = matches.slice(0, 4).map(m => m.replace(/^\d+\.\s+/, '').trim());
    } else {
      objectives = [l.title, l.description || l.summary || 'Production engineering mastery'];
    }
  }

  return {
    ...l,
    is_published: true,
    summary: l.summary || l.description || '',
    content_markdown: l.content_markdown || l.content || '',
    content: l.content || l.content_markdown || '',
    code_snippet: l.code_snippet || l.interactive_code || '',
    interactive_code: l.interactive_code || l.code_snippet || '',
    learning_objectives: objectives,
    key_takeaways: l.key_takeaways || [
      `Mastered key production practices for ${l.title}.`,
      'Implemented robust verification patterns and error boundaries.',
      'Applied cloud-native, defensive engineering standards.'
    ],
    revision_prompts: l.revision_prompts || [
      `How do you verify ${l.title} in an automated production pipeline?`
    ]
  };
}

// Module 6: Docker and Deployment Fundamentals
export const MODULE_6_DOCKER_DEPLOYMENT = {
  id: 'mod-l5-6',
  slug: 'docker-and-deployment-fundamentals',
  title: 'Docker and Deployment Fundamentals',
  tagline: 'Package and deploy resilient Python applications with immutable containers and minimal attack surfaces.',
  description: 'Master containerization fundamentals, multi-stage Docker builds, non-root user security, port networking, stateless storage, exit code triage, BuildKit secrets, and safe rollback strategies.',
  level_number: 5,
  sort_order: 6,
  is_published: true,
  topics: [
    {
      id: 'top-l5-6-1',
      slug: 'container-foundations-dockerfiles',
      title: 'Container Foundations & Production Dockerfiles',
      summary: 'Understand deployment lifecycles, dev/prod parity, PID 1 signal propagation, container primitives, and hardened Dockerfiles.',
      sort_order: 1,
      lessons: LEVEL_5_MOD_6_LESSONS.slice(0, 6).map(normalizeLesson)
    },
    {
      id: 'top-l5-6-2',
      slug: 'runtime-networking-and-rollbacks',
      title: 'Runtime Config, Networking, Secrets & Rollbacks',
      summary: 'Master container environment injection, port bindings, stateless storage, exit codes, BuildKit secrets, and safe rollback strategies.',
      sort_order: 2,
      lessons: LEVEL_5_MOD_6_LESSONS.slice(6, 12).map(normalizeLesson)
    }
  ]
};

// Module 7: CI/CD, Monitoring, and Operations
export const MODULE_7_CICD_MONITORING_OPERATIONS = {
  id: 'mod-l5-7',
  slug: 'cicd-monitoring-and-operations',
  title: 'CI/CD, Monitoring, and Operations',
  tagline: 'Automate build pipelines, continuous delivery, metric observability, and incident response.',
  description: 'Master trunk-based CI, matrix testing, immutable release artifacts, OIDC secrets, structured JSON logging, Prometheus RED metrics, liveness vs readiness probes, Sentry error tracking, and blameless runbooks.',
  level_number: 5,
  sort_order: 7,
  is_published: true,
  topics: [
    {
      id: 'top-l5-7-1',
      slug: 'ci-cd-pipelines-and-artifacts',
      title: 'CI/CD Pipelines, Matrix Testing & Artifact Release',
      summary: 'Master trunk-based CI, continuous deployment vs delivery, GitHub Actions test matrices, immutable artifacts, preview environments, and OIDC secret federation.',
      sort_order: 1,
      lessons: LEVEL_5_MOD_7_LESSONS.slice(0, 6).map(normalizeLesson)
    },
    {
      id: 'top-l5-7-2',
      slug: 'observability-monitoring-and-incidents',
      title: 'Observability, Health Probes & Incident Operations',
      summary: 'Implement structured JSON logs, RED metrics, separate /healthz and /readyz probes, Sentry error tracking, automated Dependabot updates, and blameless runbooks.',
      sort_order: 2,
      lessons: LEVEL_5_MOD_7_LESSONS.slice(6, 12).map(normalizeLesson)
    }
  ]
};

// Module 8: Production Readiness and Final Assessment
export const MODULE_8_PRODUCTION_READINESS_FINAL = {
  id: 'mod-l5-8',
  slug: 'production-readiness-and-final-assessment',
  title: 'Production Readiness and Final Assessment',
  tagline: 'Verify end-to-end production readiness, reliability, disaster recovery, and demonstrate capstone mastery.',
  description: 'Conduct comprehensive architectural reviews, resilience audits, STRIDE threat models, memory profiling, mutation testing, ADR documentation, post-deploy smoke tests, disaster recovery SLAs, PRR gates, and complete the Level 5 Comprehensive Final Assessment.',
  level_number: 5,
  sort_order: 8,
  is_published: true,
  topics: [
    {
      id: 'top-l5-8-1',
      slug: 'architecture-security-and-testing-review',
      title: 'Architecture, Resilience, Threat Models & Test Completeness',
      summary: 'Conduct thorough reviews of domain boundaries, bulkhead resilience, STRIDE threat models, memory profiling, mutation testing, and ADR documentation.',
      sort_order: 1,
      lessons: LEVEL_5_MOD_8_LESSONS.slice(0, 6).map(normalizeLesson)
    },
    {
      id: 'top-l5-8-2',
      slug: 'verification-disaster-recovery-and-assessment',
      title: 'Verification, Disaster Recovery, PRR & Final Assessment',
      summary: 'Execute post-deployment smoke tests, disaster recovery RPO/RTO SLAs, semantic versioning lifecycles, PRR go/no-go gates, and the comprehensive Level 5 Final Assessment.',
      sort_order: 2,
      lessons: LEVEL_5_MOD_8_LESSONS.slice(6, 12).map(normalizeLesson)
    }
  ]
};

export const LEVEL_5_MODULES = [
  MODULE_1_PROJECT_STRUCTURE,
  MODULE_2_PACKAGING_DISTRIBUTION,
  MODULE_3_CONFIG_SECURITY_SECRETS,
  MODULE_4_PRODUCTION_TESTING_QA,
  MODULE_5_APIS_DATABASES_RELIABILITY,
  MODULE_6_DOCKER_DEPLOYMENT,
  MODULE_7_CICD_MONITORING_OPERATIONS,
  MODULE_8_PRODUCTION_READINESS_FINAL
].map(mod => ({
  ...mod,
  is_published: true,
  topics: mod.topics.map(t => ({
    ...t,
    lessons: t.lessons.map(l => ({ ...normalizeLesson(l), is_published: true }))
  })),
  lessons: mod.topics.flatMap(t => t.lessons.map(l => ({ ...normalizeLesson(l), is_published: true })))
}));

export const LEVEL_5_DEFINITION = {
  level_number: 5,
  level_title: 'Expert',
  title: 'Expert / Production Python',
  badge: 'Level 5',
  description: 'Learn to transform Python knowledge into reliable, maintainable, secure, tested, packaged, and deployable software. Master project structuring, packaging, configuration, testing, database reliability, Docker, CI/CD, and production readiness.',
  modules: LEVEL_5_MODULES
};
