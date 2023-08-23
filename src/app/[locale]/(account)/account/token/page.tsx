"use client";

import React from "react";
import { useTranslations, useFormatter } from "next-intl";
import { useClipboard } from "l-hooks";
import toast from "react-hot-toast";
import { Button, Dropdown, type DropdownOption } from "@ltopx/lx-ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useFetchError } from "@/hooks/useFetchError";
import EditToken from "@/components/account/token/edit";
import Icon from "@/components/icon";

export default function ManageToken() {
  const format = useFormatter();
  const tAccount = useTranslations("account");
  const tCommon = useTranslations("common");

  const editTokenRef = React.useRef<any>(null);

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);

  const getOptions = (status: number): DropdownOption[] => {
    return [
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon="copy_2_line" size={18} />
            <div>{tCommon("copy")}</div>
          </div>
        ),
        value: "copy",
      },
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon="pencil_2_line" size={18} />
            <div>{tCommon("edit")}</div>
          </div>
        ),
        value: "edit",
      },
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon={status ? "stop_fill" : "play_fill"} size={18} />
            <div>{status ? tCommon("disable") : tCommon("enable")}</div>
          </div>
        ),
        value: "toggle_status",
      },
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon="delete_2_line" size={18} />
            <div>{tCommon("delete")}</div>
          </div>
        ),
        value: "delete",
      },
    ];
  };

  const { copy } = useClipboard();
  const { catchError } = useFetchError();

  const onAdd = () => editTokenRef.current?.init();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/token").then((res) => res.json());
      setList(res.data);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = async (item: any, type: string) => {
    if (type === "copy") {
      copy(item.key);
      toast.success(tCommon("copy-success"), { id: "copy-success" });
    } else if (type === "toggle_status") {
      setLoading(true);
      try {
        const res = await fetch("/api/token", {
          method: "PUT",
          body: JSON.stringify({
            id: item.id,
            status: item.status ? 0 : 1,
          }),
        }).then((res) => res.json());
        if (res.error) {
          return toast.error(catchError(res), { id: "toggle_status_error" });
        }
        toast.success(tCommon("operation-successful"));
        getData();
      } finally {
        setLoading(false);
      }
    } else if (type === "delete") {
      setLoading(true);
      try {
        const res = await fetch("/api/token", {
          method: "DELETE",
          body: JSON.stringify({
            id: item.id,
          }),
        }).then((res) => res.json());
        if (res.error) {
          return toast.error(catchError(res), { id: "delete_error" });
        }
        toast.success(tCommon("operation-successful"));
        getData();
      } finally {
        setLoading(false);
      }
    } else if (type === "edit") {
      editTokenRef.current?.init(item);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>
        <div className="font-semibold text-2xl">{tAccount("token-manage")}</div>
        <div className="flex my-4 text-sm justify-between items-center">
          <div>{tAccount("token-manage-tip")}</div>
          <Button type="primary" onClick={onAdd}>
            {tCommon("add")}
          </Button>
        </div>
        <Table
          classNames={{
            wrapper:
              "overflow-auto max-w-[calc(100vw-48px)] md:max-w-[calc(100vw-300px)]",
          }}
        >
          <TableHeader>
            <TableColumn>{tAccount("token-name")}</TableColumn>
            <TableColumn>{tAccount("token-status")}</TableColumn>
            <TableColumn>{tAccount("token-usage")}</TableColumn>
            <TableColumn>{tAccount("token-remain")}</TableColumn>
            <TableColumn>{tAccount("token-create-time")}</TableColumn>
            <TableColumn>{tAccount("token-expire")}</TableColumn>
            <TableColumn>{tAccount("token-action")}</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={
              <div className="flex h-full bg-white/90 w-full justify-center items-center">
                <Icon icon="loading_line" size={18} className="animate-spin" />
              </div>
            }
            emptyContent={tCommon("no-data")}
          >
            {list.map((item) => (
              <TableRow key={item.key}>
                <TableCell className="whitespace-nowrap">{item.name}</TableCell>
                <TableCell>
                  <Button
                    className="h-6 text-xs px-2"
                    size="sm"
                    type={item.status ? "success" : "danger"}
                    outline
                  >
                    {item.status
                      ? tAccount("token-enabled")
                      : tAccount("token-disabled")}
                  </Button>
                </TableCell>
                <TableCell className="text-center">{item.used_quota}</TableCell>
                <TableCell className="text-center">
                  {item.total_quota === -1
                    ? tAccount("token-quota-unlimited")
                    : item.total_quota - item.used_quota}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format.dateTime(new Date(item.createdAt), {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.expire
                    ? format.dateTime(new Date(item.expire), {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      })
                    : tAccount("token-expire-unlimited")}
                </TableCell>
                <TableCell>
                  <Dropdown
                    options={getOptions(item.status)}
                    onSelect={(type) => onSelect(item, type)}
                  >
                    <div className="flex">
                      <Button size="sm">
                        <Icon icon="more_1_fill" />
                      </Button>
                    </div>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditToken ref={editTokenRef} onLoad={getData} />
    </>
  );
}
