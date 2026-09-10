export const hasEmailIdentity = (user?: {
  identities?: Array<{ provider?: string }> | null;
}) =>
  Boolean(user?.identities?.some((identity) => identity.provider === "email"));

export const isAllowedPrimaryAccount = (user?: {
  identities?: Array<{ provider?: string }> | null;
}) => hasEmailIdentity(user);
