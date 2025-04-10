import { ToStencilOptions } from '@/generators/stencil/types';
import { ProcessBindingOptions, processClassComponentBinding } from '@/helpers/class-components';
import { CODE_PROCESSOR_PLUGIN } from '@/helpers/plugins/process-code';
import { MitosisComponent } from '@/types/mitosis-component';

export const getCodeProcessorPlugins = (
  json: MitosisComponent,
  options: ToStencilOptions,
  processBindingOptions: ProcessBindingOptions,
) => {
  return [
    ...(options.plugins || []),
    CODE_PROCESSOR_PLUGIN((codeType) => {
      switch (codeType) {
        case 'bindings':
        case 'properties':
        case 'hooks':
        case 'hooks-deps':
        case 'hooks-deps-array':
        case 'state':
        case 'context-set':
        case 'dynamic-jsx-elements':
        case 'types':
          return (code) => processClassComponentBinding(json, code, processBindingOptions);
      }
    }),
  ];
};
