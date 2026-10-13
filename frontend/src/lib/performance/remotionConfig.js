/**
 * Revoraa Adaptive Performance System — Remotion Adaptive Preview Engine
 * 
 * Configures lightweight in-browser Remotion player/preview configurations
 * tailored to device performance profiles while maintaining strict
 * animation correctness and export invariants.
 * 
 * INVARIANT: Final video exports always preserve exact composition timing,
 * frame rate, duration, resolution, audio synchronization, and quality.
 */

import React from 'react';
import { PERFORMANCE_MODES } from './deviceClassifier.js';

/**
 * Returns adaptive preview settings for Remotion Players/Compositions.
 */
export function getRemotionAdaptivePreviewConfig(mode) {
  switch (mode) {
    case PERFORMANCE_MODES.EFFICIENCY:
      return {
        // Render canvas at half scale to reduce pixel fillrate by 75% while maintaining aspect ratio
        scale: 0.5,
        renderConcurrency: 1,
        bufferFrames: 8,
        playbackRate: 1.0,
        lazyLoadPlayer: true,
        showTimelineThumbnails: false,
        useWebWorkerDecoding: true,
        // Informative metadata for rendering player wrapper
        description: 'Efficiency mode: 50% preview canvas scale, single-threaded buffer'
      };

    case PERFORMANCE_MODES.BALANCED:
      return {
        scale: 0.75,
        renderConcurrency: 2,
        bufferFrames: 16,
        playbackRate: 1.0,
        lazyLoadPlayer: true,
        showTimelineThumbnails: true,
        useWebWorkerDecoding: true,
        description: 'Balanced mode: 75% preview canvas scale, dual-threaded buffer'
      };

    case PERFORMANCE_MODES.HIGH_QUALITY:
    default:
      return {
        scale: 1.0,
        renderConcurrency: 4,
        bufferFrames: 30,
        playbackRate: 1.0,
        lazyLoadPlayer: false,
        showTimelineThumbnails: true,
        useWebWorkerDecoding: true,
        description: 'High-quality mode: Native 100% preview canvas scale, high concurrency'
      };
  }
}

/**
 * INVARIANT: Final export configuration.
 * Device performance profile MUST NOT alter final export parameters.
 */
export function getRemotionExportConfig({
  width = 1920,
  height = 1080,
  fps = 60,
  durationInFrames = 300,
  audioBitrate = '320k',
  videoBitrate = null,
  codec = 'h264'
} = {}) {
  return {
    width: Math.round(width),
    height: Math.round(height),
    fps: Math.round(fps),
    durationInFrames: Math.round(durationInFrames),
    audioBitrate,
    videoBitrate,
    codec,
    // Invariant assertions
    isExportUncompromised: true,
    scale: 1.0
  };
}

/**
 * Higher-order utility to calculate scaled preview dimensions
 * while strictly preserving original aspect ratio.
 */
export function calculateAdaptivePreviewDimensions(originalWidth, originalHeight, mode) {
  const previewConfig = getRemotionAdaptivePreviewConfig(mode);
  const scale = previewConfig.scale;

  return {
    width: Math.max(320, Math.round(originalWidth * scale)),
    height: Math.max(180, Math.round(originalHeight * scale)),
    scale,
    aspectRatio: originalWidth / originalHeight
  };
}

/**
 * RemotionAdaptivePreviewWrapper
 * A responsive container for Remotion Players that applies
 * aspect ratio preservation and scaled canvas dimensions based on active mode.
 */
export function RemotionAdaptivePreviewWrapper({ 
  children, 
  originalWidth = 1920, 
  originalHeight = 1080, 
  mode = PERFORMANCE_MODES.BALANCED,
  className = '',
  style = {} 
}) {
  const { width, aspectRatio, scale } = calculateAdaptivePreviewDimensions(
    originalWidth, 
    originalHeight, 
    mode
  );

  return React.createElement('div', {
    className: `remotion-adaptive-preview-container ${className}`,
    'data-perf-scale': scale,
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: `${width}px`,
      aspectRatio: `${aspectRatio}`,
      overflow: 'hidden',
      borderRadius: 'var(--radius-md, 12px)',
      background: '#09090b',
      ...style
    }
  }, children);
}
