import type { Camera } from '@/types/Camera';

export const cameras: Camera[] = [
  { id: 'CAM-01', area: 'Area 1', label: 'Recepção', requiredLevel: 1, source: null },
  { id: 'CAM-02', area: 'Area 2', label: 'Corredor técnico', requiredLevel: 2, source: null },
  { id: 'CAM-03', area: 'Area 3', label: 'Sala restrita', requiredLevel: 3, source: null },
];
