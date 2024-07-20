import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/app/_trpc/client";

interface NoteParams {
  id: string;
  content: string;
  fileId: string | null;
  createdAt: string;
  updatedAt: string;
  subtitle: string;
  title: string;
}

const formSchema = z.object({
  title: z.string().min(2).max(30),
  subtitle: z.string().min(2).max(50),
  content: z.string().min(2).max(300),
  noteId: z.string(),
});

export default function EditNoteForm({
  note,
  setIsOpen,
}: {
  note: NoteParams;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note.title,
      subtitle: note.subtitle,
      content: note.content,
      noteId: note.id,
    },
  });

  const utils = trpc.useContext();

  const { mutate: editNote } = trpc.editNote.useMutation({
    onSuccess: () => {
      utils.getUserNotes.invalidate();
      setIsOpen(false);
    },
    onMutate: () => {
      console.log("editing note");
    },
    onSettled: () => {
      console.log("settled");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editNote(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
