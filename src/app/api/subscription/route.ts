import { ResErr, ResSuccess } from "@/lib";

const getEnvProxyUrl = () => {
  const API_PROXY = process.env.NEXT_PUBLIC_OPENAI_API_PROXY;
  if (!API_PROXY) return "";
  if (API_PROXY[API_PROXY.length - 1] === "/")
    return API_PROXY.slice(0, API_PROXY.length - 1);
  return API_PROXY;
};

const getDate = (type: "start" | "end") => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const nextMonth = new Date(year, month, 0);
  const maxDay = nextMonth.getDate();

  if (type === "start") return `${year}-${month < 10 ? "0" + month : month}-01`;
  if (type === "end")
    return `${year}-${month < 10 ? "0" + month : month}-${maxDay}`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const model = searchParams.get("model");
  const key = searchParams.get("key");
  const proxyUrl = searchParams.get("proxy");

  if (!model || !key) return ResErr({ error: 20008 });

  const ENV_API_PROXY = getEnvProxyUrl();
  const proxy = proxyUrl || ENV_API_PROXY || "https://api.openai.com";
  const fetchURL1 = proxy + "/dashboard/billing/subscription";
  const fetchURL2 =
    proxy +
    `/dashboard/billing/usage?start_date=${getDate("start")}&end_date=${getDate(
      "end"
    )}`;

  try {
    const res1 = await fetch(fetchURL1, {
      headers: { Authorization: `Bearer ${key}` },
    }).then(async (res) => res.json());
    if (res1.error) {
      return ResErr({ msg: res1.error });
    } else {
      const res2 = await fetch(fetchURL2, {
        headers: { Authorization: `Bearer ${key}` },
      }).then(async (res) => res.json());
      if (res2.error) {
        return ResErr({ msg: res2.error });
      } else {
        return ResSuccess({
          data: { ...res1, total_usage: res2.total_usage / 100 },
        });
      }
    }
  } catch (error: any) {
    return ResErr({ msg: "error" });
  }
}
