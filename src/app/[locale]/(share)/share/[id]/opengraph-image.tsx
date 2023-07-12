import { ImageResponse } from "next/server";

const UserFill = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g fill="none">
      <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <path
        fill="#fff"
        d="M12 13c2.396 0 4.575.694 6.178 1.671c.8.49 1.484 1.065 1.978 1.69c.486.616.844 1.352.844 2.139c0 .845-.411 1.511-1.003 1.986c-.56.45-1.299.748-2.084.956c-1.578.417-3.684.558-5.913.558s-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C3.41 20.01 3 19.345 3 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69C7.425 13.694 9.605 13 12 13Zm0-11a5 5 0 1 1 0 10a5 5 0 0 1 0-10Z"
      />
    </g>
  </svg>
);

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://chat.ltopx.com";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "LGPT Share";
export const size = { width: 1200, height: 630 };
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
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          fontSize: 28,
          fontFamily: 'Inter, "Material Icons"',
        }}
      >
        <div
          lang="zh-CN"
          style={{ fontSize: 60, fontWeight: "bold", marginBottom: 50 }}
        >
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
                    <UserFill />
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
                  lang="zh-CN"
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
