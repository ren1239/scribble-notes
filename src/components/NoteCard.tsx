"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import NoteForm from "./NoteForm";
import EditNoteForm from "./EditNoteForm";

interface NoteParams {
  id: string;
  content: string;
  fileId: string | null;
  createdAt: string;
  updatedAt: string;
  subtitle: string;
  title: string;
}

export function NoteCard({ note }: { note: NoteParams }) {
  const { id, content, fileId, createdAt, updatedAt, subtitle, title } = note;

  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useContext();

  const { mutate: deleteNote } = trpc.deleteNote.useMutation({
    onSuccess: () => {
      utils.getUserNotes.invalidate(); // Invalidate the getUserNotes query
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="truncate">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <p className="line-clamp-3">{content}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <EditButton note={note} />
        <Button
          onClick={() => deleteNote({ id })}
          size={"sm"}
          variant={"destructive"}
        >
          {currentlyDeletingFile === id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <TrashIcon className="w-4 h-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function EditButton({ note }: { note: NoteParams }) {
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
          <Button variant={"outline"} onClick={() => setIsOpen(true)}>
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle />
          <EditNoteForm note={note} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
