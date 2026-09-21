import { ROLE_CATEGORIES, RoleCategory } from './rolesData';

export { ROLE_CATEGORIES };
export type { RoleCategory };

/**
 * Récupère une catégorie par son identifiant unique
 */
export const getCategoryById = (id: string): RoleCategory | undefined => {
  return ROLE_CATEGORIES.find((cat) => cat.id === id);
};

/**
 * Récupère le premier rôle par défaut d'une catégorie
 */
export const getDefaultRoleForCategory = (categoryId: string): string => {
  const cat = getCategoryById(categoryId);
  return cat && cat.roles.length > 0 ? cat.roles[0] : 'Particulier';
};
