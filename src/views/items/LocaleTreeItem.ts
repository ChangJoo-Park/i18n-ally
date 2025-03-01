import { ExtensionContext, TreeItemCollapsibleState } from 'vscode'
import { Node, Translator, CurrentFile } from '../../core'
import { decorateLocale, NodeHelper, resolveFlattenRootKeypath, ROOT_KEY, resolveFlattenRoot } from '../../utils'
import { BaseTreeItem } from './Base'

export class LocaleTreeItem extends BaseTreeItem {
  public readonly node: Node
  constructor(ctx: ExtensionContext, node: Node, public flatten = false, public readonly displayLocale?: string, public readonly listedLocales?: string[]) {
    super(ctx)

    if (this.flatten && node.type !== 'record')
      this.node = resolveFlattenRoot(node)
    else
      this.node = node
  }

  get tooltip(): string {
    return resolveFlattenRootKeypath(this.node.keypath)
  }

  getLabel(): string {
    if (this.node.type === 'record') {
      return decorateLocale(this.node.locale)
    }
    else {
      return this.flatten
        ? resolveFlattenRootKeypath(this.node.keypath)
        : this.node.keyname === ROOT_KEY
          ? '<root>'
          : this.node.keyname
    }
  }

  get collapsibleState() {
    if (this.node.type === 'record')
      return TreeItemCollapsibleState.None
    else
      return TreeItemCollapsibleState.Collapsed
  }

  set collapsibleState(_) { }

  get description(): string {
    if (this.node.type === 'node')
      return this.node.getValue(this.displayLocale, true)
    if (this.node.type === 'record')
      return this.node.value
    return ''
  }

  get iconPath() {
    if (Translator.isTranslating(this.node))
      return this.getIcon('loading')
    if (this.node.type === 'record') {
      return this.getFlagIcon(this.node.locale)
    }
    else if (this.node.shadow) {
      return this.getIcon('icon-unknown')
    }
    else if (this.node.type === 'tree') {
      if (this.node.isCollection)
        return this.getIcon('collection')
      else
        return this.getIcon('namespace')
    }
    else if (this.node.type === 'node') {
      if (this.description)
        return this.getIcon('string')
      else
        return this.getIcon('string-missing')
    }
  }

  get contextValue() {
    const values: string[] = [this.node.type]
    if (NodeHelper.isTranslatable(this.node))
      values.push('translatable')
    if (NodeHelper.isOpenable(this.node))
      values.push('openable')
    if (NodeHelper.isEditable(this.node))
      values.push('editable')
    return values.join('-')
  }

  async getChildren(filter: (node: Node) => boolean = () => true) {
    let nodes: Node[] = []
    if (this.node.type === 'tree')
      nodes = Object.values(this.node.children)
    else if (this.node.type === 'node')
      nodes = Object.values(CurrentFile.loader.getShadowLocales(this.node, this.listedLocales))
    const items = nodes
      .filter(filter)
      .map(node => new LocaleTreeItem(this.ctx, node, false))
    return items
  }
}
