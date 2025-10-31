import pc from 'picocolors'

/**
 * Prints in console the incoming requests
 * @param {express.Request} req Request
 * @param {express.Response} _ Response
 * @param {express.NextFunction } next Next function
 */
export default function logRequest (req, _, next) {
  console.log(pc.magenta(`[REQUEST] ${req.method} ${pc.white(req.url)}`))
  next()
}
