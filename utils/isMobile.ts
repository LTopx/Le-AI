export function isMobile() {
  var userAgentInfo = navigator.userAgent;

  var mobileAgents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];

  var mobile_flag = false;

  // by userAgent
  for (var v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }
  var screen_width = window.screen.width;
  var screen_height = window.screen.height;

  // by screen width
  if (screen_width > 325 && screen_height < 768) {
    mobile_flag = true;
  }

  return mobile_flag;
}
