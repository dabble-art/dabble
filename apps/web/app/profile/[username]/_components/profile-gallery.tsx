"use client";

import { Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { ArtworkGrid } from "@/app/components/artwork-grid";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@workspace/ui/components/select";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";

export default function ProfileGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "latest" | "popular">(
    "relevance"
  );

  const { data: session } = authClient.useSession();
  const params = useParams();

  const { data: posts, isPending: isPostsPending } = useQuery({
    queryKey: ["posts", searchQuery, sortBy],
    queryFn: () =>
      api.public.posts.get({
        query: {
          sort: sortBy,
          owner: params.username as string,
        },
      }),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User's Artworks</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(value: "relevance" | "latest" | "popular") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ArtworkGrid
          posts={posts?.data ?? []}
          currentUserId={session?.user?.id}
        />
      </CardContent>
    </Card>
  );
}
