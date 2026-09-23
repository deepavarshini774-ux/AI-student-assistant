/**
 * Central error handler. Every controller can just `throw` (thanks to
 * express-async-errors) and it lands here instead of crashing the server
 * or leaking stack traces to the client.
 */
export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500 ? "Something went wrong on our end." : err.message;

  res.status(status).json({ error: message });
}

export function notFound(req, res) {
  res.status(404).json({ error: "Route not found." });
}
