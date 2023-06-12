import { NextResponse } from "next/server";

export const LResponseError = (msg?: any, error = -1) => {
  const json: any = { error };
  if (msg) json["msg"] = msg;

  return NextResponse.json({ error, msg }, { status: 500 });
};
