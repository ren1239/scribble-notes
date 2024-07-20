"use client";
import { trpc } from "@/app/_trpc/client";
import { NoteCard } from "./NoteCard";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import NoteForm from "./NoteForm";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function ChatWrapper({ fileid }: { fileid: string }) {
  const { data: notes, isLoading } = trpc.getUserNotes.useQuery({
    fileId: fileid,
  });

  if (isLoading)
    return (
      <div className="grid gap-4">
        <Skeleton className="w-full h-[300px] rounded-lg" />
        <Skeleton className="w-full h-[300px] rounded-lg" />
        <Skeleton className="w-full h-[300px] rounded-lg" />
      </div>
    );
  if (!notes) return <div>No notes found</div>;

  return (
    <div className="grid gap-4 grid-col ">
      <UploadButton fileId={fileid} />
      {notes.map((note) => (
        <div key={note.id}>
          <NoteCard note={note} />
        </div>
      ))}
    </div>
  );
}

export function UploadButton({ fileId }: { fileId: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ToggleHandler = (v: boolean) => {
    if (!v) {
      setIsOpen(v);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={ToggleHandler}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}> Add Note</Button>
        </DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle />
          <NoteForm fileId={fileId} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
