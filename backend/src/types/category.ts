export interface CategoryCreateDTO {
  name: string;
  slug: string;
}

export interface CategoryUpdateDTO {
  name?: string;
  slug?: string;
}
