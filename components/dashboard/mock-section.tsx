"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MockSectionProps {
  title: string;
}

export function MockSection({ title }: MockSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">{title}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title} Section</CardTitle>
          <CardDescription>
            This section is under development. All {title.toLowerCase()}{" "}
            features will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Mock implementation for {title}. This would contain all the relevant
            features and data for managing your {title.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
