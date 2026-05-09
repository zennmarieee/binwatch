import QRCode from "qrcode";

export async function generateQRCode(binId: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/report?bin=${binId}`;
  
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: "#102013",
      light: "#ffffff",
    },
  });

  return qrDataUrl;
}