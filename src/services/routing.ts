import { SUPPORT_SERVICES } from '../data/supportCatalog';

export interface RouteOption {
  id: string;
  name: string;
  department: string;
  isCoordinationHub: boolean;
}

export function getAvailableRoutes(): RouteOption[] {
  return SUPPORT_SERVICES.map((s) => ({
    id: s.id,
    name: s.name,
    department: s.name,
    isCoordinationHub: s.coordinationRole,
  }));
}

export function formatRoutePath(primaryRoute: string, additionalRoutes: string[]): string {
  if (additionalRoutes.length === 0) {
    return primaryRoute;
  }
  return `${primaryRoute} (Coordinating: ${additionalRoutes.join(', ')})`;
}
