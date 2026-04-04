const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const memberAnchorIdFromPosition = (position: string) => {
  const slug = slugify(position);
  return `member-${slug || 'profile'}`;
};

export const normalizeMemberAnchorId = (hashValue: string) => {
  const withoutHash = hashValue.replace(/^#/, '');
  const withoutPrefix = withoutHash.replace(/^member-/, '');
  const slug = slugify(withoutPrefix);
  return `member-${slug || 'profile'}`;
};
