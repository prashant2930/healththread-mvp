import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { DataRepository } from './repositories/DataRepository';
import { DemoRepository } from './repositories/DemoRepository';
// import { SupabaseRepository } from './repositories/SupabaseRepository';

const DataContext = createContext<DataRepository | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [repo, setRepo] = useState<DataRepository | null>(null);

  useEffect(() => {
    // Currently defaulting to demo repo
    setRepo(new DemoRepository());
  }, []);

  if (!repo) return null;

  return <DataContext.Provider value={repo}>{children}</DataContext.Provider>;
}

export function useData(): DataRepository {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
