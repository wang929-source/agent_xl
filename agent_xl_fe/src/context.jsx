import { createContext } from 'react';

export const GlobalContext = createContext({
  lang: navigator.language.includes('zh') ? 'zh-CN' : 'en-US'
});
