import { City, Country, State } from 'country-state-city';
import type { ICity, ICountry, IState } from 'country-state-city';

export type { ICity, ICountry, IState };

export interface LocationNames {
  country: string;
  state: string;
  city: string;
}

export interface LocationCodes {
  countryCode: string;
  stateCode: string;
}

export interface ResolvedLocation extends LocationNames, LocationCodes {}

export function getAllCountries(): ICountry[] {
  return Country.getAllCountries();
}

export function getCountryByCode(isoCode: string): ICountry | undefined {
  return Country.getCountryByCode(isoCode);
}

export function getCountryByName(name: string): ICountry | undefined {
  const normalized = name.trim().toLowerCase();
  return Country.getAllCountries().find(
    (country) => country.name.toLowerCase() === normalized,
  );
}

export function getStatesOfCountry(countryCode: string): IState[] {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode);
}

export function getStateByCode(
  countryCode: string,
  stateCode: string,
): IState | undefined {
  return State.getStateByCodeAndCountry(stateCode, countryCode);
}

export function getStateByName(
  countryCode: string,
  stateName: string,
): IState | undefined {
  const normalized = stateName.trim().toLowerCase();
  return getStatesOfCountry(countryCode).find(
    (state) => state.name.toLowerCase() === normalized,
  );
}

export function getCitiesOfState(
  countryCode: string,
  stateCode: string,
): ICity[] {
  if (!countryCode) return [];

  if (stateCode) {
    return City.getCitiesOfState(countryCode, stateCode) ?? [];
  }

  return City.getCitiesOfCountry(countryCode) ?? [];
}

/** City names can repeat within a state in country-state-city; keep first occurrence. */
export function getUniqueCityNames(
  countryCode: string,
  stateCode: string,
): string[] {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const city of getCitiesOfState(countryCode, stateCode)) {
    const key = city.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(city.name);
  }

  return names;
}

export function getDialCode(countryCode: string): string {
  const country = getCountryByCode(countryCode);
  if (!country?.phonecode) return '+1';
  return country.phonecode.startsWith('+')
    ? country.phonecode
    : `+${country.phonecode}`;
}

export function guessDefaultCountryCode(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Kolkata') || timezone.includes('Calcutta'))
      return 'IN';
    if (
      timezone.startsWith('America/Toronto') ||
      timezone.startsWith('America/Vancouver')
    ) {
      return 'CA';
    }
    if (timezone.startsWith('America/')) return 'US';
    if (timezone.startsWith('Europe/London')) return 'GB';
    if (timezone.startsWith('Australia/')) return 'AU';
    if (timezone.startsWith('Asia/Dubai')) return 'AE';
    if (timezone.startsWith('Asia/Singapore')) return 'SG';
  } catch {
    // ignore
  }
  return 'IN';
}

export function resolveStateFromCity(
  countryCode: string,
  cityName: string,
): IState | undefined {
  if (!countryCode || !cityName) return undefined;

  const normalizedCity = cityName.trim().toLowerCase();
  for (const state of getStatesOfCountry(countryCode)) {
    const hasCity = getCitiesOfState(countryCode, state.isoCode).some(
      (city) => city.name.toLowerCase() === normalizedCity,
    );
    if (hasCity) {
      return state;
    }
  }

  return undefined;
}

export function resolveLocationFromNames(
  countryName: string,
  stateName: string,
  cityName: string,
): ResolvedLocation {
  const country = getCountryByName(countryName);
  const countryCode = country?.isoCode ?? '';

  let state =
    countryCode && stateName
      ? getStateByName(countryCode, stateName)
      : undefined;

  if (!state && countryCode && cityName) {
    state = resolveStateFromCity(countryCode, cityName);
  }

  const stateCode = state?.isoCode ?? '';

  return {
    country: country?.name ?? countryName,
    state: state?.name ?? stateName,
    city: cityName,
    countryCode,
    stateCode,
  };
}

export function splitPhoneNumber(phone: string): {
  countryCode: string;
  nationalNumber: string;
} {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { countryCode: guessDefaultCountryCode(), nationalNumber: '' };
  }

  const countries = [...getAllCountries()].sort(
    (a, b) => getDialCode(b.isoCode).length - getDialCode(a.isoCode).length,
  );

  for (const country of countries) {
    const dialCode = getDialCode(country.isoCode);
    if (trimmed.startsWith(dialCode)) {
      return {
        countryCode: country.isoCode,
        nationalNumber: trimmed
          .slice(dialCode.length)
          .replace(/^[\s-]+/, '')
          .trim(),
      };
    }
  }

  return {
    countryCode: guessDefaultCountryCode(),
    nationalNumber: trimmed,
  };
}

export function buildPhoneNumber(
  dialCode: string,
  nationalNumber: string,
): string {
  const cleaned = nationalNumber.replace(/[^0-9\-() ]/g, '').trim();
  if (!cleaned) return dialCode;
  return `${dialCode} ${cleaned}`.trim();
}

export function ensureOptionIncluded(
  options: string[],
  currentValue: string,
): string[] {
  if (!currentValue) return options;
  if (
    options.some(
      (option) => option.toLowerCase() === currentValue.toLowerCase(),
    )
  ) {
    return options;
  }
  return [currentValue, ...options];
}
