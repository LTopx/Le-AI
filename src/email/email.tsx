import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function Email(props: any) {
  const { url } = props;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-8">
              <Img
                src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png"
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-2xl font-normal text-center p-0 my-8 mx-0">
              Sign in to <strong>Le-AI</strong>
            </Heading>
            <Text className="text-black text-sm leading-[24px]">
              Hello, you are sign in to <strong>Le-AI</strong>. Click the button
              below to sign in.
            </Text>
            <Section className="text-center my-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-sky-400 rounded-md text-white text-sm font-semibold no-underline text-center"
                href={url}
              >
                Sign in
              </Button>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-xs leading-[24px]">
              This email was intended for sign in to{" "}
              <span className="text-black">Le-AI</span>. If you did not request
              this email, you can ignore it. If you are concerned about your
              account's safety, please reply to this email to get in touch with
              us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
