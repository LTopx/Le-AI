import React from "react";
import { useTranslations } from "next-intl";
import type { ChannelCost } from "@/hooks/useChannel/types";
import {
  Modal,
  Button,
  Divider,
  Accordion,
  type AccordionItem,
} from "@ltopx/lx-ui";

interface TokenProps {
  cost: ChannelCost;
}

const Token = React.forwardRef<any, TokenProps>(({ cost }, forwardedRef) => {
  const tGlobal = useTranslations("global");
  const tChat = useTranslations("chat");
  const tToken = useTranslations("token");

  const [open, setOpen] = React.useState(false);

  const items: AccordionItem[] = [
    {
      label: tToken("what-is-token"),
      value: "item-1",
      children: (
        <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
          <li>{tToken("token-desc")}</li>
        </ul>
      ),
    },
    {
      label: tToken("how-token-work"),
      value: "item-2",
      children: (
        <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
          <li>{tToken("how-token-work-1")}</li>
          <li>{tToken("how-token-work-2")}</li>
          <li>{tToken("how-token-work-3")}</li>
          <li>{tToken("how-token-work-4")}</li>
          <li>
            <a
              href="https://platform.openai.com/docs/guides/chat"
              target="_blank"
              className="text-sky-500 hover:text-sky-400 transition-colors"
            >
              {tGlobal("learn-more")}
            </a>
          </li>
        </ul>
      ),
    },
    {
      label: tToken("how-to-cost"),
      value: "item-3",
      children: (
        <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
          <li>{tToken("how-to-cost-1")}</li>
          <li>
            {tToken("how-to-cost-2-1")}
            <a
              href="https://github.com/openai/tiktoken"
              target="_blank"
              className="text-sky-500 hover:text-sky-400 transition-colors mx-0.5"
            >
              openai/tiktoken
            </a>
            {tToken("how-to-cost-2-2")}
          </li>
          <li>{tToken("how-to-cost-3")}</li>
        </ul>
      ),
    },
  ];

  const onClose = () => setOpen(false);

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setOpen(true);
    },
  }));

  if (!cost?.total_usd) return null;

  return (
    <Modal
      title={tToken("conversation-cost")}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <div className="flex flex-col my-3 px-5 gap-3">
        <div>
          <div className="font-medium text-base">
            {tChat("current-content")}
          </div>
          <div className="text-sm">
            ${cost?.usd} / {cost?.tokens} Tokens
          </div>
        </div>
        <div>
          <div className="font-medium text-base">
            {tToken("current-total-cost")}
          </div>
          <div className="text-sm">
            ${cost?.total_usd} / {cost?.total_tokens} Tokens
          </div>
        </div>
        <div className="flex">
          <Button
            className="pl-0"
            type="link"
            href="https://docs.le-ai.app/token"
            target="_blank"
          >
            {tGlobal("learn-more")}
          </Button>
        </div>
      </div>
      <Divider />
      <Accordion items={items} />
    </Modal>
  );
});

Token.displayName = "Token";

export default Token;
