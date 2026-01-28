import type { ReactNode } from 'react';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import '../src/index.css';

export function Layout({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
