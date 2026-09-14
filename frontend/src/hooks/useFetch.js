import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook.
 * @param {Function} fetchFn - async function that returns a response with .data
 * @param {Array} deps - dependency array (re-fetches when deps change)
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch(getTasks);
 */
const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export default useFetch;
