export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((url) =>
      url.trim(),
    );

    if (!origin) {
      return callback(new Error('Not allowed by CORS - missing origin'));
    }

    if (allowedOrigins?.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
