import { NextResponse } from "next/server";

interface IResErr {
  msg?: any;
  error?: number;
}

interface IResSuccess {
  data?: any;
  error?: number;
}

export const ResErr = ({ msg, error = -1 }: IResErr) => {
  return NextResponse.json(
    { error, msg },
    {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
};

export const ResSuccess = (params?: IResSuccess) => {
  const obj: any = { error: params?.error || 0 };
  if (params?.data) obj.data = params.data;
  return NextResponse.json(obj, { status: 200 });
};
