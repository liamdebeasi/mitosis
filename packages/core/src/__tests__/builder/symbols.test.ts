import { componentToBuilder } from '@/generators/builder';
import { componentToMitosis } from '@/generators/mitosis';
import { builderContentToMitosisComponent } from '@/parsers/builder';
import { parseJsx } from '@/parsers/jsx';
import { describe, test } from 'vitest';

describe('Builder Symbols', () => {
  test('no data loss occurs when parsing and generating symbols', () => {
    const builderJson = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            id: 'builder-281c8c0da7be4f8a923f872d4825f14d',
            component: {
              name: 'Symbol',
              options: {
                symbol: {
                  data: {},
                  model: 'symbol',
                  entry: 'ce58d5d74c21469496725f27b8781498',
                  ownerId: 'YJIGb4i01jvw0SRdL5Bt',
                  global: false,
                },
              },
            },
          },
        ],
      },
    };
    const builderToMitosis = builderContentToMitosisComponent(builderJson);

    expect(builderToMitosis.children[0]).toMatchInlineSnapshot(`
      {
        "@type": "@builder.io/mitosis/node",
        "bindings": {
          "symbol": {
            "bindingType": "expression",
            "code": "{\\"data\\":{},\\"model\\":\\"symbol\\",\\"entry\\":\\"ce58d5d74c21469496725f27b8781498\\",\\"ownerId\\":\\"YJIGb4i01jvw0SRdL5Bt\\",\\"global\\":false}",
            "type": "single",
          },
        },
        "children": [],
        "meta": {},
        "name": "Symbol",
        "properties": {},
        "scope": {},
      }
    `);

    const mitosis = componentToMitosis({})({
      component: builderToMitosis,
    });
    expect(mitosis).toMatchInlineSnapshot(`
      "import { Symbol } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <Symbol
            symbol={{
              data: {},
              model: \\"symbol\\",
              entry: \\"ce58d5d74c21469496725f27b8781498\\",
              ownerId: \\"YJIGb4i01jvw0SRdL5Bt\\",
              global: false,
            }}
          />
        );
      }
      "
    `);

    const backToMitosis = parseJsx(mitosis);
    expect(backToMitosis.children[0]).toMatchInlineSnapshot(`
      {
        "@type": "@builder.io/mitosis/node",
        "bindings": {
          "symbol": {
            "bindingType": "expression",
            "code": "{
        data: {},
        model: \\"symbol\\",
        entry: \\"ce58d5d74c21469496725f27b8781498\\",
        ownerId: \\"YJIGb4i01jvw0SRdL5Bt\\",
        global: false
      }",
            "type": "single",
          },
        },
        "children": [],
        "meta": {},
        "name": "Symbol",
        "properties": {},
        "scope": {},
      }
    `);

    const backToBuilder = componentToBuilder()({ component: backToMitosis });
    // no data loss means the component payloads are exactly the same
    expect(backToBuilder.data!.blocks![0].component).toEqual(builderJson.data.blocks[0].component);
  });

  test.only('inline symbol that renders itself does not crash', () => {
    const mitosis = parseJsx(`
      export default function Test(props) {
        return (
          <LocationTree />
        );
      }
      function LocationTree(location) {
        return (
          <>
            Stub
            {location.child && <LocationTree location={location.child} />}
          </>
        );
      }
    `);
    expect(mitosis).toMatchInlineSnapshot(`
      {
        "@type": "@builder.io/mitosis/component",
        "children": [
          {
            "@type": "@builder.io/mitosis/node",
            "bindings": {},
            "children": [],
            "meta": {},
            "name": "LocationTree",
            "properties": {},
            "scope": {},
          },
        ],
        "context": {
          "get": {},
          "set": {},
        },
        "exports": {
          "LocationTree": {
            "code": "function LocationTree(location) {
        return <>
                  Stub
                  {location.child && <LocationTree location={location.child} />}
                </>;
      }",
            "isFunction": true,
            "usedInLocal": false,
          },
        },
        "hooks": {
          "onEvent": [],
          "onMount": [],
        },
        "imports": [],
        "inputs": [],
        "meta": {},
        "name": "Test",
        "refs": {},
        "state": {},
        "subComponents": [
          {
            "@type": "@builder.io/mitosis/component",
            "children": [
              {
                "@type": "@builder.io/mitosis/node",
                "bindings": {},
                "children": [
                  {
                    "@type": "@builder.io/mitosis/node",
                    "bindings": {},
                    "children": [],
                    "meta": {},
                    "name": "div",
                    "properties": {
                      "_text": "
                  Stub
                  ",
                    },
                    "scope": {},
                  },
                  {
                    "@type": "@builder.io/mitosis/node",
                    "bindings": {
                      "when": {
                        "bindingType": "expression",
                        "code": "location.child",
                        "type": "single",
                      },
                    },
                    "children": [
                      {
                        "@type": "@builder.io/mitosis/node",
                        "bindings": {
                          "location": {
                            "bindingType": "expression",
                            "code": "location.child",
                            "type": "single",
                          },
                        },
                        "children": [],
                        "meta": {},
                        "name": "LocationTree",
                        "properties": {},
                        "scope": {},
                      },
                    ],
                    "meta": {},
                    "name": "Show",
                    "properties": {},
                    "scope": {},
                  },
                ],
                "meta": {},
                "name": "Fragment",
                "properties": {},
                "scope": {},
              },
            ],
            "context": {
              "get": {},
              "set": {},
            },
            "exports": {},
            "hooks": {
              "onEvent": [],
              "onMount": [],
            },
            "imports": [],
            "inputs": [],
            "meta": {},
            "name": "LocationTree",
            "refs": {},
            "state": {},
            "subComponents": [],
          },
        ],
      }
    `);
    const builder = componentToBuilder()({ component: mitosis });
    expect(builder).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {},
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "component": {
                "name": "LocationTree",
                "options": {
                  "symbol": {
                    "content": {
                      "data": {
                        "blocks": [
                          {
                            "@type": "@builder.io/sdk:Element",
                            "actions": {},
                            "bindings": {},
                            "children": [
                              {
                                "@type": "@builder.io/sdk:Element",
                                "bindings": {},
                                "component": {
                                  "name": "Text",
                                  "options": {
                                    "text": "
                  Stub
                  ",
                                  },
                                },
                                "tagName": "span",
                              },
                              {
                                "@type": "@builder.io/sdk:Element",
                                "bindings": {
                                  "show": "location.child",
                                },
                                "children": [
                                  {
                                    "@type": "@builder.io/sdk:Element",
                                    "actions": {},
                                    "bindings": {
                                      "component.options.location": "location.child",
                                    },
                                    "children": [],
                                    "code": {
                                      "actions": {},
                                      "bindings": {
                                        "component.options.location": "location.child",
                                      },
                                    },
                                    "component": {
                                      "name": "LocationTree",
                                      "options": {
                                        "symbol": {
                                          "content": [Circular],
                                        },
                                      },
                                    },
                                  },
                                ],
                                "component": {
                                  "name": "Core:Fragment",
                                },
                              },
                            ],
                            "code": {
                              "actions": {},
                              "bindings": {},
                            },
                            "component": {
                              "name": "Core:Fragment",
                            },
                          },
                        ],
                        "jsCode": "",
                        "tsCode": "",
                      },
                    },
                  },
                },
              },
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });
});
