import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import prisma from "@/db";

import { z } from "zod";

export const appRouter = router({
  AuthCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user.email || !user.given_name || !user.family_name)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // Check if the user is in the database
    const dbUser = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      //create new user in db
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.given_name,
          lastName: user.family_name,
        },
      });
    }
    return { success: true };
  }),

  createNote: privateProcedure
    .input(
      z.object({
        fileId: z.string(),
        title: z.string(),
        subtitle: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dbFile = await prisma.file.findFirst({
        where: {
          id: input.fileId,
        },
      });

      if (!dbFile) throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.note.create({
        data: {
          title: input.title,
          subtitle: input.subtitle,
          content: input.content,
          fileId: input.fileId,
        },
      });

      return { success: true };
    }),

  editNote: privateProcedure
    .input(
      z.object({
        noteId: z.string(),
        title: z.string(),
        subtitle: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const dbNote = await prisma.note.findFirst({
        where: {
          id: input.noteId,
        },
      });
      if (!dbNote) throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.note.update({
        where: {
          id: input.noteId,
        },
        data: {
          title: input.title,
          subtitle: input.subtitle,
          content: input.content,
        },
      });
      return { success: true };
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await prisma.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx;

    return await prisma.file.findMany({
      where: {
        userId: userId,
      },
    });
  }),

  getUserNotes: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      return await prisma.note.findMany({
        where: {
          fileId: input.fileId,
        },
      });
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = prisma.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.file.delete({
        where: {
          id: input.id,
        },
      });
      return file;
    }),

  deleteNote: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const note = prisma.note.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!note) throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
