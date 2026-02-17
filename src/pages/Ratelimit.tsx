import {useState, useEffect} from 'react';
import {checkRateLimit, recordRateLimit, type RateLimitResult} from '../lib/rate-limit';
import {Button} from '../components/button/Button';

interface LogEntry {
  id: string;
  timestamp: Date;
  status: 'success' | 'rate-limited' | 'retry-success' | 'retry-failed';
  message: string;
  remaining?: number;
  totalHits?: number;
}

export const Ratelimit = () => {
  const rateLimitConfig = {
    maxRequests: 2,
    maxRetries: 3,
    windowMs: 5000,
    keyPrefix: 'chat',
  };

  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Update rate limit status periodically
  useEffect(() => {
    const updateStatus = async () => {
      const status = await checkRateLimit(rateLimitConfig);
      setRateLimitStatus(status);

      if (status.resetTime) {
        const remaining = Math.max(0, status.resetTime - Date.now());
        setCountdown(Math.ceil(remaining / 1000));
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!rateLimitStatus || rateLimitStatus.resetTime === null) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, rateLimitStatus.resetTime - Date.now());
      setCountdown(Math.ceil(remaining / 1000));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rateLimitStatus]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setLogs(prev => [
      {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  const makeRequest = async () => {
    setIsLoading(true);

    try {
      const rateLimitCheck = await checkRateLimit(rateLimitConfig);
      setRateLimitStatus(rateLimitCheck);

      if (!rateLimitCheck.allowed) {
        addLog({
          status: 'rate-limited',
          message: `Rate limit exceeded. Remaining: ${rateLimitCheck.remaining}, Total hits: ${rateLimitCheck.totalHits}`,
          remaining: rateLimitCheck.remaining,
          totalHits: rateLimitCheck.totalHits,
        });

        const isAllowed = await rateLimitCheck.retry();

        if (!isAllowed) {
          addLog({
            status: 'retry-failed',
            message: 'Rate limit exceeded after retries',
            remaining: 0,
            totalHits: rateLimitCheck.totalHits,
          });
          setIsLoading(false);
          return;
        }

        addLog({
          status: 'retry-success',
          message: 'Request allowed after retry',
          remaining: rateLimitCheck.remaining,
          totalHits: rateLimitCheck.totalHits,
        });
      }

      await recordRateLimit(rateLimitConfig);

      const updatedStatus = await checkRateLimit(rateLimitConfig);
      setRateLimitStatus(updatedStatus);

      addLog({
        status: 'success',
        message: 'Request successful',
        remaining: updatedStatus.remaining,
        totalHits: updatedStatus.totalHits,
      });
    } catch (error) {
      addLog({
        status: 'retry-failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const getStatusColor = (allowed: boolean) => {
    return allowed ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBg = (allowed: boolean) => {
    return allowed ? 'bg-green-100' : 'bg-red-100';
  };

  const getLogStatusColor = (status: LogEntry['status']) => {
    switch (status) {
      case 'success':
      case 'retry-success':
        return 'text-green-600';
      case 'rate-limited':
      case 'retry-failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Rate Limit Demo</h1>

      {/* Configuration Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            Max Requests: <span className="font-mono">{rateLimitConfig.maxRequests}</span>
          </div>
          <div>
            Window: <span className="font-mono">{rateLimitConfig.windowMs / 1000}s</span>
          </div>
          <div>
            Max Retries: <span className="font-mono">{rateLimitConfig.maxRetries}</span>
          </div>
          <div>
            Key Prefix: <span className="font-mono">{rateLimitConfig.keyPrefix}</span>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {rateLimitStatus && (
        <div className={`mb-6 p-4 rounded-lg ${getStatusBg(rateLimitStatus.allowed)}`}>
          <h2 className="text-lg font-semibold mb-3">Current Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className={`text-xl font-bold ${getStatusColor(rateLimitStatus.allowed)}`}>
                {rateLimitStatus.allowed ? 'Allowed' : 'Blocked'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Remaining Requests</div>
              <div className="text-xl font-bold">{rateLimitStatus.remaining}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Hits</div>
              <div className="text-xl font-bold">{rateLimitStatus.totalHits}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Reset In</div>
              <div className="text-xl font-bold">
                {countdown !== null ? formatTime(countdown) : '--'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Button */}
      <div className="mb-6">
        <Button onClick={makeRequest} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Make Request'}
        </Button>
      </div>

      {/* Request Log */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Request Log</h2>
          {logs.length > 0 && (
            <Button intent="secondary" size="small" onClick={clearLogs}>
              Clear Log
            </Button>
          )}
        </div>
        <div className="border rounded-lg overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No requests yet</div>
          ) : (
            <div className="divide-y">
              {logs.map(log => (
                <div key={log.id} className="p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className={`font-semibold ${getLogStatusColor(log.status)}`}>
                        {log.status === 'success' && '✓ Success'}
                        {log.status === 'rate-limited' && '⚠ Rate Limited'}
                        {log.status === 'retry-success' && '✓ Retry Success'}
                        {log.status === 'retry-failed' && '✗ Retry Failed'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{log.message}</div>
                      {log.remaining !== undefined && (
                        <div className="text-xs text-gray-500 mt-1">
                          Remaining: {log.remaining} | Total Hits: {log.totalHits}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 ml-4">
                      {log.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
