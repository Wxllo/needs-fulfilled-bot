import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode } from 'react';

interface DashboardTabsProps {
  workforceContent: ReactNode;
  organizationContent: ReactNode;
  performanceContent: ReactNode;
}

export function DashboardTabs({
  workforceContent,
  organizationContent,
  performanceContent,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="workforce" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex mb-6 bg-muted/50 p-1 rounded-lg">
        <TabsTrigger 
          value="workforce"
          className="data-[state=active]:bg-kpi-gold data-[state=active]:text-primary-foreground font-medium"
        >
          Workforce & Diversity
        </TabsTrigger>
        <TabsTrigger 
          value="organization"
          className="data-[state=active]:bg-kpi-gold data-[state=active]:text-primary-foreground font-medium"
        >
          Job & Organization
        </TabsTrigger>
        <TabsTrigger 
          value="performance"
          className="data-[state=active]:bg-kpi-gold data-[state=active]:text-primary-foreground font-medium"
        >
          Performance & Training
        </TabsTrigger>
      </TabsList>

      <TabsContent value="workforce" className="space-y-6">
        {workforceContent}
      </TabsContent>

      <TabsContent value="organization" className="space-y-6">
        {organizationContent}
      </TabsContent>

      <TabsContent value="performance" className="space-y-6">
        {performanceContent}
      </TabsContent>
    </Tabs>
  );
}
