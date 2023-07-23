import { NextResponse } from "next/server";
import { ResErr } from "@/lib";

export async function GET() {
  const key = process.env.NEXT_PUBLIC_AZURE_TTS_KEY || "";
  const region = process.env.NEXT_PUBLIC_AZURE_TTS_REGION || "";

  const URL = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`;

  try {
    const data = await fetch(URL, {
      headers: { "Ocp-Apim-Subscription-Key": key },
    }).then((res) => res.json());

    return NextResponse.json({ error: 0, data }, { status: 200 });
  } catch (error) {
    console.log("get azure tts voices list error");
    return ResErr({ msg: "get azure tts voices list error" });
  }
}
