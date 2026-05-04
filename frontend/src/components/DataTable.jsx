export default function DataTable({ columns, rows, emptyMessage = 'Nenhum registro encontrado' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-pastel-muted">
          <tr>
            {columns.map((column) => (
              <th className={`py-2 ${column.align === 'right' ? 'text-right' : ''}`} key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="border-t border-pastel-line">
              <td className="py-4 text-center text-pastel-muted" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : rows.map((row) => (
            <tr className="border-t border-pastel-line" key={row.id}>
              {columns.map((column) => (
                <td className={`py-3 ${column.align === 'right' ? 'text-right' : ''}`} key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
