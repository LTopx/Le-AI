import { OpenAI } from './openai'

export function Models() {
  return (
    <div className="grid w-full items-center gap-4">
      <OpenAI />
      {/* <Card>
        <CardHeader className="p-[18px]">
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Claude
          </h4>
        </CardHeader>
        <CardContent className="px-[18px] pb-[18px]">
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">API Key</Label>
                <Input id="name" placeholder="API Key" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">API Endpoint</Label>
                <Input id="framework" placeholder="API Endpoint" />
              </div>
            </div>
          </form>
        </CardContent>
      </Card> */}
    </div>
  )
}
