import { parseJsx } from '../parsers/jsx';
import { parseStateObjectToMitosisState } from '../parsers/jsx/state';
import { SPEC } from './data/jsx-json.spec';
import { runTestsForJsx } from './test-generator';

import basicBooleanAttribute from './data/basic-boolean-attribute.raw.tsx?raw';
import basicNullAttribute from './data/basic-null-attribute.raw.tsx?raw';
import basicNumericAttribute from './data/basic-numeric-attribute.raw.tsx?raw';
import basicPropsDestructureRaw from './data/basic-props-destructure.raw.tsx?raw';
import basicPropsRaw from './data/basic-props.raw.tsx?raw';
import buttonWithMetadata from './data/blocks/button-with-metadata.raw.tsx?raw';

describe('Parse JSX', () => {
  test('parseStateObject', () => {
    const out = parseStateObjectToMitosisState(SPEC);
    expect(out).toMatchSnapshot();
  });
  test('boolean attribute', () => {
    const out = parseJsx(basicBooleanAttribute);
    expect(out).toMatchSnapshot();
  });
  test('metadata', () => {
    const json = parseJsx(buttonWithMetadata);
    expect(json).toMatchSnapshot();
  });
  test('numeric attribute', () => {
    const out = parseJsx(basicNumericAttribute);
    expect(out).toMatchSnapshot();
  });
  test('null and undefined attributes', () => {
    const out = parseJsx(basicNullAttribute);
    expect(out).toMatchSnapshot();
  });
  test('custom mitosis package', () => {
    expect(parseJsx(basicPropsRaw)).toEqual(parseJsx(basicPropsDestructureRaw));
  });

  runTestsForJsx();
});
