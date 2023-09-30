let count = 0;

export function GET() {
  count++;
  return new Response(
    JSON.stringify({
      count,
    })
  );
}
