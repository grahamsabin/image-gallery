// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.query.secret !== process.env.REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Invalidate token'})
    }

    try {
      // regenerate our index route showing the images
      //TODO: Check if this line gives me issues
      await res.revalidate('/') 
      return res.json({ revalidated: true })
    } catch (err) {
      return res.status(500).send('Error revalidating')
    }
  }
