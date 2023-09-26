"use client";

import React from "react";
import { useTranslations, useFormatter } from "next-intl";
import { useClipboard } from "l-hooks";
import toast from "react-hot-toast";
import { Button, Dropdown, type DropdownOption } from "@ltopx/lx-ui";
import { useFetchError } from "@/hooks/useFetchError";
import EditToken from "@/components/account/token/edit";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageToken() {
  const format = useFormatter();
  const tGlobal = useTranslations("global");
  const tAccount = useTranslations("account");

  const editTokenRef = React.useRef<any>(null);

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);

  const getOptions = (status: number): DropdownOption[] => {
    return [
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon="copy_2_line" size={18} />
            <div>{tGlobal("copy")}</div>
          </div>
        ),
        value: "copy",
      },
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon="pencil_2_line" size={18} />
            <div>{tGlobal("edit")}</div>
          </div>
        ),
        value: "edit",
      },
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon={status ? "stop_fill" : "play_fill"} size={18} />
            <div>{status ? tGlobal("disable") : tGlobal("enable")}</div>
          </div>
        ),
        value: "toggle_status",
      },
      {
        label: (
          <div className="flex w-[74px] items-center justify-between">
            <Icon icon="delete_2_line" size={18} />
            <div>{tGlobal("delete")}</div>
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
      toast.success(tGlobal("operation-successful"), {
        id: "operation-successful",
      });
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
        toast.success(tGlobal("operation-successful"));
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
        toast.success(tGlobal("operation-successful"));
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
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{tGlobal("token")}</h3>
          <p className="text-sm text-muted-foreground">
            {tAccount("token-manage-tip")}
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-end">
            <Button type="primary" onClick={onAdd}>
              {tGlobal("create")}
            </Button>
          </div>
          <Table className="min-w-[760px] overflow-x-auto">
            <TableHeader>
              <TableRow>
                <TableHead>{tGlobal("name")}</TableHead>
                <TableHead>{tGlobal("status")}</TableHead>
                <TableHead>{tGlobal("usage")}</TableHead>
                <TableHead>{tGlobal("remain")}</TableHead>
                <TableHead>{tGlobal("create-time")}</TableHead>
                <TableHead>{tGlobal("expire-date")}</TableHead>
                <TableHead>{tGlobal("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.key}>
                  <TableCell className="whitespace-nowrap">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="h-6 text-xs px-2"
                      size="sm"
                      type={item.status ? "success" : "danger"}
                      outline
                    >
                      {item.status ? tGlobal("enabled") : tGlobal("disabled")}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.used_quota}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.total_quota === -1
                      ? tGlobal("unlimited")
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
                      : tGlobal("forever")}
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
      </div>
      <EditToken ref={editTokenRef} onLoad={getData} />
    </>
  );
}
