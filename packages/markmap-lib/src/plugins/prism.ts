import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { IAssets, ITransformHooks } from '../types';
import config from './prism.config';

export { config };
export const name = 'prism';
export function transform(transformHooks: ITransformHooks): IAssets {
  let enableFeature = () => {};
  transformHooks.parser.tap((md) => {
    md.set({
      highlight: (str: string, lang: string) => {
        enableFeature();
        let grammar = Prism.languages[lang];
        if (!grammar && lang) {
          loadLanguages([lang]);
          grammar = Prism.languages[lang];
        }
        if (grammar) {
          return Prism.highlight(str, grammar, lang);
        }
        return '';
      },
    });
  });
  transformHooks.beforeParse.tap((_, context) => {
    enableFeature = () => {
      context.features[name] = true;
    };
  });
  return {
    styles: config.styles,
  };
}
