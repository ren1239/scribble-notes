"use client";

import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { Ghost, Loader2, MessageSquare, Plus, TrashIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

import { format } from "date-fns";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Dashboard() {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:px-10 px-2 ">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-800">My Files</h1>
        <UploadButton />
      </div>
      {/* display all files */}

      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file, i) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-400 "></div>
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3  ">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 " />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 " />
                    mocked
                  </div>
                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    size={"sm"}
                    variant={"destructive"}
                    className="w-full"
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className=" h-4 w-4 animate-spin" />
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <div className="flex flex-col sm:flex-row items-center justify-center h-full gap-10 p-16">
          {[
            Array.from({ length: 3 }).map((_, i) => (
              <div className="" key={i}>
                <Skeleton className="h-[125px] w-[150px] rounded-xl" />
                <div className="space-y-2 py-4">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            )),
          ]}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 ">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl  "> Pretty empty here</h3>
          <p>Let&apos;s upload your first PDF</p>
        </div>
      )}
    </main>
  );
}
