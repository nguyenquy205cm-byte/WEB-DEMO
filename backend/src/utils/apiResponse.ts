export const success = (res: any, data: any, status = 200, message = "OK") =>
  res.status(status).json({ success: true, message, data });

export const fail = (res: any, message: string, status = 400, data?: any) => {
  const payload: any = { success: false, message };
  if (data !== undefined) payload.data = data;
  return res.status(status).json(payload);
};
