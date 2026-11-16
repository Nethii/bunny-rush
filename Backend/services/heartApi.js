async function fetchPuzzle() {
  const response = await fetch(process.env.HEART_API);
  const data = await response.json();
  
  return {
    imageUrl: data.question,
    solution: data.solution,
  };
}

module.exports = { fetchPuzzle };