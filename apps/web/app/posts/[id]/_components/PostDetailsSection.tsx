"use client";

import { PostActions } from "@/app/posts/[id]/_components/PostActions";
import { PostStats } from "@/app/posts/[id]/_components/PostStats";
import { PostType } from "@workspace/db/src/schema/posts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@workspace/ui/components/dropdown-menu";
import { DropdownMenu } from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import React from "react";

// Define the props interface
interface PostDetailsSectionProps {
  post: PostType;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  isLikePending: boolean;
  currentUserId?: string; // Add current user ID prop
  onDelete: () => Promise<void>;
  isDeletePending?: boolean;
}

// Export the component function
export function PostDetailsSection({
  post,
  isLiked,
  likeCount,
  onLike,
  isLikePending,
  currentUserId,
  onDelete,
  isDeletePending = false,
}: PostDetailsSectionProps) {
  const isOwnPost = currentUserId === post.owner._id;
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await onDelete();
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
        {post.name}
      </h1>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <Link
          href={`/profile/${post.owner.name}`}
          aria-label={`View profile of ${post.owner.name}`}
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={post.owner.image ?? ""}
              alt={post.owner.name}
            />
            <AvatarFallback>{post.owner.name[0] || "?"}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col flex-grow">
          <Link
            href={`/profile/${post.owner.username}`}
            className="font-semibold hover:underline"
          >
            {post.owner.name}
          </Link>
          <span className="text-sm text-muted-foreground">
            {/* Placeholder for follower count */}
          </span>
        </div>

        {/* Conditionally render Follow Button */}
        {!isOwnPost ? (
          <Button
          //   variant={isFollowing ? "secondary" : "outline"}
          //   size="sm"
          //   onClick={onFollowToggle}
          //   disabled={isFollowPending}
          // >
          //   {isFollowPending ? "..." : isFollowing ? "Following" : "Follow"}
          >
            Follow
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeletePending}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteConfirm}
                      disabled={isDeletePending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeletePending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Description */}
      {post.description && (
        <p className="text-foreground/80 text-base whitespace-pre-wrap">
          {post.description}
        </p>
      )}

      {/* Tags & Categories */}
      {(post.tags?.length || 0 > 0 || post.categories?.length || 0 > 0) && (
        <div className="flex flex-wrap gap-2">
          {post.categories?.map((tag: string) => (
            <Badge
              key={`cat-${tag}`}
              variant="secondary"
              className="capitalize"
            >
              {tag.replace("-", " ")}
            </Badge>
          ))}
          {post.tags?.map((tag: string) => (
            <Badge key={`tag-${tag}`} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <PostStats
        views={post.analytics?.views}
        likes={likeCount}
        comments={post.commentsCount}
        createdAt={post.createdAt}
      />

      {/* Action Buttons */}
      <PostActions
        isLiked={isLiked}
        onLike={onLike}
        isLikePending={isLikePending}
        // Pass share handler if needed
      />
    </div>
  );
}
