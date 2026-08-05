import type { brandLogos } from '../assets/brandLogos';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  favoriteBrand: keyof typeof brandLogos;
}
