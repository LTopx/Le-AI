import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getRequestInfo } from '@/store/chat/utils'
import { useModelsStore } from '@/store/models'

export function Claude() {
  const keyRef = useRef<HTMLInputElement>(null)
  const endpointRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const [claude, setClaude] = useModelsStore((state) => [
    state.claude,
    state.updateClaude,
  ])

  const onRemove = () => {
    setClaude({ key: '', endpoint: '', error: true })
    keyRef.current!.value = ''
    endpointRef.current!.value = ''
  }

  const validate = () => {
    if (loading) return

    const key = keyRef.current?.value?.trim() || ''
    let endpoint = endpointRef.current?.value?.trim() || ''
    if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1)

    if (!key) {
      keyRef.current?.focus()
      return toast.error('API Key is required.')
    }

    const requestInfo = getRequestInfo('claude', key, endpoint)

    const url = `${requestInfo.endpoint}/v1/messages`

    setLoading(true)

    fetch(url, {
      method: 'POST',
      headers: requestInfo.headers,
      body: JSON.stringify({
        model: 'claude-instant-1.2',
        messages: [{ role: 'user', content: 'say hello' }],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(
            'Invalid API key. Please make sure your API key is still working properly.',
          )
          setClaude({ key: '', endpoint: '', error: true })
        } else {
          toast.success('API key is valid.')
          setClaude({ key, endpoint, error: false })
        }
      })
      .catch(() => {
        toast.error(
          'Invalid API key. Please make sure your API key is still working properly.',
        )
        setClaude({ key: '', endpoint: '', error: true })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Card>
      <CardHeader className="p-[18px]">
        <h4 className="flex scroll-m-20 items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="i-logos-anthropic-icon -mr-1" />
          <span>Claude</span>
          {claude.error ? (
            <span className="i-ri-error-warning-fill h-5 w-5 text-red-500" />
          ) : (
            <span className="i-mingcute-check-circle-fill h-5 w-5 text-lime-500" />
          )}
        </h4>
      </CardHeader>
      <CardContent className="px-[18px] pb-[18px]">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="claude-key">API Key</Label>
            <Input
              id="claude-key"
              ref={keyRef}
              placeholder="sk-ant-xxxxxx"
              defaultValue={claude.key}
              onKeyDown={(e) =>
                e.key === 'Enter' && endpointRef.current?.focus()
              }
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="claude-endpoint">API Endpoint</Label>
            <Input
              id="claude-endpoint"
              ref={endpointRef}
              placeholder="https://api.anthropic.com"
              defaultValue={claude.endpoint}
              onKeyDown={(e) => e.key === 'Enter' && validate()}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="select-none gap-2"
              size="sm"
              disabled={loading}
              onClick={validate}
            >
              {loading ? (
                <span className="i-mingcute-loading-line h-4 w-4 animate-spin" />
              ) : (
                <span className="i-mingcute-rocket-line h-4 w-4" />
              )}
              Save
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="select-none gap-2"
              onClick={onRemove}
            >
              <span className="i-mingcute-broom-line h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
