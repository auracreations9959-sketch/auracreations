export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    const envKeys = Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY'));
    return res.status(200).json({
      status: 'ok',
      hasBlobToken,
      blobTokenPrefix: process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 10) + '...' : null,
      envKeys,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
