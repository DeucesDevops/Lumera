import { notFound } from "../../shared/errors/http-error";
import type { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getProfile(userId: string) {
    const profile = await this.repository.getProfile(userId);

    if (!profile.user || profile.user.deletedAt) {
      throw notFound("User not found.");
    }

    return {
      user: {
        id: profile.user.id,
        email: profile.user.email,
        emailVerifiedAt: profile.user.emailVerifiedAt,
        createdAt: profile.user.createdAt,
      },
      preferences: profile.preferences ?? null,
      latestConsent: profile.latestConsent ?? null,
    };
  }

  async upsertPreferences(
    userId: string,
    input: {
      goal: "track_cycle" | "trying_to_conceive" | "pregnant" | "postpartum";
      timezone?: string | undefined;
      units?: string | undefined;
    },
  ) {
    const preferences = await this.repository.upsertPreferences(userId, input);

    if (!preferences) {
      throw new Error("Failed to save preferences.");
    }

    return preferences;
  }

  async createConsent(
    userId: string,
    input: {
      healthDataStorage: boolean;
      reminderNotifications: boolean;
      anonymousAnalytics: boolean;
      acceptedPrivacyVersion: string;
      acceptedTermsVersion: string;
    },
  ) {
    const consent = await this.repository.createConsent(userId, input);

    if (!consent) {
      throw new Error("Failed to save consent.");
    }

    return consent;
  }

  softDeleteUser(userId: string) {
    return this.repository.softDeleteUser(userId);
  }
}
