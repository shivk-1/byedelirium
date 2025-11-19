export async function getCurrentReading() {
  const res = await fetch("http://127.0.0.1:5000/current");
  return await res.json();
}

export async function getHistory() {
  const res = await fetch("http://127.0.0.1:5000/history");
  return await res.json();
}
