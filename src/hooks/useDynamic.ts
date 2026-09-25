import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useEntity(entity: string, fallback: any[]) {
  const [data, setData] = useState<any[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    api
      .list(entity)
      .then((d) => {
        if (alive) setData(Array.isArray(d) ? d : fallback);
      })
      .catch((cause: unknown) => {
        if (alive) {
          setData(fallback);
          setError(cause instanceof Error ? cause : new Error(`Failed to load ${entity}`));
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [entity]);
  return { data, loading, error };
}
