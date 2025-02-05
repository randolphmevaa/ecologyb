export interface RecentUsersTableProps {
  // Add any existing props...
  accentColor?: string; // new prop
}

export function RecentUsersTable({ accentColor }: RecentUsersTableProps) {
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
      // Add more users...
    ];
  
    return (
      <div className="overflow-x-auto">
        <table
      className="w-full"
      // If accentColor is provided, apply it as the border color:
      style={{ border: accentColor ? `1px solid ${accentColor}` : undefined }}
    >
          <thead>
            <tr className="border-b border-gray-200">
              <th className="font-header text-sm font-semibold text-gray-900 pb-4 text-left">Name</th>
              <th className="font-header text-sm font-semibold text-gray-900 pb-4 text-left">Email</th>
              <th className="font-header text-sm font-semibold text-gray-900 pb-4 text-left">Role</th>
              <th className="font-header text-sm font-semibold text-gray-900 pb-4 text-left">Status</th>
              <th className="font-header text-sm font-semibold text-gray-900 pb-4 text-left"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 font-body text-gray-900">{user.name}</td>
                <td className="py-4 font-body text-gray-500">{user.email}</td>
                <td className="py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    user.status === 'Active' 
                      ? 'bg-secondary/20 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-primary hover:text-primary/80 font-body text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }