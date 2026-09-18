import { describe, expect, it } from 'vitest';
import {
  confidenceToVariant,
  healthBucketToDotClassName,
  healthStatusToBucket,
  statusToVariant,
  threatToVariant,
} from './report-status.mappers';

describe('statusToVariant', () => {
  it('maps excellent/good to success', () => {
    expect(statusToVariant('excellent')).toBe('success');
    expect(statusToVariant('good')).toBe('success');
  });

  it('maps fair to neutral', () => {
    expect(statusToVariant('fair')).toBe('neutral');
  });

  it('maps poor/critical to danger', () => {
    expect(statusToVariant('poor')).toBe('danger');
    expect(statusToVariant('critical')).toBe('danger');
  });
});

describe('threatToVariant', () => {
  it('maps low to success', () => {
    expect(threatToVariant('low')).toBe('success');
  });

  it('maps medium to neutral', () => {
    expect(threatToVariant('medium')).toBe('neutral');
  });

  it('maps high/critical to danger', () => {
    expect(threatToVariant('high')).toBe('danger');
    expect(threatToVariant('critical')).toBe('danger');
  });
});

describe('confidenceToVariant', () => {
  it('is success above the high threshold', () => {
    expect(confidenceToVariant(81)).toBe('success');
  });

  it('is danger below the low threshold', () => {
    expect(confidenceToVariant(29)).toBe('danger');
  });

  it('is neutral in between', () => {
    expect(confidenceToVariant(50)).toBe('neutral');
  });
});

describe('healthStatusToBucket', () => {
  it('buckets excellent/good as healthy', () => {
    expect(healthStatusToBucket('excellent')).toBe('healthy');
    expect(healthStatusToBucket('good')).toBe('healthy');
  });

  it('buckets fair as warning', () => {
    expect(healthStatusToBucket('fair')).toBe('warning');
  });

  it('buckets poor/critical as sick', () => {
    expect(healthStatusToBucket('poor')).toBe('sick');
    expect(healthStatusToBucket('critical')).toBe('sick');
  });
});

describe('healthBucketToDotClassName', () => {
  it('returns a distinct class per bucket', () => {
    const classes = new Set([
      healthBucketToDotClassName('healthy'),
      healthBucketToDotClassName('warning'),
      healthBucketToDotClassName('sick'),
    ]);
    expect(classes.size).toBe(3);
  });
});
