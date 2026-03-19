import { useConfig } from '../../hooks/useConfig';

export function ConfigViewer() {
  const { data, isLoading, error } = useConfig();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">Error loading configuration: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Configuration</h3>
        {data.configPath ? (
          <p className="text-sm text-slate-600">
            Loaded from: <code className="bg-slate-100 px-2 py-1 rounded text-xs">{data.configPath}</code>
          </p>
        ) : (
          <p className="text-sm text-slate-600">Using default configuration</p>
        )}
      </div>

      <div className="space-y-6">
        <h4 className="text-base font-semibold text-slate-900">Clients</h4>
        {Object.entries(data.config.clients).map(([clientId, client]) => (
          <div key={clientId} className="border border-slate-200 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-slate-900 mb-3">{client.label}</h5>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-slate-700">Parser:</span>{' '}
                <span className="text-xs text-slate-600">{client.parser}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-700">Locations:</span>
                <ul className="mt-2 space-y-2">
                  {client.locations.map((location, idx) => (
                    <li key={idx} className="text-xs bg-slate-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {location.scope}
                        </span>
                        <code className="text-slate-700">{location.path}</code>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
