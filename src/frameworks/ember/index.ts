import { Framework } from '../base'
import { LanguageId } from '../../utils'

class EmberFramework extends Framework {
  id = 'ember'
  display= 'ember'

  detection= {
    packageJSON: [
      'ember-intl',
    ],
  }

  languageIds: LanguageId[] = [
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact',
    'handlebars',
  ]

  // for visualize the regex, you can use https://regexper.com/
  keyMatchReg = [
    '(?:{{\\s*t\\s+|[^\\w\\d]intl\\.t\\(\\s*)[\'"`]({key})[\'"`]',
  ]

  refactorTemplates(keypath: string) {
    return [
      `{{ t '${keypath}' }}`,
      `this.intl.t('${keypath}')`,
      keypath,
    ]
  }
}

export default EmberFramework
