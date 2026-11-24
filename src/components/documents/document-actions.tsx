"use client";

import {
  deleteDocumentAction,
  reprocessDocumentAction,
} from "@/app/(app)/documents/actions";
import { type DocumentListItem } from "@/lib/db/storage";
import { useState, useTransition } from "react";
import { toast } from "../ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Download, Ellipsis, Loader2, RefreshCw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type DocumentActionsProps = {
  document: DocumentListItem;
};

export function DocumentActions({ document }: DocumentActionsProps) {
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteDocumentAction(document.id);
      if (result.success) {
        toast.add({
          type: "success",
          description: result.message,
        });
        setDeleteOpen(false);
      } else {
        toast.add({
          type: "error",
          description: result.message,
        });
      }
    });
  };

  const handleReprocess = () => {
    startTransition(async () => {
      const result = await reprocessDocumentAction(document.id);
      if (result.success) {
        toast.add({
          type: "success",
          description: result.message,
        });
      } else {
        toast.add({
          type: "error",
          description: result.message,
        });
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              disabled={pending}
              aria-label="Akce dokumentů"
            />
          }
        >
          {pending ? <Loader2 className="animate-spin" /> : <Ellipsis />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => (window.location.href = `/api/files/${document.id}`)}
          >
            <Download /> Stáhnout
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReprocess}>
            <RefreshCw /> Znovu zpracovat
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 /> Smazat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat dokument?</AlertDialogTitle>
            <AlertDialogDescription>
              Dokument {document.name} bude trvale odstraněn. Tato operace je
              nevratná.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Zrušit</AlertDialogCancel>
            <Button variant="destructive" disabled={pending} onClick={handleDelete}>{pending ? "Mažu..." : "Smazat"}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
