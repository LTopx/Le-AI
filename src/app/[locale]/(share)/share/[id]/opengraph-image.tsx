import { ImageResponse } from "next/server";
import { AiOutlineUser } from "react-icons/ai";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://gpt.ltopx.com";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "LGPT Share";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: { id: string };
};

async function getShareData(id: string) {
  try {
    const res = await fetch(`${baseURL}/api/share?id=${id}`).then((res) =>
      res.json()
    );
    if (res.error) return null;
    return res.data;
  } catch (error) {
    return null;
  }
}

// Image generation
export default async function Image({ params }: Props) {
  const content = await getShareData(params.id);
  const title = content?.channel_name || "Unnamed";
  const chat_list: any[] = content?.chat_content?.slice(0, 2) || [];

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: "bold", marginBottom: 50 }}>
          {title}
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 30,
            paddingLeft: 100,
            paddingRight: 100,
          }}
        >
          {chat_list.map((item) => (
            <div
              key={item.id}
              style={{ fontSize: 30, display: "flex", gap: 12 }}
            >
              <div style={{ opacity: 0 }}>1</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    backgroundColor:
                      item.role === "user" ? "rgb(0 0 0 / 0.25)" : "#20a37f",
                    height: 36,
                    width: 36,
                  }}
                >
                  {item.role === "user" ? (
                    <AiOutlineUser style={{ color: "#fff" }} size={24} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${baseURL}/gpt.svg`}
                      alt="gpt"
                      width="24"
                      height="24"
                    />
                  )}
                </div>
              </div>
              <div style={{ display: "flex", flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    maxWidth: "80%",
                    backgroundColor:
                      item.role === "user"
                        ? "rgb(229 229 229 / 0.6)"
                        : "rgb(191 219 254 / 0.7)",
                    padding: "5px 15px",
                    borderRadius: 10,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                    fontWeight: "normal",
                  }}
                >
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 70,
            display: "flex",
            fontSize: 26,
            fontWeight: "bold",
            gap: 10,
          }}
        >
          <span>Powered by</span>
          <span
            style={{
              color: "transparent",
              backgroundClip: "text",
              backgroundImage:
                "linear-gradient(to right top,#d16ba5,#c777b9,#ba83ca,#aa8fd8,#9a9ae1,#8aa7ec,#79b3f4,#69bff8,#52cffe,#41dfff,#46eefa,#5ffbf1)",
            }}
          >
            LGPT
          </span>
          <span
            style={{
              color: "transparent",
              backgroundClip: "text",
              backgroundImage:
                "linear-gradient(to right top,#d16ba5,#c777b9,#ba83ca,#aa8fd8,#9a9ae1,#8aa7ec,#79b3f4,#69bff8,#52cffe,#41dfff,#46eefa,#5ffbf1)",
            }}
          >
            Share
          </span>
        </div>
      </div>
    )
  );
}
