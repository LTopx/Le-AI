import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useModelsStore } from '@/store/models'

export function OpenAI() {
  const keyRef = useRef<HTMLInputElement>(null)
  const endpointRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [openai, setOpenAI] = useModelsStore((state) => [
    state.openai,
    state.updateOpenai,
  ])

  const onRemove = () => {
    setOpenAI({ key: '', endpoint: '', error: true })
    keyRef.current!.value = ''
    endpointRef.current!.value = ''
  }

  const validate = () => {
    const key = keyRef.current?.value?.trim() || ''
    const endpoint = endpointRef.current?.value?.trim() || ''

    if (!key) {
      keyRef.current?.focus()
      return toast.error('API Key is required.')
    }

    const url = `${endpoint || 'https://api.openai.com'}/v1/chat/completions`

    setLoading(true)

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello' }],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(
            'Invalid API key. Please make sure your API key is still working properly.',
          )
          onRemove()
        } else {
          toast.success('API key is valid.')
          setOpenAI({ key, endpoint, error: false })
        }
      })
      .catch(() => {
        toast.error(
          'Invalid API key. Please make sure your API key is still working properly.',
        )
        onRemove()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Card>
      <CardHeader className="p-[18px]">
        <h4 className="flex scroll-m-20 items-center gap-2 text-lg font-semibold tracking-tight">
          <span>OpenAI</span>
          {openai.error ? (
            <span className="i-ri-error-warning-fill h-5 w-5 text-red-500" />
          ) : (
            <span className="i-mingcute-check-circle-fill h-5 w-5 text-lime-500" />
          )}
        </h4>
      </CardHeader>
      <CardContent className="px-[18px] pb-[18px]">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="openai-key">API Key</Label>
            <Input
              id="openai-key"
              ref={keyRef}
              placeholder="sk-xxxxxx"
              defaultValue={openai.key}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="openai-endpoint">API Endpoint</Label>
            <Input
              id="openai-endpoint"
              ref={endpointRef}
              placeholder="https://api.openai.com"
              defaultValue={openai.endpoint}
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
              <span className="i-mingcute-delete-2-line" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
