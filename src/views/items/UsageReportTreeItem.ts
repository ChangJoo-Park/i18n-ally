import { ExtensionContext, TreeItemCollapsibleState } from 'vscode'
import { KeyUsage, LocaleNode, CurrentFile } from '../../core'
import { NodeHelper } from '../../utils'
import { LocaleTreeItem } from '.'

export class UsageReportTreeItem extends LocaleTreeItem {
  constructor(ctx: ExtensionContext, public readonly usage: KeyUsage) {
    super(ctx, CurrentFile.loader.getTreeNodeByKey(usage.keypath) || new LocaleNode({ shadow: true, keypath: usage.keypath }), true)
  }

  get length() {
    return this.usage.occurrences.length
  }

  get label() {
    if (this.length)
      return `${super.label} (${this.length})`
    return super.label
  }

  set label(_) { }
  get contextValue() {
    if (!this.length) {
      const values: string[] = [this.node.type]
      if (NodeHelper.isOpenable(this.node))
        values.push('openable')
      if (NodeHelper.isEditable(this.node))
        values.push('editable')
      return values.join('-')
    }
    return ''
  }

  get collapsibleState() {
    return this.length
      ? TreeItemCollapsibleState.Collapsed
      : TreeItemCollapsibleState.None
  }

  set collapsibleState(_) { }
}
