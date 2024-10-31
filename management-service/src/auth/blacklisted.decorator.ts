import { SetMetadata } from "@nestjs/common";

export const IsNotBlacklisted = () => SetMetadata("isNotBlacklisted", true);
