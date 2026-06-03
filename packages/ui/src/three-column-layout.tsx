import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from './utils';

export interface ThreeColumnLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left sidebar width class (default: w-[280px]) */
  sidebarWidth?: string;
  /** Article list width class (default: w-[320px]) */
  listWidth?: string;
  /** Whether to show resize handles */
  resizable?: boolean;
}

const ThreeColumnLayout = React.forwardRef<HTMLDivElement, ThreeColumnLayoutProps>(
  ({ className, sidebarWidth = 'w-[280px]', listWidth = 'w-[320px]', resizable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-screen overflow-hidden',
          resizable && 'resize-x',
          className
        )}
        {...props}
      />
    );
  }
);
ThreeColumnLayout.displayName = 'ThreeColumnLayout';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'aside';
    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          'flex-shrink-0 border-r bg-background overflow-y-auto',
          className
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = 'Sidebar';

export interface ArticleListProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const ArticleList = React.forwardRef<HTMLElement, ArticleListProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          'flex-shrink-0 border-r bg-background overflow-y-auto',
          className
        )}
        {...props}
      />
    );
  }
);
ArticleList.displayName = 'ArticleList';

export interface ReaderProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const Reader = React.forwardRef<HTMLElement, ReaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'main';
    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          'flex-1 bg-background overflow-y-auto',
          className
        )}
        {...props}
      />
    );
  }
);
Reader.displayName = 'Reader';

/**
 * ThreeColumnLayout with preset widths for classic RSS reader experience
 */
const ClassicThreeColumnLayout = React.forwardRef<HTMLDivElement, ThreeColumnLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <ThreeColumnLayout
        ref={ref}
        className={cn('grid grid-cols-[280px_320px_1fr]', className)}
        {...props}
      />
    );
  }
);
ClassicThreeColumnLayout.displayName = 'ClassicThreeColumnLayout';

/**
 * Compact variant with narrower sidebar
 */
const CompactThreeColumnLayout = React.forwardRef<HTMLDivElement, ThreeColumnLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <ThreeColumnLayout
        ref={ref}
        className={cn('grid grid-cols-[220px_280px_1fr]', className)}
        {...props}
      />
    );
  }
);
CompactThreeColumnLayout.displayName = 'CompactThreeColumnLayout';

/**
 * Wide variant with wider article list
 */
const WideThreeColumnLayout = React.forwardRef<HTMLDivElement, ThreeColumnLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <ThreeColumnLayout
        ref={ref}
        className={cn('grid grid-cols-[280px_400px_1fr]', className)}
        {...props}
      />
    );
  }
);
WideThreeColumnLayout.displayName = 'WideThreeColumnLayout';

export {
  ThreeColumnLayout,
  Sidebar,
  ArticleList,
  Reader,
  ClassicThreeColumnLayout,
  CompactThreeColumnLayout,
  WideThreeColumnLayout,
};