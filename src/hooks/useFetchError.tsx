import { useTranslations } from "next-intl";

export const useFetchError = () => {
  const tErrorCode = useTranslations("errorCode");
  const tCommon = useTranslations("common");

  const catchError = ({ error, msg }: { error: number; msg: string }) => {
    try {
      const text = tErrorCode(String(error));

      // if includes `errorCode.`, it means the error code is not defined in the translation file
      if (text.includes("errorCode.")) return msg || tCommon("service-error");
      return text;
    } catch (error) {
      return msg || tCommon("service-error");
    }
  };

  return { catchError };
};
