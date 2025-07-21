'use client';

export default function Error({ error, reset }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
      <p className="mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}