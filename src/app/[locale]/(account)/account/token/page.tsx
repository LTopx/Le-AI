"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import EditToken from "@/components/account/token/edit";
import { useOpenStore } from "@/hooks/useOpen";

export default function ManageToken() {
  const tAccount = useTranslations("account");
  const tCommon = useTranslations("common");

  const editTokenRef = React.useRef<any>(null);

  const onAdd = () => editTokenRef.current?.init();

  return (
    <>
      <div>
        <div className="text-2xl font-semibold">{tAccount("token-manage")}</div>
        <div className="text-sm my-4 flex justify-between items-center">
          <div>{tAccount("token-manage-tip")}</div>
          <Button type="primary" onClick={onAdd}>
            {tCommon("add")}
          </Button>
        </div>
        <Table classNames={{ wrapper: "max-w-[calc(100vw-2rem)]" }}>
          <TableHeader>
            <TableColumn>名称</TableColumn>
            <TableColumn>状态</TableColumn>
            <TableColumn>已使用额度</TableColumn>
            <TableColumn>剩余额度</TableColumn>
            <TableColumn>创建时间</TableColumn>
            <TableColumn>过期时间</TableColumn>
            <TableColumn>操作</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>测试</TableCell>
              <TableCell>已启用</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$1.00</TableCell>
              <TableCell>2023-08-20 23:13:49</TableCell>
              <TableCell>2023-08-20 23:14:47</TableCell>
              <TableCell>
                <div className="flex">
                  <Button size="sm">操作</Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>测试</TableCell>
              <TableCell>已启用</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$1.00</TableCell>
              <TableCell>2023-08-20 23:13:49</TableCell>
              <TableCell>2023-08-20 23:14:47</TableCell>
              <TableCell>
                <div className="flex">
                  <Button size="sm">操作</Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>测试</TableCell>
              <TableCell>已启用</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$1.00</TableCell>
              <TableCell>2023-08-20 23:13:49</TableCell>
              <TableCell>2023-08-20 23:14:47</TableCell>
              <TableCell>
                <div className="flex">
                  <Button size="sm">操作</Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell>测试</TableCell>
              <TableCell>已启用</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$1.00</TableCell>
              <TableCell>2023-08-20 23:13:49</TableCell>
              <TableCell>2023-08-20 23:14:47</TableCell>
              <TableCell>
                <div className="flex">
                  <Button size="sm">操作</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <EditToken ref={editTokenRef} />
    </>
  );
}
