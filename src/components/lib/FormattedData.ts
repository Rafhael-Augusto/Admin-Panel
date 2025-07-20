export function utilFormattedDate() {
  const formatDate = (date: string | undefined) => {
    if (!date) return "";

    const [ano, mes, dia] = date.split("-");

    return `${dia}/${mes}/${ano}`;
  };

  return {
    formatDate,
  };
}
