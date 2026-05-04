function monthRange(month, year) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { start, end };
}

function lastSixMonths() {
  const now = new Date();
  const months = [];

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() - index, 1));
    months.push({
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
      label: `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`
    });
  }

  return months;
}

module.exports = { monthRange, lastSixMonths };
