// get the platform of the user

export type Platform = "windows" | "mac";

export const getPlatform = (): Platform => {
  const agent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
    return "windows";
  }
  if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
    return "windows";
  }
  if (isMac) return "mac";
  return "windows";
};
