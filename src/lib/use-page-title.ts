import { useEffect } from 'react';

const SITE = 'Ile-Oti';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE;
    return () => {
      document.title = SITE;
    };
  }, [title]);
}
