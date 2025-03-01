
export const LanguageIdExtMap = {
  javascript: 'js',
  typescript: 'ts',
  javascriptreact: 'jsx',
  typescriptreact: 'tsx',
  vue: 'vue',
  'vue-html': 'vue',
  json: 'json',
  html: 'html',
  dart: 'dart',
  php: 'php',
  ejs: 'ejs',
  ruby: 'rb',
  erb: 'erb',
  haml: 'haml',
  handlebars: 'hbs',
  blade: 'php',
}

export type LanguageId = keyof typeof LanguageIdExtMap

export function getExtOfLanguageId(id: LanguageId) {
  return LanguageIdExtMap[id] || id
}
