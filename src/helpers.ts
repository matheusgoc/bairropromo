export function extractInitials(name?: string) {
  if (!name?.trim()) {
    return '';
  }

  const names = name.split(' ');
  if (name.length === 1) {
    const letters = names[0].split('');
    return letters[0].toUpperCase() + letters[1].toUpperCase();
  }

  return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
}
