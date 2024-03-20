import { ModelSelect } from './modelSelect'
import { PluginSelect } from './pluginSelect'
import { ToggleMenu } from './toggleMenu'

export function Headers() {
  return (
    <div className="flex h-12 items-center gap-2 border-b border-b-[#e9e9e9] px-3">
      <ToggleMenu />
      <ModelSelect />
      <PluginSelect />
    </div>
  )
}
