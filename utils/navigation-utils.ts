/**
 * Navigation utilities - centralized functions for navigation handling
 */

/**
 * Navigate to plant details screen
 */
export const navigateToPlantDetails = (router: any, plantId: string) => {
  router.push(`/about/${plantId}`);
};

/**
 * Navigate to edit plant screen
 */
export const navigateToEditPlant = (router: any, plantId: string) => {
  router.push(`/add-plant?edit=${plantId}`);
};

/**
 * Navigate to tasks screen
 */
export const navigateToTasks = (router: any) => {
  router.push('/tasks');
};

/**
 * Navigate to articles screen
 */
export const navigateToArticles = (router: any) => {
  router.push('/articles');
};

/**
 * Navigate to specific article
 */
export const navigateToArticle = (router: any, articleId: string) => {
  router.push(`/article/${articleId}`);
};

export const navigateToMyGarden = (router: any) => {
  router.push('/(tabs)/my-garden');
};

export const navigateToAddPlant = (router: any) => {
  router.push('/add-plant');
};

/**
 * Navigate back
 */
export const navigateBack = (router: any) => {
  router.back();
}; 