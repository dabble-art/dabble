"use client";

import { useState, createContext, useContext } from "react";
import { 
  Home, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Settings, 
  ChevronRight,
  Palette,
  Trophy,
  HelpCircle,
  Newspaper,
  BookOpen,
  Share2,
  Heart,
  Menu,
  FileText,
  Lock,
  Star,
  DollarSign,
  Store
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isExpanded: false,
  setIsExpanded: () => {},
});

const mainNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "For You", href: "/explore", icon: Star },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Communities", href: "/communities", icon: Users },
];

const recentCommunities = [
  { name: "Digital Art", href: "/c/digital-art", icon: "🎨" },
  { name: "AI Art", href: "/c/ai-art", icon: "🤖" },
  { name: "Traditional", href: "/c/traditional", icon: "✏️" },
  { name: "Photography", href: "/c/photography", icon: "📸" },
  { name: "Animation", href: "/c/animation", icon: "🎬" },
];

const moreItems = [
  { name: "Challenges", href: "/challenges", icon: Trophy, beta: true },
  
]

const resources = [
  { name: "Premium", href: "/premium", icon: Star },
  { name: "Rewards", href: "/rewards", icon: DollarSign },
  { name: "Help Center", href: "/help", icon: HelpCircle },
  { name: "About Dabble", href: "/about", icon: BookOpen },
];

interface SidebarSectionProps {
  title: string;
  items: any[];
  isExpanded: boolean;
  defaultOpen?: boolean;
}

function SidebarSection({ title, items, isExpanded, defaultOpen = false }: SidebarSectionProps) {
  const pathname = usePathname();
  
  return (
    <Collapsible defaultOpen={defaultOpen} className="space-y-2">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground pt-2">
        {isExpanded && (
          <>
            {title}
            <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
          </>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted relative group",
              pathname === item.href && "bg-muted",
              !isExpanded && "justify-center"
            )}
          >
            {typeof item.icon === 'string' ? (
              <span className="text-base">{item.icon}</span>
            ) : (
              <item.icon className="h-4 w-4 flex-shrink-0" />
            )}
            {isExpanded && (
              <span className="flex-1">
                {item.name}
                {item.beta && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    BETA
                  </span>
                )}
              </span>
            )}
            {!isExpanded && (
              <div className="absolute left-full ml-2 hidden group-hover:block z-50">
                <div className="bg-popover px-2 py-1 rounded-md text-sm whitespace-nowrap shadow-md">
                  {item.name}
                </div>
              </div>
            )}
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function MainSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <DesktopSidebar />
    </SidebarContext.Provider>
  );
}

// Desktop sidebar
const DesktopSidebar: React.FC = () => {
  const { isExpanded, setIsExpanded } = useContext(SidebarContext);
  
  return (
    <div className={cn(
      "hidden md:flex flex-col border-r transition-all duration-300 fixed top-16 left-0 h-[calc(100vh-64px)] z-50 bg-background bg-none border-t-0",
      isExpanded ? "w-64" : "w-11"
    )}>
      <div className="flex flex-col h-full">
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute -right-3.5 top-20 z-30 h-7 w-7 rounded-full border bg-background p-0 hover:bg-background"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </Button>

        <div className="flex-1 px-2 py-4 space-y-6 overflow-hidden">
          {/* Main Navigation */}
          <SidebarSection
            title="NAVIGATION"
            items={mainNavItems}
            isExpanded={isExpanded}
            defaultOpen={true}
          />  

          {/* Recent Communities */}
          <SidebarSection 
            title="RECENT" 
            items={recentCommunities} 
            isExpanded={isExpanded}
            defaultOpen={true}
          />

<SidebarSection
            title="MORE"
            items={moreItems}
            isExpanded={isExpanded}
            defaultOpen={true}
          />

          {/* Resources */}
          <SidebarSection 
            title="RESOURCES" 
            items={resources} 
            isExpanded={isExpanded}
            defaultOpen={true}
          />
        </div>

        {/* Footer */}
        <div className={cn(
          "mt-auto border-t p-4",
          !isExpanded && "px-2"
        )}>
          <div className={cn(
            !isExpanded && "items-center",
            isExpanded ? "flex items-center justify-between" : "flex flex-col space-y-2"
          )}>
            <span className="text-sm text-muted-foreground">
              {isExpanded ? "© 2025 Dabble.art" : "©"}
            </span>
            <div className={cn(
              "flex gap-3 text-sm text-muted-foreground",
              !isExpanded && "flex-col items-center gap-2"
            )}>
              <Link href="https://discord.com/invite/jG6gYzePmr" target="_blank" className="hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                {isExpanded && <span className="sr-only">Contact</span>}
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                <FileText className="h-4 w-4" />
                {isExpanded && <span className="sr-only">Terms of Service</span>}
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                <Lock className="h-4 w-4" />
                {isExpanded && <span className="sr-only">Privacy Policy</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};