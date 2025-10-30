"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PlayerSearchProps {
  onSearch: (playerTag: string) => void
  isLoading?: boolean
}

export function PlayerSearch({ onSearch, isLoading }: PlayerSearchProps) {
  const [playerTag, setPlayerTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerTag.trim()) {
      onSearch(playerTag.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="playerTag" className="text-lg font-semibold">
          Enter Player Tag
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="playerTag"
              type="text"
              placeholder="#2PP (or just 2PP)"
              value={playerTag}
              onChange={(e) => setPlayerTag(e.target.value)}
              className="h-12 text-lg pr-10"
              disabled={isLoading}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button type="submit" size="lg" disabled={isLoading || !playerTag.trim()}>
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your Brawl Stars player tag to get personalized meta recommendations
        </p>
      </div>
    </form>
  )
}
