import type { Cv, Profile } from "../schemas.js";

export type PublicProfile = Omit<Profile, "birthDate"> & { age?: number };

export type PublicCv = Omit<Cv, "profile"> & { profile: PublicProfile };

export function ageAt(birthDate: string, now: Date = new Date()): number {
  const birth = new Date(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function publicProfile({ birthDate, ...profile }: Profile, now?: Date): PublicProfile {
  return birthDate ? { ...profile, age: ageAt(birthDate, now) } : profile;
}

export function publicCv(cv: Cv, now?: Date): PublicCv {
  return { ...cv, profile: publicProfile(cv.profile, now) };
}
