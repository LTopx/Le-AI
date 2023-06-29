import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import type { ChannelCost } from "@/hooks";
import { Button, Divider, Modal, Icon } from "@/components/ui";
import down_fill from "@iconify/icons-mingcute/down-fill";

interface TokenProps {
  cost: ChannelCost | undefined;
}

const AccordionItem = React.forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => (
    <Accordion.Item
      className={cn(
        "overflow-hidden border-b border-neutral-300 dark:border-neutral-300/50",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={cn(
          "group cursor-pointer h-12 flex flex-1 items-center justify-between px-5 transition-colors",
          "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <span className="font-medium">{children}</span>
        <Icon
          icon={down_fill}
          size={16}
          className="transition-all group-data-[state=open]:rotate-180"
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => (
    <Accordion.Content
      className={cn(
        "data-[state=open]:animate-accordionSlideDown data-[state=closed]:animate-accordionSlideUp overflow-hidden text-sm",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-2 pl-9 pr-5 overflow-y-auto max-h-60">{children}</div>
    </Accordion.Content>
  )
);
AccordionContent.displayName = "AccordionContent";

const Token = React.forwardRef<any, TokenProps>(({ cost }, forwardedRef) => {
  const t = useTranslations("token");
  const tCommon = useTranslations("common");

  const [open, setOpen] = React.useState(false);

  const onClose = () => setOpen(false);

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setOpen(true);
    },
  }));

  if (!cost?.total_usd) return null;

  return (
    <Modal
      title={t("conversation-cost")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="primary" onClick={onClose}>
            {tCommon("ok")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col my-3 px-5 gap-3">
        <div>
          <div className="font-medium">{t("current-cost")}</div>
          <div className="text-sm">
            ${cost.usd} / {cost.tokens} Tokens
          </div>
        </div>
        <div>
          <div className="font-medium">{t("current-total-cost")}</div>
          <div className="text-sm">
            ${cost.total_usd} / {cost.total_tokens} Tokens
          </div>
        </div>
        <div>
          <a
            href="https://docs.ltopx.com/token"
            target="_blank"
            className="text-sm text-sky-500 hover:text-sky-400 transition-colors mx-0.5"
          >
            {t("learn-more")}
          </a>
        </div>
      </div>
      <Divider />
      <Accordion.Root type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("what-is-token")}</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
              <li>{t("token-desc")}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{t("how-token-work")}</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
              <li>{t("how-token-work-1")}</li>
              <li>{t("how-token-work-2")}</li>
              <li>{t("how-token-work-3")}</li>
              <li>{t("how-token-work-4")}</li>
              <li>
                <a
                  href="https://platform.openai.com/docs/guides/chat"
                  target="_blank"
                  className="text-sky-500 hover:text-sky-400 transition-colors"
                >
                  {t("know-more")}
                </a>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>{t("how-to-cost")}</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
              <li>{t("how-to-cost-1")}</li>
              <li>
                {t("how-to-cost-2-1")}
                <a
                  href="https://github.com/openai/tiktoken"
                  target="_blank"
                  className="text-sky-500 hover:text-sky-400 transition-colors mx-0.5"
                >
                  openai/tiktoken
                </a>
                {t("how-to-cost-2-2")}
              </li>
              <li>{t("how-to-cost-3")}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion.Root>
    </Modal>
  );
});

Token.displayName = "Token";

export default Token;
