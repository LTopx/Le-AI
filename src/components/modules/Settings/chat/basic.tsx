import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useSettingsStore } from '@/store/settings'

export function Basic() {
  const [recommended, setRecommended] = useSettingsStore((state) => [
    state.generate_recommended_questions,
    state.updateGenerateRecommendedQuestions,
  ])

  return (
    <Card>
      <CardHeader className="p-[18px]">
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Basic Settings
        </h4>
        <CardDescription>Basic settings for conversations</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-lg bg-[#fafafa] px-[18px] py-2.5 text-sm">
        <div className="flex h-10 items-center justify-between rounded-md ">
          <div>Generate recommended questions</div>
          <Switch checked={recommended} onCheckedChange={setRecommended} />
        </div>
        {/* <Separator />
        <div className="flex h-10 items-center justify-between rounded-md ">
          <div>asfasfasfasf</div>
          <Switch />
        </div> */}
      </CardContent>
    </Card>
  )
}
