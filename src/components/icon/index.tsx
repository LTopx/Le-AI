import { IconProps } from "./types";
import { Loading_line } from "./loading_line";
import { Azure } from "./azure";
import { Openai } from "./openai";
import { Check_line } from "./check_line";
import { Question_line } from "./question_line";
import { Refresh_3_line } from "./refresh_3_line";
import { Translate_line } from "./translate_line";
import { Gift_fill } from "./gift_fill";
import { Copy_2_line } from "./copy_2_line";
import { Stop_fill } from "./stop_fill";
import { Share_2_line } from "./share_2_line";
import { Document_line } from "./document_line";
import { Broom_line } from "./broom_line";
import { Send_line } from "./send_line";
import { User_3_fill } from "./user_3_fill";
import { Delete_2_line } from "./delete_2_line";
import { Play_fill } from "./play_fill";
import { Chat_4_line } from "./chat_4_line";
import { Pen_line } from "./pen_line";
import { Translate_2_line } from "./translate_2_line";
import { Book_2_fill } from "./book_2_fill";
import { Sailboat_line } from "./sailboat_line";
import { Code_line } from "./code_line";
import { Film_line } from "./film_line";
import { Alert_octagon_fill } from "./alert_octagon_fill";
import { Arrow_to_up_line } from "./arrow_to_up_line";
import { Key_2_line } from "./key_2_line";
import { Telegram_fill } from "./telegram_fill";
import { Moon_fill } from "./moon_fill";
import { Sun_line } from "./sun_line";
import { Github_line } from "./github_line";
import { Settings_3_line } from "./settings_3_line";
import { Indent_increase_line } from "./indent_increase_line";
import { Pencil_2_line } from "./pencil_2_line";
import { Down_fill } from "./down_fill";
import { Arrow_right_down_fill } from "./arrow_right_down_fill";
import { Check_circle_fill } from "./check_circle_fill";
import { Vip_2_fill } from "./vip_2_fill";
import { Group_fill } from "./group_fill";
import { Bug_fill } from "./bug_fill";
import { Store_line } from "./store_line";
import { Bling_line } from "./bling_line";
import { Mosaic_line } from "./mosaic_line";
import { Search_3_line } from "./search_3_line";
import { Check_2_fill } from "./check_2_fill";
import { Align_arrow_up_line } from "./align_arrow_up_line";
import { List_expansion_fill } from "./list_expansion_fill";
import { Lightning_fill } from "./lightning_fill";
import { Upload_3_line } from "./upload_3_line";
import { Download_3_line } from "./download_3_line";
import { User_hide_line } from "./user_hide_line";
import { Twitter_fill } from "./twitter_fill";
import { Link_line } from "./link_line";
import { External_link_line } from "./external_link_line";
import { More_1_fill } from "./more_1_fill";
import { Left_fill } from "./left_fill";
import { Time_line } from "./time_line";
import { User_visible_line } from "./user_visible_line";
import { Navigation_fill } from "./navigation_fill";
import { Google_line } from "./google_line";
import { Vip_3_line } from "./vip_3_line";
import { User_3_line } from "./user_3_line";
import { Exit_line } from "./exit_line";
import { Entrance_line } from "./entrance_line";
import { User_add_2_line } from "./user_add_2_line";
import { Chart_pie_line } from "./chart_pie_line";
import { Lightning_line } from "./lightning_line";
import { Warning_fill } from "./warning_fill";
import { Close_line } from "./close_line";
import { Check_fill } from "./check_fill";
import { Command_line } from "./command_line";
import { Add_line } from "./add_line";
import { Menu_line } from "./menu_line";
import { Star_line } from "./star_line";
import { Angel_fill } from "./angel_fill";
import { Unlock_line } from "./unlock_line";
import { Game_2_line } from "./game_2_line";
import { Star_fill } from "./star_fill";
import { Pencil_line } from "./pencil_line";
import { Plugin_2_line } from "./plugin_2_line";
import { Open_Router } from "./open_router";
import { Cloud_fill } from "./cloud_fill";
import { Contacts_line } from "./contacts_line";
import { Cloud_line } from "./cloud_line";
import { Safe_alert_line } from "./safe_alert_line";
import { Bell_ringing_line } from "./bell_ringing_line";

const Icon: React.FC<IconProps> = (props) => {
  const { icon } = props;

  if (icon === "bell_ringing_line") return <Bell_ringing_line {...props} />;

  if (icon === "safe_alert_line") return <Safe_alert_line {...props} />;

  if (icon === "cloud_line") return <Cloud_line {...props} />;

  if (icon === "contacts_line") return <Contacts_line {...props} />;

  if (icon === "cloud_fill") return <Cloud_fill {...props} />;

  if (icon === "open_router") return <Open_Router {...props} />;

  if (icon === "plugin_2_line") return <Plugin_2_line {...props} />;

  if (icon === "pencil_line") return <Pencil_line {...props} />;

  if (icon === "star_fill") return <Star_fill {...props} />;

  if (icon === "game_2_line") return <Game_2_line {...props} />;

  if (icon === "unlock_line") return <Unlock_line {...props} />;

  if (icon === "angel_fill") return <Angel_fill {...props} />;

  if (icon === "star_line") return <Star_line {...props} />;

  if (icon === "menu_line") return <Menu_line {...props} />;

  if (icon === "add_line") return <Add_line {...props} />;

  if (icon === "command_line") return <Command_line {...props} />;

  if (icon === "check_fill") return <Check_fill {...props} />;

  if (icon === "close_line") return <Close_line {...props} />;

  if (icon === "warning_fill") return <Warning_fill {...props} />;

  if (icon === "lightning_line") return <Lightning_line {...props} />;

  if (icon === "chart_pie_line") return <Chart_pie_line {...props} />;

  if (icon === "user_add_2_line") return <User_add_2_line {...props} />;

  if (icon === "entrance_line") return <Entrance_line {...props} />;

  if (icon === "exit_line") return <Exit_line {...props} />;

  if (icon === "user_3_line") return <User_3_line {...props} />;

  if (icon === "vip_3_line") return <Vip_3_line {...props} />;

  if (icon === "google_line") return <Google_line {...props} />;

  if (icon === "navigation_fill") return <Navigation_fill {...props} />;

  if (icon === "user_visible_line") return <User_visible_line {...props} />;

  if (icon === "time_line") return <Time_line {...props} />;

  if (icon === "left_fill") return <Left_fill {...props} />;

  if (icon === "more_1_fill") return <More_1_fill {...props} />;

  if (icon === "external_link_line") return <External_link_line {...props} />;

  if (icon === "link_line") return <Link_line {...props} />;

  if (icon === "twitter_fill") return <Twitter_fill {...props} />;

  if (icon === "user_hide_line") return <User_hide_line {...props} />;

  if (icon === "download_3_line") return <Download_3_line {...props} />;

  if (icon === "upload_3_line") return <Upload_3_line {...props} />;

  if (icon === "lightning_fill") return <Lightning_fill {...props} />;

  if (icon === "list_expansion_fill") return <List_expansion_fill {...props} />;

  if (icon === "align_arrow_up_line") return <Align_arrow_up_line {...props} />;

  if (icon === "check_2_fill") return <Check_2_fill {...props} />;

  if (icon === "search_3_line") return <Search_3_line {...props} />;

  if (icon === "mosaic_line") return <Mosaic_line {...props} />;

  if (icon === "bling_line") return <Bling_line {...props} />;

  if (icon === "store_line") return <Store_line {...props} />;

  if (icon === "bug_fill") return <Bug_fill {...props} />;

  if (icon === "group_fill") return <Group_fill {...props} />;

  if (icon === "vip_2_fill") return <Vip_2_fill {...props} />;

  if (icon === "check_circle_fill") return <Check_circle_fill {...props} />;

  if (icon === "indent_increase_line")
    return <Indent_increase_line {...props} />;

  if (icon === "arrow_right_down_fill")
    return <Arrow_right_down_fill {...props} />;

  if (icon === "down_fill") return <Down_fill {...props} />;

  if (icon === "pencil_2_line") return <Pencil_2_line {...props} />;

  if (icon === "settings_3_line") return <Settings_3_line {...props} />;

  if (icon === "github_line") return <Github_line {...props} />;

  if (icon === "sun_line") return <Sun_line {...props} />;

  if (icon === "moon_fill") return <Moon_fill {...props} />;

  if (icon === "telegram_fill") return <Telegram_fill {...props} />;

  if (icon === "key_2_line") return <Key_2_line {...props} />;

  if (icon === "arrow_to_up_line") return <Arrow_to_up_line {...props} />;

  if (icon === "alert_octagon_fill") return <Alert_octagon_fill {...props} />;

  if (icon === "film_line") return <Film_line {...props} />;

  if (icon === "code_line") return <Code_line {...props} />;

  if (icon === "sailboat_line") return <Sailboat_line {...props} />;

  if (icon === "book_2_fill") return <Book_2_fill {...props} />;

  if (icon === "translate_2_line") return <Translate_2_line {...props} />;

  if (icon === "pen_line") return <Pen_line {...props} />;

  if (icon === "chat_4_line") return <Chat_4_line {...props} />;

  if (icon === "play_fill") return <Play_fill {...props} />;

  if (icon === "delete_2_line") return <Delete_2_line {...props} />;

  if (icon === "user_3_fill") return <User_3_fill {...props} />;

  if (icon === "send_line") return <Send_line {...props} />;

  if (icon === "loading_line") return <Loading_line {...props} />;

  if (icon === "azure") return <Azure {...props} />;

  if (icon === "openai") return <Openai {...props} />;

  if (icon === "check_line") return <Check_line {...props} />;

  if (icon === "question_line") return <Question_line {...props} />;

  if (icon === "refresh_3_line") return <Refresh_3_line {...props} />;

  if (icon === "translate_line") return <Translate_line {...props} />;

  if (icon === "gift_fill") return <Gift_fill {...props} />;

  if (icon === "copy_2_line") return <Copy_2_line {...props} />;

  if (icon === "stop_fill") return <Stop_fill {...props} />;

  if (icon === "share_2_line") return <Share_2_line {...props} />;

  if (icon === "document_line") return <Document_line {...props} />;

  if (icon === "broom_line") return <Broom_line {...props} />;

  return null;
};

export default Icon;
