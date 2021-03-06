import { ChartModel, SpanValue } from '../../../../common/types/Dashboards';
import { TimeSeries } from '../../../../common/types/Metrics';
import seedrandom from 'seedrandom';
import { LabelsInfo } from '../../../../common/utils/timeSeriesUtils';

const t0 = 1556802000;
const increment = 60;

type MetricMock = { name: string, labels: { [key: string]: string } };

const genSeries = (metrics: MetricMock[]): TimeSeries[] => {
  return metrics.map(m => {
    m.labels.__name__ = m.name;
    return {
      values: genSingle(0, 50),
      labelSet: m.labels
    };
  });
};

const genSingle = (offset: number, entropy: number): [number, number][] => {
  const values: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const x = t0 + increment * i;
    const y = offset + Math.floor(Math.random() * entropy);
    values.push([x, y]);
  }
  return values;
};

export const generateRandomMetricChart = (title: string, names: string[], spans: SpanValue, seed?: string): ChartModel => {
  if (seed) {
    seedrandom(seed, { global: true });
  }
  return {
    name: title,
    unit: 'bytes',
    spans: spans,
    metric: genSeries(names.map(n => ({ name: n, labels: {}})))
  };
};

export const generateRandomMetricChartWithLabels = (title: string, metrics: MetricMock[], spans: SpanValue, seed?: string): ChartModel => {
  if (seed) {
    seedrandom(seed, { global: true });
  }
  return {
    name: title,
    unit: 'bytes',
    spans: spans,
    metric: genSeries(metrics)
  };
};

export const generateRandomHistogramChart = (title: string, spans: SpanValue, seed?: string): ChartModel => {
  if (seed) {
    seedrandom(seed, { global: true });
  }
  const histo = {
    '0.99': [{
      values: genSingle(90, 100),
      labelSet: {}
    }],
    '0.95': [{
      values: genSingle(80, 25),
      labelSet: {}
    }],
    '0.5': [{
      values: genSingle(25, 15),
      labelSet: {}
    }],
    avg: [{
      values: genSingle(0, 50),
      labelSet: {}
    }]
  };
  return {
    name: title,
    unit: 'bitrate',
    spans: spans,
    histogram: histo
  };
};

export const empty: ChartModel = {
  name: 'Empty metric chart',
  unit: 'bytes',
  spans: 6,
  metric: []
};

export const error: ChartModel = {
  name: 'Chart with error',
  unit: 'bytes',
  spans: 6,
  metric: [],
  error: 'Unable to fetch metrics'
};

export const metric: ChartModel = {
  name: 'Metric chart',
  unit: 'bytes',
  spans: 6,
  metric: [{
    values: [[t0, 50.4], [t0 + increment, 48.2], [t0 + 2 * increment, 42.0]],
    labelSet: {}
  }]
};

export const histogram: ChartModel = {
  name: 'Histogram chart',
  unit: 'bytes',
  spans: 6,
  histogram: {
    avg: [{
      values: [[t0, 50.4], [t0 + increment, 48.2], [t0 + 2 * increment, 42.0]],
      labelSet: {}
    }],
    '0.99': [{
      values: [[t0, 150.4], [t0 + increment, 148.2], [t0 + 2 * increment, 142.0]],
      labelSet: {}
    }]
  }
};

export const emptyLabels: LabelsInfo = {
  values: new Map()
};

export const labelsWithPrettifier: LabelsInfo = {
  values: new Map([['code', {
    '200': true,
    '204': true,
    'foobar': true,
    'foobaz': false
  }]]),
  prettifier: (k: string, v: string): string => {
    if (k === 'code' && v === '200') {
      return 'OK';
    }
    if (k === 'code' && v === '204') {
      return 'No content';
    }
    return v;
  }
};

export const metricWithLabels: ChartModel = {
  name: 'Metric chart',
  unit: 'bytes',
  spans: 6,
  metric: [{
    values: [[0, 0]],
    labelSet: {'code': '200'}
  }, {
    values: [[0, 0]],
    labelSet: {'code': '204'}
  }, {
    values: [[0, 0]],
    labelSet: {'code': 'foobar'}
  }, {
    values: [[0, 0]],
    labelSet: {'code': 'foobaz'}
  }]
};
