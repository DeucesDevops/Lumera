import type { DataRightsRepository } from "./data-rights.repository";

export class DataRightsService {
  constructor(private readonly repository: DataRightsRepository) {}

  exportUserData(userId: string) {
    return this.repository.exportUserData(userId);
  }

  async deleteAccount(userId: string) {
    const request = await this.repository.requestDeletion(userId);

    if (!request) {
      throw new Error("Failed to delete account.");
    }

    return request;
  }
}
