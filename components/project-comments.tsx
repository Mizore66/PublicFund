"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Share2, ThumbsUp } from "lucide-react"

export function ProjectComments() {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for comments and updates
  const projectData = {
    comments: [
      {
        id: "1",
        user: {
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          handle: "alexj",
        },
        content:
          "This project is amazing! I'm so glad to see someone tackling this important issue. Looking forward to seeing the progress.",
        date: "2025-03-15T14:30:00",
        likes: 12,
      },
      {
        id: "2",
        user: {
          name: "Sam Rivera",
          avatar: "/placeholder.svg?height=40&width=40",
          handle: "samr",
        },
        content:
          "I've been following this project for a while and I'm impressed with the team's dedication. Just donated!",
        date: "2025-03-14T09:15:00",
        likes: 8,
      },
      {
        id: "3",
        user: {
          name: "Taylor Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          handle: "taylork",
        },
        content:
          "How will the funds be used specifically? I'm interested in the technical aspects of the implementation.",
        date: "2025-03-13T16:45:00",
        likes: 5,
      },
    ],
    updates: [
      {
        id: "1",
        title: "Project Launch",
        content:
          "We're excited to announce the launch of our Clean Water Initiative campaign. Thanks to everyone who has supported us so far! We've already begun preliminary work in our target communities and are making great progress.",
        date: "2025-03-15T10:00:00",
      },
      {
        id: "2",
        title: "First Milestone Reached",
        content:
          "We've reached our first funding milestone! This will allow us to begin preliminary work in our target communities. We've already ordered the first batch of water filtration systems and will begin installation next week.",
        date: "2025-03-20T14:30:00",
      },
    ],
  }

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    // In a real app, this would submit to an API
    setTimeout(() => {
      setIsSubmitting(false)
      setComment("")
      // Add the comment to the list
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="web3-card w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">Project Community</CardTitle>
        <CardDescription className="text-foreground/70">
          Join the conversation and stay updated on project progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="updates">Project Updates</TabsTrigger>
          </TabsList>
          <TabsContent value="comments" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50 min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      className="web3-button"
                      disabled={!comment.trim() || isSubmitting}
                      onClick={handleSubmitComment}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        <>
                          Post Comment
                          <MessageSquare className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {projectData.comments.map((comment) => (
                  <Card key={comment.id} className="bg-muted/30 border-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{comment.user.name}</p>
                              <p className="text-xs text-foreground/60">@{comment.user.handle}</p>
                            </div>
                            <p className="text-xs text-foreground/60">{formatDate(comment.date)}</p>
                          </div>
                          <p className="mt-2 text-sm">{comment.content}</p>
                          <div className="mt-2 flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-foreground/60 hover:text-foreground"
                            >
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              {comment.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-foreground/60 hover:text-foreground"
                            >
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Reply
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-foreground/60 hover:text-foreground"
                            >
                              <Share2 className="mr-1 h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="updates" className="space-y-4 pt-4">
            <div className="space-y-4">
              {projectData.updates.map((update) => (
                <Card key={update.id} className="bg-muted/30 border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{update.title}</CardTitle>
                    <CardDescription>{formatDate(update.date)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{update.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/60 hover:text-foreground">
                      <Share2 className="mr-1 h-4 w-4" />
                      Share Update
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

