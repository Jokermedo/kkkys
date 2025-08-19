"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MobileTableProps<T> {
  data: T[]
  renderCard: (item: T, index: number) => React.ReactNode
  title?: string
  emptyMessage?: string
  actions?: Array<{
    label: string
    onClick: (item: T) => void
    variant?: "default" | "destructive"
  }>
}

export function MobileTable<T extends { id: string }>({
  data,
  renderCard,
  title,
  emptyMessage = "لا توجد بيانات",
  actions = [],
}: MobileTableProps<T>) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  if (data.length === 0) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => {
            const isExpanded = expandedItems.has(item.id)
            return (
              <div key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">{renderCard(item, index)}</div>

                  <div className="flex items-center gap-2 ml-4">
                    {actions.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={action.variant === "destructive" ? "text-red-600" : ""}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleExpanded(item.id)}>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-muted-foreground space-y-2">
                      {/* Additional details can be rendered here */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">المعرف:</span> {item.id}
                        </div>
                        {/* Add more details as needed */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
