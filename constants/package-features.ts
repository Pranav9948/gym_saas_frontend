export const PACKAGE_FEATURE_GROUPS = [
  {
    id: 'training',
    label: 'Training',
    items: [
      { id: 'personal_training', label: 'Personal training' },
      { id: 'group_classes', label: 'Group classes' },
      { id: 'cardio', label: 'Cardio' },
      { id: 'strength_training', label: 'Strength training' },
      { id: 'functional_training', label: 'Functional training' },
      { id: 'yoga', label: 'Yoga' },
    ],
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    items: [
      { id: 'customized_diet_plan', label: 'Customized diet plan' },
      { id: 'nutrition_consultation', label: 'Nutrition consultation' },
    ],
  },
  {
    id: 'recovery',
    label: 'Recovery & wellness',
    items: [
      { id: 'steam_bath', label: 'Steam bath' },
      { id: 'sauna', label: 'Sauna' },
      { id: 'cold_water_therapy', label: 'Cold water therapy' },
      { id: 'massage', label: 'Massage' },
      { id: 'stretching_zone', label: 'Stretching zone' },
    ],
  },
  {
    id: 'facilities',
    label: 'Gym facilities',
    items: [
      { id: 'swimming_pool', label: 'Swimming pool' },
      { id: 'locker_room', label: 'Locker room' },
      { id: 'shower', label: 'Shower' },
      { id: 'parking', label: 'Parking' },
      { id: 'towel_service', label: 'Towel service' },
      { id: 'wifi', label: 'Wi-Fi' },
    ],
  },
  {
    id: 'access',
    label: 'Access',
    items: [
      { id: 'all_day_access', label: 'All-day gym access' },
      { id: 'guest_passes', label: 'Guest passes' },
    ],
  },
] as const;

export type PackageFeatureId =
  (typeof PACKAGE_FEATURE_GROUPS)[number]['items'][number]['id'];

export const LIMITED_PACKAGE_FEATURES = [
  'steam_bath',
  'cold_water_therapy',
  'massage',
] as const satisfies readonly PackageFeatureId[];

export type LimitedPackageFeatureId = (typeof LIMITED_PACKAGE_FEATURES)[number];

const FEATURE_LABELS = Object.fromEntries(
  PACKAGE_FEATURE_GROUPS.flatMap((group) =>
    group.items.map((item) => [item.id, item.label]),
  ),
) as Record<PackageFeatureId, string>;

export function getPackageFeatureLabel(id: string): string {
  return FEATURE_LABELS[id as PackageFeatureId] ?? id.replaceAll('_', ' ');
}

export function isLimitedPackageFeature(id: string): id is LimitedPackageFeatureId {
  return (LIMITED_PACKAGE_FEATURES as readonly string[]).includes(id);
}

export function formatPackageFeatureLabel(
  id: string,
  monthlyLimit?: number,
): string {
  const label = getPackageFeatureLabel(id);
  if (monthlyLimit && monthlyLimit > 0) {
    return `${label} · ${monthlyLimit}/mo`;
  }
  return label;
}
