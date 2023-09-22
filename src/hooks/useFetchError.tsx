import { useTranslations } from "next-intl";

export const useFetchError = () => {
  const tGlobal = useTranslations("global");
  const tCode = useTranslations("code");

  const catchError = ({ error, msg }: { error: number; msg: string }) => {
    try {
      const text = tCode(String(error));

      // if includes `errorCode.`, it means the error code is not defined in the translation file
      if (text.includes("errorCode.")) return msg || tGlobal("service-error");
      return text;
    } catch (error) {
      return msg || tGlobal("service-error");
    }
  };

  return { catchError };
};
