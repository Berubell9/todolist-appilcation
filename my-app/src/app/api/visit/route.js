export const runtime = "nodejs";

export async function GET() {
  console.log("Time :", new Date().toISOString());
  return Response.json(
    { message: "visit recorded (Status OK)", status: 200 },
    { status: 200 }
  );
}