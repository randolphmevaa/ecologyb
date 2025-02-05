interface Activity {
    id: number;
    title: string;
    time: string;
  }
  
  interface RecentActivityProps {
    activities: Activity[];
  }
  
  export function RecentActivity({ activities }: RecentActivityProps) {
    return (
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {index !== activities.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-sm text-gray-900 hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <time
                        className="font-body text-sm text-gray-500"
                        dateTime={activity.time}
                      >
                        {activity.time}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  